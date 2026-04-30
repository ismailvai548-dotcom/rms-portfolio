import React from "react";

const App = () => {
  const [showIntro, setShowIntro] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const skills = [
    "Banner Design", "Logo Design", "Poster Design", "Facebook Cover Design",
    "YouTube Thumbnail", "App UI Design", "Website UI Design", "Portfolio Design",
    "AI Image Prompt", "AI Video Prompt", "Telegram Bot", "React Frontend",
    "Automation Tools", "Brand Identity",
  ];

  const workCategories = [
    { type: "logo", title: "Logo Design", desc: "Brand, business, page and personal logo works." },
    { type: "social", title: "Social Media Post", desc: "Facebook, Instagram and promotional post designs." },
    { type: "banner", title: "Banner & Cover", desc: "Facebook cover, web banner and marketing banner." },
    { type: "thumb", title: "Thumbnail Design", desc: "YouTube, video and social thumbnail designs." },
    { type: "card", title: "Card Design", desc: "ID card, business card, invitation and membership card." },
  ];

  const zoomParticles = Array.from({ length: 30 });

  const Preview = ({ type }) => {
    if (type === "logo") {
      return (
        <div className="relative group-hover:scale-110 transition-all duration-500">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.4)] rotate-[-8deg] group-hover:rotate-0">
            <span className="text-3xl font-black text-white tracking-tighter">RMS</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-xl">✒️</div>
        </div>
      );
    }
    if (type === "social") {
      return (
        <div className="w-32 h-40 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl group-hover:scale-110 transition-all duration-500">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500"></div>
            <div className="w-16 h-2 bg-slate-800 rounded"></div>
          </div>
          <div className="w-full h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
             <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500/20"></div>
            <div className="w-4 h-4 rounded-full bg-blue-500/20"></div>
            <div className="w-4 h-4 rounded-full bg-emerald-500/20"></div>
          </div>
        </div>
      );
    }
    if (type === "banner") {
      return (
        <div className="w-48 h-24 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative shadow-2xl group-hover:scale-110 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20"></div>
          <div className="p-4 relative z-10">
            <div className="w-24 h-3 bg-blue-500 rounded mb-2"></div>
            <div className="w-16 h-2 bg-slate-700 rounded"></div>
          </div>
          <div className="absolute right-4 bottom-4 w-12 h-12 bg-emerald-500/10 rounded-full blur-md"></div>
          <div className="absolute -right-2 -bottom-2 text-3xl opacity-20">🖼️</div>
        </div>
      );
    }
    if (type === "thumb") {
      return (
        <div className="w-44 h-28 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative group-hover:scale-110 transition-all duration-500 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-600/40 via-transparent to-blue-600/40 opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
               <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 w-20 h-2 bg-white/20 rounded"></div>
        </div>
      );
    }
    if (type === "card") {
      return (
        <div className="w-28 h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center shadow-2xl group-hover:scale-110 transition-all duration-500 relative">
          <div className="absolute top-0 w-full h-8 bg-blue-600/20 rounded-t-xl border-b border-slate-800"></div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 mb-4 mt-6 border-2 border-slate-800 flex items-center justify-center text-xl">👤</div>
          <div className="w-16 h-2 bg-blue-400 rounded mb-2"></div>
          <div className="w-10 h-1.5 bg-slate-700 rounded mb-1"></div>
          <div className="w-12 h-1.5 bg-slate-700 rounded"></div>
          <div className="absolute bottom-3 w-10 h-1 bg-slate-800 rounded"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Welcome Screen */}
      {showIntro && (
        <div className="fixed inset-0 z-[999] bg-slate-950 flex items-center justify-center">
          <div className="welcome-box text-center">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-blue-200 to-slate-500 bg-clip-text text-transparent">WELCOME</h1>
            <p className="mt-4 text-blue-400 tracking-[0.35em] text-xs md:text-sm font-bold uppercase">To My Creative Portfolio</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="fixed w-full bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-800/50 px-6">
        <div className="max-w-6xl mx-auto py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">RMS RASEL</h1>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#work" className="hover:text-blue-400 transition-colors">Works</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-28 px-6 flex justify-center items-center overflow-hidden min-h-[90vh]">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {zoomParticles.map((_, i) => (
            <div key={i} className="absolute bg-blue-500/40 rounded-full blur-[2px] zoom-particle"
              style={{ width: '6px', height: '6px', "--x": `${(Math.random() - 0.5) * 100}vw`, "--y": `${(Math.random() - 0.5) * 100}vh`, animationDelay: `${Math.random() * 4}s`, animationDuration: `${2 + Math.random() * 3}s` }}
            />
          ))}
        </div>

        <div className="relative max-w-3xl w-full p-[2px] overflow-hidden rounded-[40px] group shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000_0%,#0000ff_25%,#00ff00_50%,#ffff00_75%,#ff0000_100%)]" />
          <div className={`relative z-10 bg-slate-950/90 backdrop-blur-sm rounded-[38px] px-8 py-16 text-center overflow-hidden ${!showIntro ? 'shine-sweep' : ''}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_45%)]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                <span className="bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">RM RASEL HOSSAIN</span>
              </h2>
              <div className="w-20 h-[1px] bg-slate-800 mx-auto mb-8"></div>
              <p className="text-blue-400 text-xs md:text-sm font-black uppercase tracking-[0.4em] mb-4">My Experience</p>
              <div className="h-10 overflow-hidden">
                <div className="skill-slider">
                  {skills.map((skill, index) => (
                    <p key={index} className="h-10 text-xl md:text-3xl font-bold text-slate-300">{skill}</p>
                  ))}
                </div>
              </div>
              <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 text-xs tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Creative Skill Zone
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Categories Section */}
      <section id="work" className="py-24 px-6 bg-slate-900/20 border-y border-slate-900">
        <div className="max-w-6xl mx-auto text-center">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.35em] mb-4">Portfolio Gallery</p>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-14">Work Categories</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                {workCategories.map((item, index) => (
                <div key={index} className="group p-6 rounded-[32px] bg-slate-950 border border-slate-800 hover:border-blue-500/60 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_100px_rgba(59,130,246,0.1)]">
                    <div className="h-56 rounded-[24px] bg-slate-900/50 border border-slate-800/50 mb-6 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)]"></div>
                        <Preview type={item.type} />
                    </div>
                    <h4 className="text-2xl font-extrabold mb-3 group-hover:text-blue-400 transition-colors tracking-tight">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 h-10">{item.desc}</p>
                    <button className="w-full py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 shadow-lg">View Works</button>
                </div>
                ))}
            </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 text-center">
        <h3 className="text-3xl md:text-4xl font-black mb-4">Let’s Build Your Design</h3>
        <a href="https://t.me/RM_Rasel_Hossain" target="_blank" rel="noreferrer" className="inline-flex px-8 py-4 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)]">Contact on Telegram</a>
      </section>

      <footer className="py-12 border-t border-slate-900 text-center text-slate-600 text-xs tracking-widest uppercase">
        © 2026 RM RASEL HOSSAIN • Graphic Design Portfolio
      </footer>

      <style>{`
        @keyframes welcomeMotion { 0% { transform: translateY(90px) scale(.75); opacity: 0; filter: blur(14px); } 45% { transform: translateY(0) scale(1.08); opacity: 1; filter: blur(0); } 100% { transform: translateY(40px) scale(.92); opacity: 0; filter: blur(12px); } }
        .welcome-box { animation: welcomeMotion 2.2s ease forwards; }
        @keyframes zoomOutward { 0% { transform: translate(0, 0) scale(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(var(--x), var(--y)) scale(1.5); opacity: 0; } }
        .zoom-particle { animation: zoomOutward infinite ease-in; }
        .shine-sweep::after { content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent); transform: skewX(-25deg); animation: sweep 1.5s ease-in-out 0.5s forwards; }
        @keyframes sweep { 100% { left: 200%; } }
        @keyframes skillSlide { 0%, 6% { transform: translateY(0); } 7%, 13% { transform: translateY(-40px); } 14%, 20% { transform: translateY(-80px); } 21%, 27% { transform: translateY(-120px); } 28%, 34% { transform: translateY(-160px); } 35%, 41% { transform: translateY(-200px); } 42%, 48% { transform: translateY(-240px); } 49%, 55% { transform: translateY(-280px); } 56%, 62% { transform: translateY(-320px); } 63%, 69% { transform: translateY(-360px); } 70%, 76% { transform: translateY(-400px); } 77%, 83% { transform: translateY(-440px); } 84%, 90% { transform: translateY(-480px); } 91%, 96% { transform: translateY(-520px); } 97%, 100% { transform: translateY(0); } }
        .skill-slider { animation: skillSlide 25s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;