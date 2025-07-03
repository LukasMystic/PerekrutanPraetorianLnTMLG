'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
    CheckCircle2, UploadCloud, Loader2, ServerCrash, Send, Target, Eye, Rocket, ChevronLeft, ChevronRight, 
    Users, Briefcase, Presentation, Shirt, Award, Menu, X, CheckCircle, MessageSquare, Globe, Instagram
} from 'lucide-react';

const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }
};

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6902H306.615L611.412 515.685L658.88 583.579L1055.08 1150.31H892.476L569.165 687.854V687.828Z" fill="currentColor"/>
    </svg>
);


// --- Navbar Component ---
const Navbar = ({ onLinkClick, activeSection }: { onLinkClick: (id: string) => void; activeSection: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navLinks = ["About", "Benefits", "Apply"];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = (id: string) => {
        onLinkClick(id.toLowerCase());
        setIsOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d1a2e]/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img 
                            className="h-25 w-auto" 
                            src="https://miro.medium.com/v2/resize:fit:1400/1*KSH-ELYLBI0dzE1Wt7mRKg.png" 
                            alt="BNCC Skills Logo" 
                        />
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-2">
                            {navLinks.map((link) => (
                                <button 
                                    key={link} 
                                    onClick={() => handleLinkClick(link)} 
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 relative ${activeSection === link.toLowerCase() ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {link}
                                    {activeSection === link.toLowerCase() && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-[#00a9e0] rounded-full transition-all duration-300"></span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-800/50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white">
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            <div className={`transition-all duration-300 ease-in-out md:hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#0d1a2e]">
                    {navLinks.map((link) => (
                        <button key={link} onClick={() => handleLinkClick(link)} className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors">
                            {link}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};



// --- Slideshow Component ---
const ImageSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "/images/IMG_0160.jpeg",
    "/images/IMG_0165.jpeg",
    "/images/Session0_Slide1.png",
    "/images/word_media_image1.png",
  ];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-56 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
      {images.map((src, index) => (
        <img key={src} src={src} alt={`Slideshow image ${index + 1}`} className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`} />
      ))}
       <div className="absolute inset-0 bg-black/30"></div>
      <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none"><ChevronLeft className="h-6 w-6 text-white"/></button>
      <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none"><ChevronRight className="h-6 w-6 text-white"/></button>
    </div>
  );
};

// --- Footer Component ---
const Footer = () => {
    const socialLinks = [
        { name: 'Website', icon: Globe, href: 'https://bncc.net/' },
        { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/bnccmalang/' },
        { name: 'X', icon: TwitterIcon, href: 'https://x.com/BNCC_Binus' },
    ];
    return (
        <footer className="bg-gray-900/50 border-t border-gray-700/50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white">Have any questions?</h3>
                    <p className="mt-2 text-gray-400">Contact our recruitment admin:</p>
                    <p className="mt-2 text-lg font-medium text-[#00a9e0]">Stanley Pratama Teguh</p>
                    <p className="text-gray-300">+62 895-6378-76392</p>
                </div>
                <div className="flex justify-center space-x-6 mb-8">
                    {socialLinks.map(link => (
                        <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110">
                            <span className="sr-only">{link.name}</span>
                            <link.icon className="h-6 w-6" />
                        </a>
                    ))}
                </div>
                <p className="mt-8 text-gray-500 text-sm">&copy; {new Date().getFullYear()} BNCC Learning & Training. All rights reserved.</p>
            </div>
        </footer>
    );
};

// --- Thank You Page Component ---
const ThankYouPage = ({ onBack }: { onBack: () => void }) => {
  const whatsappLink = "https://chat.whatsapp.com/FFM8A2506cG3oOZfwUEq3j";

  const handleBack = () => {
    const hasJoined = window.confirm("Have you joined the WhatsApp group? You must join it before proceeding.");
    if (hasJoined) {
      // Force a full page refresh after going back
      window.location.href = window.location.origin;
    }
  };

  return (
    <div className="bg-[#0d1a2e] min-h-screen text-white antialiased flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full text-center bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-8 sm:p-12 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#00a9e0]/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -right-10 w-48 h-48 bg-sky-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="relative z-10">
          <CheckCircle className="h-20 w-20 mx-auto mb-6 text-green-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">Thank You!</h1>
          <p className="mt-4 text-lg text-gray-300">Your application has been successfully submitted. We've received your details and will review them shortly.</p>
          <div className="my-8 h-px bg-gray-700/50"></div>
          <h2 className="text-xl font-bold text-white">What's Next?</h2>
          <p className="mt-2 text-gray-400">
            To complete your application, it is <strong>mandatory</strong> to join our official WhatsApp group for further announcements and the next stages of the recruitment process.
          </p>
          <div className="mt-8">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-8 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
            >
              <MessageSquare className="mr-3 h-6 w-6" />
              Join WhatsApp Group
            </a>
          </div>
          <div className="mt-12">
            <button onClick={handleBack} className="text-sm text-sky-400 hover:underline">
              &larr; Back to homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Animated Section Wrapper ---
const AnimatedSection = ({ children, id, className = '' }: { children: React.ReactNode, id: string, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <section
            ref={ref}
            id={id}
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
        >
            {children}
        </section>
    );
};

// --- Section Separator Component ---
const SectionSeparator = () => {
    return (
        <div className="relative my-16 h-px bg-gradient-to-r from-transparent via-[#00a9e0]/50 to-transparent">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#0d1a2e] rotate-45 border-t border-l border-[#00a9e0]/50 shadow-[0_0_15px_5px_rgba(0,169,224,0.3)]"></div>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
  const [formData, setFormData] = useState({ fullName: '', nim: '', major: '', lntClass: 'UI/UX Design', position: 'UI/UX Design', binusianEmail: '', privateEmail: '' });
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null); // ref to the form

  
  // App State
  type Status = 'idle' | 'loading' | 'success' | 'error';
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    document.title = "BNCC LnT - Open Recruitment";
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = 'https://miro.medium.com/v2/resize:fit:1400/1*KSH-ELYLBI0dzE1Wt7mRKg.png';
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        },
        { rootMargin: "-30% 0px -30% 0px" } 
    );
    sections.forEach(section => observer.observe(section));
    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-7z-compressed',
  ];

  const fileTypeExtensions = ".pdf, .doc, .docx, .jpg, .jpeg, .png, .zip, .7z";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Client-side validation
      if (!allowedFileTypes.includes(file.type)) {
        setStatus('error');
        setMessage('Invalid file type. Please upload one of the supported formats.');
        setResume(null);
        setResumeName('');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { 
        setStatus('error'); 
        setMessage('File size cannot exceed 5MB.'); 
        setResume(null); 
        setResumeName(''); 
        return; 
      }

      setResume(file);
      setResumeName(file.name);
      if (status === 'error') { 
        setStatus('idle'); 
        setMessage(''); 
      }
    }
  };
  

  const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!/^\d+$/.test(formData.nim)) {
    setStatus('error');
    setMessage('NIM must only contain numbers.');
    return;
  }

  if (!formData.binusianEmail.endsWith('@binus.ac.id')) {
    setStatus('error');
    setMessage('Please use a valid Binusian email (@binus.ac.id).');
    return;
  }

  if (!resume) {
    setStatus('error');
    setMessage('Please upload your resume.');
    return;
  }

  setShowConfirmModal(true); 
};


  const handleSubmit = async () => {
  setStatus('loading');
  setMessage('Submitting your application...');
  
  const formPayload = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    formPayload.append(key, value);
  });
  formPayload.append('resume', resume!); 

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formPayload,
    });

    if (response.ok) {
      setStatus('success');
      setMessage('Submission successful! Redirecting...');
      setTimeout(() => {
        setShowThankYou(true);
      }, 1000);
    } else {
      const errorData = await response.json();
      setStatus('error');
      setMessage(errorData.error || 'An unknown server error occurred.');
      console.error('Server responded with an error:', errorData);
    }
  } catch (error) {
    setStatus('error');
    setMessage('A network error occurred. Please check your connection and try again.');
    console.error('Fetch API call failed:', error);
  }
};

  
  const positions = ["UI/UX Design", "Back-end Development", "Java Programming", "Front-end Development", "C Programming"];
  const qualifications = ["Binusian", "Member or activist or Alumni BNCC", "Able to work in a team and individually", "Public speaking and teaching skills is a plus"];
  const benefits = [
    { icon: Users, title: "Networking", desc: "Connect with peers, seniors, and alumni." },
    { icon: Briefcase, title: "Portfolio", desc: "Build real-world projects to showcase your skills." },
    { icon: Presentation, title: "Teaching Experience", desc: "Develop communication and leadership skills." },
    { icon: Shirt, title: "Exclusive BNCC Attire", desc: "Get official apparel to represent our community." },
    { icon: Award, title: "E-Certificate", desc: "Receive official recognition for your contribution." },
  ];

  


  const getButtonContent = () => {
    switch (status) {
      case 'loading': return <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>;
      case 'success': return <><CheckCircle2 className="mr-2 h-5 w-5" /> Submitted!</>;
      case 'error': return <><ServerCrash className="mr-2 h-5 w-5" /> Try Again</>;
      default: return <><Send className="mr-2 h-5 w-5" /> Submit Application</>;
    }
  };

  if (showThankYou) {
    return <ThankYouPage onBack={() => setShowThankYou(false)} />;
  }
  
  return (
    <div className="bg-[#0d1a2e] min-h-screen text-white antialiased">
      <Navbar onLinkClick={scrollTo} activeSection={activeSection} />
      
      <header className="relative w-full h-screen">
        <div className="absolute inset-0 bg-black"><img src="/images/IMG_0168.jpeg" alt="Team members working together" className="w-full h-full object-cover object-top opacity-20" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a2e] via-[#0d1a2e]/80 to-transparent"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg animate-fade-in-up">Open Recruitment</h1>
            <p className="mt-4 text-2xl md:text-3xl font-semibold text-[#00a9e0] animate-fade-in-up animation-delay-300">Praetorian LnT 37</p>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection id="about" className="pt-16 md:pt-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About The <span className="text-[#00a9e0]">Learning & Training</span> Division</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl"><Rocket className="h-10 w-10 mx-auto mb-4 text-[#00a9e0]" /><h3 className="text-xl font-bold mb-2">Who We Are</h3><p className="text-gray-400">The Learning & Training (LnT) division is the core of BNCC's educational mission. We are a passionate team dedicated to designing and delivering high-quality tech training for all BNCC members.</p></div>
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl"><Target className="h-10 w-10 mx-auto mb-4 text-[#00a9e0]" /><h3 className="text-xl font-bold mb-2">Our Mission</h3><p className="text-gray-400">To empower BNCC members with relevant IT skills through continuous learning, fostering a culture of knowledge-sharing, and preparing them for the competitive tech industry.</p></div>
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl"><Eye className="h-10 w-10 mx-auto mb-4 text-[#00a9e0]" /><h3 className="text-xl font-bold mb-2">Our Vision</h3><p className="text-gray-400">To be the leading student-driven IT training organization in Indonesia that actively develops competent and innovative technology enthusiasts.</p></div>
            </div>
          </AnimatedSection>

          <SectionSeparator />

          <AnimatedSection id="benefits">
            <div className="py-16 md:py-24" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '1.5rem 1.5rem' }}>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Join Us?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map(benefit => (<div key={benefit.title} className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-6 rounded-2xl flex items-start space-x-4 transition-transform duration-300 hover:scale-105 hover:bg-gray-800/50"><div className="flex-shrink-0 bg-gray-700 p-3 rounded-full"><benefit.icon className="h-6 w-6 text-[#00a9e0]" /></div><div><h3 className="text-lg font-bold text-white">{benefit.title}</h3><p className="text-gray-400 mt-1">{benefit.desc}</p></div></div>))}
                </div>
            </div>
          </AnimatedSection>
          
          <SectionSeparator />

          <div className="py-16 md:py-24 space-y-24">
             <AnimatedSection id="poster"><h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Join The Praetorians</h2><div className="max-w-md mx-auto bg-gray-900 p-4 rounded-2xl shadow-2xl"><img src="/images/Praetorian Recruitment.png" alt="Praetorian LnT 37 Recruitment Poster" className="rounded-lg w-full"/></div></AnimatedSection>
             <AnimatedSection id="gallery"><h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Life at LnT BNCC</h2><ImageSlideshow /></AnimatedSection>
          </div>

          <SectionSeparator />

          <AnimatedSection id="apply">
            <div className="py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl shadow-2xl h-full">
                    <h2 className="text-2xl font-bold text-white mb-5">QUALIFICATIONS</h2>
                    <ul className="space-y-4 text-gray-300">
                      {qualifications.map(q => (
                        <li key={q} className="flex items-baseline">
                          <span className="text-[#00a9e0] mr-3">&#8226;</span>
                          <span className="flex-1">{q}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-8 text-gray-400 italic">Step up and make an impact! Become a Praetorian LnT 37 and help shape the future of BNCC LnT!</p>
                  </div>
                  <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">APPLICATION FORM</h2>
                    <form ref={formRef} onSubmit={handleInitialSubmit} className="space-y-4">
                     {showConfirmModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
                        <div className="bg-[#0d1a2e] border border-gray-700 rounded-xl shadow-2xl max-w-lg w-full p-6 transform scale-95 opacity-0 animate-fadeScaleIn">
                          <h2 className="text-2xl font-bold text-white mb-4 text-center">Confirm Your Data</h2>
                          <div className="text-gray-300 space-y-2 text-sm">
                            <p><strong>Full Name:</strong> {formData.fullName}</p>
                            <p><strong>NIM:</strong> {formData.nim}</p>
                            <p><strong>Major:</strong> {formData.major}</p>
                            <p><strong>LnT Class:</strong> {formData.lntClass}</p>
                            <p><strong>Position:</strong> {formData.position}</p>
                            <p><strong>Binusian Email:</strong> {formData.binusianEmail}</p>
                            <p><strong>Private Email:</strong> {formData.privateEmail}</p>
                            <p><strong>CV Filename:</strong> {resumeName}</p>
                          </div>
                          <p className="mt-4 text-sm text-yellow-400">
                            Please make sure all information is correct before submitting.
                          </p>
                          <div className="mt-6 flex justify-end space-x-3">
                            <button
                              onClick={() => setShowConfirmModal(false)}
                              className="px-4 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-500 transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                setShowConfirmModal(false);
                                handleSubmit();
                              }}
                              className="px-4 py-2 text-sm text-white bg-[#00a9e0] rounded hover:bg-sky-500 transition"
                            >
                              Confirm & Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label><input type="text" name="fullName" id="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 focus:ring-[#00a9e0] focus:border-[#00a9e0]"/></div>
                        <div><label htmlFor="nim" className="block text-sm font-medium text-gray-300 mb-1">NIM</label><input type="text" name="nim" id="nim" required value={formData.nim} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 focus:ring-[#00a9e0] focus:border-[#00a9e0]"/></div>
                      </div>
                      <div><label htmlFor="major" className="block text-sm font-medium text-gray-300 mb-1">Major</label><input type="text" name="major" id="major" required value={formData.major} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 focus:ring-[#00a9e0] focus:border-[#00a9e0]"/></div>
                      <div><label htmlFor="lntClass" className="block text-sm font-medium text-gray-300 mb-1">LnT Class Right Now</label><select id="lntClass" name="lntClass" required value={formData.lntClass} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 focus:ring-[#00a9e0] focus:border-[#00a9e0]">{positions.map(p => <option key={p}>{p}</option>)}</select></div>
                      <div><label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-1">Position Applying For</label><select id="position" name="position" required value={formData.position} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 focus:ring-[#00a9e0] focus:border-[#00a9e0]">{positions.map(p => <option key={p}>{p}</option>)}</select></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label htmlFor="binusianEmail" className="block text-sm font-medium text-gray-300 mb-1">Binusian Email</label><input type="email" name="binusianEmail" id="binusianEmail" required value={formData.binusianEmail} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 focus:ring-[#00a9e0] focus:border-[#00a9e0]"/></div>
                        <div><label htmlFor="privateEmail" className="block text-sm font-medium text-gray-300 mb-1">Private Email</label><input type="email" name="privateEmail" id="privateEmail" required value={formData.privateEmail} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 focus:ring-[#00a9e0] focus:border-[#00a9e0]"/></div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Upload CV</label>
                        <label htmlFor="resume" className="relative cursor-pointer bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-md flex justify-center items-center p-4 text-gray-400 hover:border-[#00a9e0] hover:text-white transition group">
                          <UploadCloud className="h-8 w-8 mr-3 text-gray-500 group-hover:text-[#00a9e0] transition" />
                          <span className="font-medium truncate max-w-xs">{resumeName || "Click to upload (Max 5MB)"}</span>
                          <input id="resume" name="resume" type="file" required onChange={handleFileChange} className="sr-only" accept={fileTypeExtensions} />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX, JPG, PNG, ZIP, 7z.</p>
                        <a href="https://media.developeracademy.id/docs/NamaLengkap_CV_Academy.docx" target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:underline mt-1 inline-block">Download CV Template</a>
                      </div>
                      <div>
                        <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-[#00a9e0] hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:scale-100">
                          {getButtonContent()}
                        </button>
                      </div>
                      {status === 'error' && (<p className="text-center text-sm font-medium text-red-400">{message}</p>)}
                    </form>
                  </div>
                </div>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
}
