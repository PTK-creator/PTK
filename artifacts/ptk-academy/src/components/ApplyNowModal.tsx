import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSubmitApplication } from '@workspace/api-client-react';

const formSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Surname is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export function ApplyNowModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  const submitApplication = useSubmitApplication();
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const onSubmit = (data: FormValues) => {
    setSubmitError(null);
    submitApplication.mutate(
      { data },
      {
        onSuccess: () => {
          reset();
          alert('Application submitted successfully!');
          onClose();
        },
        onError: (err) => {
          setSubmitError(err?.error || 'Failed to submit application');
        }
      }
    );
  };

  return (
    <div className={`fixed inset-0 bg-[#0a0c0f]/95 flex justify-center items-center z-[2000] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-[#1a202c] border border-[rgba(0,112,243,0.3)] rounded-2xl p-10 w-full max-w-[400px] relative">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-2xl cursor-pointer text-white hover:text-gray-300"
          data-testid="button-close-modal"
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold uppercase mb-6 text-white text-center">APPLICATION NOW</h1>
        
        {submitError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-sm" data-testid="text-error">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} data-testid="form-application">
          <div className="mb-5">
            <label className="block text-xs text-[#a0aec0] mb-2">First Name</label>
            <input 
              {...register('first_name')} 
              className="w-full p-3 bg-[#12161a] border border-white/10 rounded-lg text-white outline-none focus:border-[#0070f3]"
              data-testid="input-first-name"
            />
            {errors.first_name && <span className="text-red-500 text-xs mt-1 block">{errors.first_name.message}</span>}
          </div>
          
          <div className="mb-5">
            <label className="block text-xs text-[#a0aec0] mb-2">Surname</label>
            <input 
              {...register('last_name')} 
              className="w-full p-3 bg-[#12161a] border border-white/10 rounded-lg text-white outline-none focus:border-[#0070f3]"
              data-testid="input-last-name"
            />
            {errors.last_name && <span className="text-red-500 text-xs mt-1 block">{errors.last_name.message}</span>}
          </div>

          <div className="mb-5">
            <label className="block text-xs text-[#a0aec0] mb-2">Date Of Birth</label>
            <input 
              type="date"
              {...register('dob')} 
              className="w-full p-3 bg-[#12161a] border border-white/10 rounded-lg text-white outline-none focus:border-[#0070f3] [color-scheme:dark]"
              data-testid="input-dob"
            />
            {errors.dob && <span className="text-red-500 text-xs mt-1 block">{errors.dob.message}</span>}
          </div>

          <div className="mb-5">
            <label className="block text-xs text-[#a0aec0] mb-2">Email</label>
            <input 
              type="email"
              {...register('email')} 
              className="w-full p-3 bg-[#12161a] border border-white/10 rounded-lg text-white outline-none focus:border-[#0070f3]"
              data-testid="input-email"
            />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
          </div>

          <div className="mb-5">
            <label className="block text-xs text-[#a0aec0] mb-2">Password</label>
            <input 
              type="password"
              {...register('password')} 
              className="w-full p-3 bg-[#12161a] border border-white/10 rounded-lg text-white outline-none focus:border-[#0070f3]"
              autoComplete="new-password"
              data-testid="input-password"
            />
            {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
          </div>
          
          <button 
            type="submit" 
            disabled={submitApplication.isPending}
            className="w-full inline-block bg-[#0056b3] hover:bg-[#0070f3] text-white px-7 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wide shadow-[0_4px_15px_rgba(0,112,243,0.3)] hover:shadow-[0_6px_20px_rgba(0,112,243,0.4)] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            data-testid="button-submit"
          >
            {submitApplication.isPending ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}