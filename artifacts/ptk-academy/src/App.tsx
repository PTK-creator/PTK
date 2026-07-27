import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import logoSrc from "@assets/logo_1785137707793.png";
import { ApplyNowModal } from './components/ApplyNowModal';
import { useGetApplicationStats } from '@workspace/api-client-react';

const queryClient = new QueryClient();

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1562774053-f569d66387c6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-[520px] h-[340px] overflow-hidden rounded-xl border-2 border-[#0044cc] shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute top-1/2 -translate-y-1/2 left-[15px] bg-[#161b22]/90 border border-[#e69500] text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-10 font-bold transition-all hover:bg-[#e69500] hover:text-[#0d1117] select-none"
        data-testid="button-slider-prev"
      >
        &#10094;
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute top-1/2 -translate-y-1/2 right-[15px] bg-[#161b22]/90 border border-[#e69500] text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-10 font-bold transition-all hover:bg-[#e69500] hover:text-[#0d1117] select-none"
        data-testid="button-slider-next"
      >
        &#10095;
      </button>
      
      <div 
        className="flex w-full h-full transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div key={i} className="min-w-full h-full relative">
            <img src={src} alt={`Slide ${i}`} className="w-full h-full object-cover brightness-75" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-[15px] left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <div 
            key={i} 
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors ${currentSlide === i ? 'bg-[#0070f3]' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}

function PtkAcademyApp() {
  const [activeSection, setActiveSection] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: stats } = useGetApplicationStats();

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'academic', label: 'Academic' },
    { id: 'fees', label: 'School Fees' },
    { id: 'sports', label: 'Sports' },
    { id: 'clubs', label: 'Clubs' },
    { id: 'staff', label: 'Staff' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="flex justify-between items-center px-[4%] py-[15px] bg-[#12161a]/95 fixed w-full top-0 left-0 z-[1000] border-b border-white/10 md:flex-row flex-col gap-4">
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleNavClick('home')}
          data-testid="logo-header"
        >
          <img src={logoSrc} alt="PTK Academy Logo" className="h-12" />
        </div>
        <nav className="flex-1 flex md:justify-end justify-center w-full">
          <ul className="flex items-center md:justify-end justify-center flex-wrap gap-4 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.id} className="whitespace-nowrap">
                <a 
                  onClick={() => handleNavClick(link.id)}
                  className={`text-[13px] font-semibold uppercase px-1 py-2 text-[#a0aec0] transition-colors cursor-pointer border-b-2 ${activeSection === link.id ? 'text-white border-[#0070f3]' : 'border-transparent hover:text-white hover:border-[#0070f3]'}`}
                  data-testid={`link-${link.id}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button 
                className="bg-[#0056b3] text-white px-4 py-2.5 text-xs rounded-full font-semibold uppercase tracking-wide shadow-[0_4px_15px_rgba(0,112,243,0.3)] hover:bg-[#0070f3] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,112,243,0.4)] transition-all cursor-pointer border-none"
                onClick={() => setIsModalOpen(true)}
                data-testid="button-apply-nav"
              >
                Apply Now
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* HOME SECTION */}
      {activeSection === 'home' && (
        <main className="page-section" data-testid="section-home">
          <div className="flex flex-col gap-10 w-full">
            <div className="max-w-[800px] mb-5 mx-auto w-full">
              <div className="flex md:flex-row flex-col items-center justify-between gap-[30px] w-full max-w-[1200px] mx-auto p-5 md:text-left text-center">
                <div className="flex-1">
                  <h1 className="text-[3.5rem] leading-[1.2] mb-5 font-extrabold uppercase text-white">
                    WARRIORS<br/>TILL THE <span className="text-[#ff0000]">END</span>
                  </h1>
                  <p className="text-xl leading-[1.6] text-[#a0aec0] max-w-[500px] md:mx-0 mx-auto">
                    Nurturing discipline, academic excellence, and leadership character in every student at PTK Academy School.
                  </p>
                  {stats?.total !== undefined && (
                    <div className="mt-4 inline-block bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-[#00df89] font-medium">
                      Join {stats.total} other applicants this year!
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full max-w-[600px] mt-[30px] flex justify-center">
                  <HeroSlider />
                </div>
              </div>

              <div className="text-center mt-[30px]">
                <button 
                  className="inline-block bg-[#0056b3] text-white px-7 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wide shadow-[0_4px_15px_rgba(0,112,243,0.3)] hover:bg-[#0070f3] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,112,243,0.4)] transition-all cursor-pointer border-none"
                  onClick={() => setIsModalOpen(true)}
                  data-testid="button-apply-hero"
                >
                  Apply Now
                </button>
              </div>
              
              <div className="flex flex-wrap gap-[15px] mt-5 justify-center">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn facebook" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/?hl=en" target="_blank" rel="noreferrer" className="social-icon-btn instagram" title="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn x-twitter" title="X (Twitter)"><i className="fab fa-x-twitter"></i></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn linkedin" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://wa.me/+263778788197" target="_blank" rel="noreferrer" className="social-icon-btn whatsapp" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ACADEMIC SECTION */}
      {activeSection === 'academic' && (
        <section className="page-section" data-testid="section-academic">
          <div className="max-w-[800px] mb-5">
            <h1 className="text-4xl font-extrabold uppercase tracking-wide mb-5 pb-2.5 border-b-2 border-white/5">Academic Programs</h1>
            <p className="text-base text-[#a0aec0] mb-[30px]">Our curriculum is designed to challenge thinking and inspire lifelong learning.</p>
          </div>

          <h2>Sciences</h2>
          <div className="sports-grid">
            {[
              { img: "https://images.unsplash.com/photo-1593787408750-23fe15c2d334?auto=format&fit=crop&w=300&q=80", title: "Mathematics", desc: "The study of numbers, structure, and space, essential for analytical problem-solving." },
              { img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80", title: "Biology", desc: "The study of living organisms, focusing on life processes, cells, and ecosystems." },
              { img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=300&q=80", title: "Physics", desc: "Exploring matter, energy, and the fundamental laws that govern the universe." },
              { img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=80", title: "Chemistry", desc: "Analyzing substances, their properties, and the reactions that transform them." },
              { img: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=300&q=80", title: "Geography", desc: "Studying Earth's landscapes, environments, and the relationship between people and places." }
            ].map((item, i) => (
              <div key={i} className="feature-card" data-testid={`card-academic-science-${i}`}>
                <img src={item.img} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="text-[15px] text-[#cbd5e1] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2>Commercials</h2>
          <div className="sports-grid">
            {[
              { img: "https://images.unsplash.com/photo-1593787408750-23fe15c2d334?auto=format&fit=crop&w=300&q=80", title: "Accounts", desc: "Recording, reporting, and analyzing financial transactions for business decision-making." },
              { img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80", title: "Economics", desc: "Understanding how societies manage resources, production, and consumer choices." },
              { img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=300&q=80", title: "Business Studies", desc: "Learning the fundamentals of management, marketing, and organizational strategy." }
            ].map((item, i) => (
              <div key={i} className="feature-card" data-testid={`card-academic-commercial-${i}`}>
                <img src={item.img} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="text-[15px] text-[#cbd5e1] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2>Humanities</h2>
          <div className="sports-grid">
            {[
              { img: "https://images.unsplash.com/photo-1593787408750-23fe15c2d334?auto=format&fit=crop&w=300&q=80", title: "History", desc: "Investigating past events, cultural developments, and their impact on today's world." },
              { img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80", title: "Literature", desc: "Engaging with written works to build critical thinking and cultural appreciation." },
              { img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=300&q=80", title: "Religious Studies", desc: "Exploring diverse belief systems, ethics, and the role of religion in society." }
            ].map((item, i) => (
              <div key={i} className="feature-card" data-testid={`card-academic-humanity-${i}`}>
                <img src={item.img} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="text-[15px] text-[#cbd5e1] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2>Languages</h2>
          <div className="sports-grid">
            {[
              { img: "https://images.unsplash.com/photo-1593787408750-23fe15c2d334?auto=format&fit=crop&w=300&q=80", title: "English", desc: "Developing advanced communication, composition, and analytical language skills." },
              { img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80", title: "Foreign Languages", desc: "Mastering a second language to enhance global communication and cross-cultural interaction." }
            ].map((item, i) => (
              <div key={i} className="feature-card" data-testid={`card-academic-language-${i}`}>
                <img src={item.img} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="text-[15px] text-[#cbd5e1] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2>Practicals</h2>
          <div className="sports-grid">
            {[
              { img: "https://images.unsplash.com/photo-1593787408750-23fe15c2d334?auto=format&fit=crop&w=300&q=80", title: "Computer Science", desc: "Gaining hands-on experience in programming, logic, and digital technology." },
              { img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80", title: "Food & Nutrition", desc: "Applying science to healthy living, food preparation, and dietary wellness." },
              { img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=300&q=80", title: "Technical Design", desc: "Focusing on creative engineering, craftsmanship, and problem-solving through design." }
            ].map((item, i) => (
              <div key={i} className="feature-card" data-testid={`card-academic-practical-${i}`}>
                <img src={item.img} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="text-[15px] text-[#cbd5e1] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FEES SECTION */}
      {activeSection === 'fees' && (
        <section className="page-section" data-testid="section-fees">
          <div className="max-w-[800px] mb-5">
            <h1 className="text-4xl font-extrabold uppercase tracking-wide mb-5 pb-2.5 border-b-2 border-white/5">School Fees & Financing</h1>
            <p className="text-base text-[#a0aec0] mb-[30px]">Review comprehensive programmatic costs for Day vs Boarding tracks and available settlement channels below.</p>
          </div>

          <h2>Fee Structures (Per Term)</h2>
          <div className="w-full overflow-x-auto bg-white/5 border border-white/10 rounded-xl mb-[45px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <table className="w-full border-collapse text-left min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 bg-[#0070f3]/15 text-[#00df89] font-bold uppercase text-[13px] tracking-wide border-b border-white/5">Curriculum</th>
                  <th className="p-4 bg-[#0070f3]/15 text-[#00df89] font-bold uppercase text-[13px] tracking-wide border-b border-white/5">Enrollment Model</th>
                  <th className="p-4 bg-[#0070f3]/15 text-[#00df89] font-bold uppercase text-[13px] tracking-wide border-b border-white/5">Tuition Fee</th>
                  <th className="p-4 bg-[#0070f3]/15 text-[#00df89] font-bold uppercase text-[13px] tracking-wide border-b border-white/5">Amenities & Levies</th>
                  <th className="p-4 bg-[#0070f3]/15 text-[#00df89] font-bold uppercase text-[13px] tracking-wide border-b border-white/5">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { curr: "ZIMSEC Track", model: "Day School Track", tuition: "$450.00", levies: "$75.00", total: "$525.00" },
                  { curr: "ZIMSEC Track", model: "Full Boarding Residency", tuition: "$1,200.00", levies: "$250.00", total: "$1,450.00" },
                  { curr: "Cambridge Syllabus", model: "Day School Track", tuition: "$850.00", levies: "$150.00", total: "$1,000.00" },
                  { curr: "Cambridge Syllabus", model: "Full Boarding Residency", tuition: "$1,950.00", levies: "$350.00", total: "$2,300.00" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 border-b border-white/5" data-testid={`row-fee-${i}`}>
                    <td className="p-4"><strong className="text-white">{row.curr}</strong></td>
                    <td className="p-4">{row.model}</td>
                    <td className="p-4">{row.tuition}</td>
                    <td className="p-4">{row.levies}</td>
                    <td className="p-4"><span className="bg-[#00df89]/15 text-[#00df89] px-2 py-1 rounded-md text-xs font-bold">{row.total}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Accepted Payment Formats</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-lg p-5 text-center transition-all duration-300 hover:border-[#0070f3] hover:-translate-y-[3px] hover:bg-[#0070f3]/5" data-testid="card-payment-ecocash">
              <i className="fas fa-mobile-alt text-[32px] text-[#0070f3] mb-3"></i>
              <h4 className="text-lg text-white mb-2 uppercase">EcoCash Biller</h4>
              <p className="text-[13px] text-[#a0aec0]">Merchant Code: <strong className="text-white">259104</strong></p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-5 text-center transition-all duration-300 hover:border-[#0070f3] hover:-translate-y-[3px] hover:bg-[#0070f3]/5" data-testid="card-payment-cabs">
              <i className="fas fa-building text-[32px] text-[#0070f3] mb-3"></i>
              <h4 className="text-lg text-white mb-2 uppercase">CABS Bank Transfer</h4>
              <p className="text-[13px] text-[#a0aec0]">Account: 1005234182</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-5 text-center transition-all duration-300 hover:border-[#0070f3] hover:-translate-y-[3px] hover:bg-[#0070f3]/5" data-testid="card-payment-cbz">
              <i className="fas fa-university text-[32px] text-[#0070f3] mb-3"></i>
              <h4 className="text-lg text-white mb-2 uppercase">CBZ Settlement</h4>
              <p className="text-[13px] text-[#a0aec0]">Account: 01123987150010</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-5 text-center transition-all duration-300 hover:border-[#0070f3] hover:-translate-y-[3px] hover:bg-[#0070f3]/5" data-testid="card-payment-other">
              <i className="fas fa-money-check-alt text-[32px] text-[#0070f3] mb-3"></i>
              <h4 className="text-lg text-white mb-2 uppercase">Other Local/Intl Banks</h4>
              <p className="text-[13px] text-[#a0aec0]">Accepts ZIPIT, RTGS Cleared Drafts, and Swift Transfers.</p>
            </div>
          </div>
        </section>
      )}

      {/* SPORTS SECTION */}
      {activeSection === 'sports' && (
        <section className="page-section" data-testid="section-sports">
          <div className="flex flex-col gap-10 w-full">
            <div className="max-w-[800px] mb-5">
              <h1 className="text-4xl font-extrabold uppercase tracking-wide mb-5 pb-2.5 border-b-2 border-white/5">Our Sports</h1>
              <p className="text-base text-[#a0aec0] mb-[30px]">Developing athletic excellence through teamwork, patience, and discipline.</p>
            </div>
            <div className="sports-grid">
              {[
                { img: "https://images.unsplash.com/photo-1593787408750-23fe15c2d334?auto=format&fit=crop&w=300&q=80", title: "Cricket", desc: "A tactical bat-and-ball game focused on precision, patience, and team coordination." },
                { img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80", title: "Basketball", desc: "Fast-paced action emphasizing agility, endurance, and quick strategic decisions." },
                { img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=300&q=80", title: "Volleyball", desc: "A dynamic game requiring exceptional reflexes and strong team communication." },
                { img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=80", title: "Soccer", desc: "The world's most popular sport, focusing on tactical play and footwork." },
                { img: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=300&q=80", title: "Tennis", desc: "An intense racket sport testing individual focus, speed, and strategy." }
              ].map((item, i) => (
                <div key={i} className="feature-card" data-testid={`card-sport-${i}`}>
                  <img src={item.img} alt={item.title} />
                  <h3>{item.title}</h3>
                  <p className="text-[15px] text-[#cbd5e1] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLUBS SECTION */}
      {activeSection === 'clubs' && (
        <section className="page-section" data-testid="section-clubs">
          <div className="max-w-[800px] mb-5">
            <h1 className="text-4xl font-extrabold uppercase tracking-wide mb-5 pb-2.5 border-b-2 border-white/5">Clubs & Societies</h1>
            <p className="text-base text-[#a0aec0] mb-[30px]">Explore extracurricular ventures, leadership groups, and creative passions.</p>
          </div>
          <div className="sports-grid">
            {[
              { img: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=300&q=80", title: "Chess", desc: "A game of strategy and tactics designed to sharpen critical thinking and foresight." },
              { img: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=300&q=80", title: "Debate & Public Speaking", desc: "Developing persuasive communication, confidence, and the ability to articulate complex ideas." },
              { img: "https://images.unsplash.com/photo-1596763447548-c89b3f46f32e?auto=format&fit=crop&w=300&q=80", title: "Darts", desc: "A precision-based sport focused on concentration, hand-eye coordination, and accuracy." },
              { img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=300&q=80", title: "Entrepreneurship", desc: "Learning the basics of business development, innovation, and leadership skills." },
              { img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80", title: "Dance", desc: "An artistic expression focusing on movement, rhythm, coordination, and physical fitness." },
              { img: "https://images.unsplash.com/photo-1514320291840-2e0a972a9a86?auto=format&fit=crop&w=300&q=80", title: "Music & Drama", desc: "Cultivating creativity and performance skills through acting, theatrical production, and music." },
              { img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80", title: "Elite", desc: "A specialized club focusing on excellence, high performance, and leadership development." },
              { img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80", title: "Choir", desc: "Exploring vocal technique, harmony, and collaborative music-making in a choral setting." },
              { img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=300&q=80", title: "Cooking & Baking", desc: "A practical club teaching culinary techniques, kitchen safety, and recipe development." },
              { img: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=300&q=80", title: "First Aid", desc: "Equipping students with essential life-saving skills and emergency response training." },
              { img: "https://images.unsplash.com/photo-1521791055366-0d553872126f?auto=format&fit=crop&w=300&q=80", title: "Leo Club", desc: "Focusing on community service, humanitarian projects, and developing character." },
              { img: "https://images.unsplash.com/photo-1555597673-b21d5c9d5865?auto=format&fit=crop&w=300&q=80", title: "Karate", desc: "A martial art emphasizing discipline, self-defense, physical fitness, and mental focus." }
            ].map((item, i) => (
              <div key={i} className="feature-card" data-testid={`card-club-${i}`}>
                <img src={item.img} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="text-[15px] text-[#cbd5e1] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STAFF SECTION */}
      {activeSection === 'staff' && (
        <section className="page-section" data-testid="section-staff">
          <div className="max-w-[800px] mb-5">
            <h1 className="text-4xl font-extrabold uppercase tracking-wide mb-5 pb-2.5 border-b-2 border-white/5">Staff Directory</h1>
            <p className="text-base text-[#a0aec0] mb-[30px]">Meet the dedicated team behind our operations organized by hierarchy and focus fields.</p>
          </div>

          <h2>Leadership</h2>
          <div className="sports-grid">
            <div className="feature-card" data-testid="card-staff-headmaster">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80" alt="Headmaster" />
              <h3>Headmaster</h3>
              <p className="text-[15px] text-[#cbd5e1] leading-relaxed">Providing strategic vision and institutional leadership.</p>
            </div>
            <div className="feature-card" data-testid="card-staff-deputy">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" alt="Deputy Head" />
              <h3>Deputy Head</h3>
              <p className="text-[15px] text-[#cbd5e1] leading-relaxed">Managing daily school operations and academic staff oversight.</p>
            </div>
          </div>

          <h2>Academic Staff</h2>
          <div className="sports-grid">
            {[
              { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", title: "Head of Sciences", desc: "Mathematics, Biology, Physics, Chemistry, and Geography." },
              { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80", title: "Head of Commercials", desc: "Accounts, Economics, and Business Studies." },
              { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", title: "Head of Humanities", desc: "History, Literature, and Religious Studies." },
              { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80", title: "Head of Languages", desc: "English and Foreign Languages." },
              { img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80", title: "Head of Practicals", desc: "Computer Science, Food & Nutrition, and Technical Design." }
            ].map((item, i) => (
              <div key={i} className="feature-card" data-testid={`card-staff-academic-${i}`}>
                <img src={item.img} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="text-[15px] text-[#cbd5e1] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2>Auxiliary Staff</h2>
          <div className="sports-grid">
            {[
              { img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80", title: "Administration", desc: "Front office management and student records." },
              { img: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=300&q=80", title: "Operations & Facilities", desc: "Maintenance, campus safety, and groundskeeping." },
              { img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80", title: "Support Services", desc: "Library, nursing, and student welfare." }
            ].map((item, i) => (
              <div key={i} className="feature-card" data-testid={`card-staff-aux-${i}`}>
                <img src={item.img} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="text-[15px] text-[#cbd5e1] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      {activeSection === 'contact' && (
        <section className="page-section" data-testid="section-contact">
          <div className="max-w-[800px] mb-5">
            <h1 className="text-4xl font-extrabold uppercase tracking-wide mb-5 pb-2.5 border-b-2 border-white/5">Contact Us</h1>
            <p className="text-base text-[#a0aec0] mb-[30px]">Get in touch with our administration offices for direct support.</p>
            
            <div className="feature-card mb-5">
              <h3>Direct Channels</h3>
              <p className="mb-[5px] text-[15px] text-[#cbd5e1]"><strong>Email:</strong> <a href="mailto:info@ptk.co.za" className="text-[#00df89]">info@ptk.co.za</a></p>
              <p className="text-[15px] text-[#cbd5e1]"><strong>Contact Links:</strong><br/>
                 <a href="tel:+263778788197" className="text-[#0070f3] hover:text-white transition-colors">+263 778 788 197</a><br/>
                 <a href="tel:+263712461904" className="text-[#0070f3] hover:text-white transition-colors">+263 712 461 904</a>
              </p>
            </div>
            
            <h2>Connect on Social Media</h2>
            <p className="text-[15px] text-[#a0aec0] mb-[30px]">Follow our channels or message our administrative handles for inquiries and updates.</p>
            
            <div className="flex gap-[15px] mt-5 flex-wrap">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn facebook" title="Facebook Official Page"><i className="fab fa-facebook-f"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn instagram" title="Instagram Profile"><i className="fab fa-instagram"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn x-twitter" title="X (Twitter) Feed"><i className="fab fa-x-twitter"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn linkedin" title="LinkedIn Institution Page"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="social-icon-btn whatsapp" title="WhatsApp Admissions Office"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-[#0b0d10] px-[8%] py-10 border-t border-white/5 mt-auto">
        <div className="flex justify-between flex-wrap gap-10">
          <div>
            <div 
              className="cursor-pointer mb-4" 
              onClick={() => handleNavClick('home')}
              data-testid="logo-footer"
            >
              <img src={logoSrc} alt="PTK Academy Logo" className="h-9" />
            </div>
            <p className="text-[15px] text-[#cbd5e1] max-w-sm">PTK is a digital solutions and consulting agency helping brands build what's next.</p>
          </div>
          <div>
            <p className="text-[#a0aec0] text-[13px] leading-relaxed">Academic excellence, discipline,<br/>and leadership since 2020.</p>
          </div>
        </div>
        <div className="text-center py-5 overflow-hidden animate-[gentleFloat_4s_ease-in-out_infinite] mt-10">
          <div className="inline-block text-base font-semibold tracking-wide color-shift-text" data-testid="text-copyright">
            &copy; 2026 PTK Academy School. All rights reserved.
          </div>
          <p className="text-[#4a5568] text-xs mt-2">1020x1080 Configuration</p>
        </div>
      </footer>

      <ApplyNowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Switch>
            <Route path="/" component={PtkAcademyApp} />
            <Route path="*" component={PtkAcademyApp} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
