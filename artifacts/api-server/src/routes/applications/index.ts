import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import { SubmitApplicationBody } from "@workspace/api-zod";
import { logger } from "../../lib/logger";

const router: IRouter = Router();

/**
 * Returns an authenticated Supabase admin client using the service role key.
 * Never cache this — build it per-request so key rotation takes effect immediately.
 */
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment secrets.",
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// POST /applications — securely submit a student application
router.post("/applications", async (req, res): Promise<void> => {
  const parsed = SubmitApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid application body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { first_name, last_name, dob, email, password } = parsed.data;

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    req.log.error({ err }, "Supabase not configured");
    res.status(500).json({
      error:
        "Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    });
    return;
  }

  try {
    // Hash the password server-side — never store plain text
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          first_name,
          last_name,
          dob,
          email,
          password_hash,
          status: "pending",
        },
      ])
      .select("id")
      .single();

    if (error) {
      req.log.error({ supabaseError: error.message }, "Supabase insert failed");

      // Surface a safe, descriptive error — don't leak internal details
      if (error.code === "23505") {
        res.status(400).json({ error: "An application with this email already exists." });
      } else {
        res
          .status(500)
          .json({ error: "Failed to submit application. Please try again." });
      }
      return;
    }

    req.log.info({ id: data?.id }, "Application submitted");
    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      id: data?.id ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Unexpected error submitting application");
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// GET /applications/stats — return total application count (no sensitive data)
router.get("/applications/stats", async (req, res): Promise<void> => {
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    res.json({ total: 0 });
    return;
  }

  try {
    const { count, error } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true });

    if (error) {
      req.log.warn({ err: error.message }, "Failed to fetch application count");
      res.json({ total: 0 });
      return;
    }

    res.json({ total: count ?? 0 });
  } catch (err) {
    req.log.warn({ err }, "Stats query failed");
    res.json({ total: 0 });
  }
});

export default router;
