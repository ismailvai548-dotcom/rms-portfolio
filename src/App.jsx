import React from "react";

const App = () => {
  const [showIntro, setShowIntro] = React.useState(true);
  const [playSweep, setPlaySweep] = React.useState(false);

  React.useEffect(() => {
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      setPlaySweep(true);
    }, 2200);

    const sweepTimer = setTimeout(() => {
      setPlaySweep(false);
    }, 3800);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(sweepTimer);
    };
  }, []);

  const skills = [
    "Banner Design",
    "Logo Design",
    "Poster Design",
    "Facebook Cover Design",
    "YouTube Thumbnail",
    "App UI Design",
    "Website UI Design",
    "Portfolio Design",
    "AI Image Prompt",
    "AI Video Prompt",
    "Telegram Bot",
    "React Frontend",
    "Automation Tools",
    "Brand Identity",
  ];

  const workCategories = [
    { type: "logo", title: "Logo Design", desc: "Brand, business, page and personal logo works." },
    { type: "social", title: "Social Media Post", desc: "Facebook, Instagram and promotional post designs." },
    { type: "banner", title: "Banner & Cover", desc: "Facebook cover, web banner and marketing banner." },
    { type: "thumb", title: "Thumbnail Design", desc: "YouTube, video and social thumbnail designs." },
    { type: "card", title: "Card Design", desc: "ID card, business card, invitation and membership card." },
  ];

  const Preview = ({ type }) => {
    if (type === "logo") {
      return (
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-[0_0_45px_rgba(59,130,246,0.45)] rotate-[-8deg] group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
          <span className="text-4xl font-black text-white tracking-tighter">RMS</span>
        </div>
      );
    }

    if (type === "social") {
      return (
        <div className="w-36 h-36 rounded-3xl bg-slate-950 border border-slate-700 p-4 shadow-xl group-hover:scale-110 transition-all duration-500">
          <div className="h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4"></div>
          <div className="h-2 w-24 bg-slate-500 rounded mb-2"></div>
          <div className="h-2 w-16 bg-slate-700 rounded"></div>
        </div>
      );
    }

    if (type === "banner") {
      return (
        <div className="w-44 h-24 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-800 border border-slate-700 p-4 flex items-center gap-3 group-hover:scale-110 transition-all duration-500">
          <div className="flex-1">
            <div className="h-3 w-24 bg-blue-400 rounded mb-2"></div>
            <div className="h-2 w-16 bg-slate-600 rounded"></div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500"></div>
        </div>
      );
    }

    if (type === "thumb") {
      return (
        <div className="w-44 h-28 rounded-2xl bg-gradient-to-br from-red-500 via-blue-600 to-slate-950 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <span className="text-white text-3xl ml-1">▶</span>
          </div>
        </div>
      );
    }

    return (
      <div className="w-44 h-28 rounded-2xl bg-slate-950 border border-slate-700 p-4 group-hover:scale-110 transition-all duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400"></div>
          <div>
            <div className="h-2 w-20 bg-slate-500 rounded mb-2"></div>
            <div className="h-2 w-12 bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-700 rounded mb-2"></div>
        <div className="h-2 w-2/3 bg-slate-800 rounded"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {showIntro && (
        <div className="fixed inset-0 z-[999] bg-slate-950 flex items-center justify-center">
          <div className="welcome-box text-center">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-blue-200 to-slate-500 bg-clip-text text-transparent">
              WELCOME
            </h1>
            <p className="mt-4 text-blue-400 tracking-[0.35em] text-xs md:text-sm font-bold uppercase">
              To My Creative Portfolio
            </p>
          </div>
        </div>
      )}

      <nav className="fixed w-full bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-800/50 px-6">
        <div className="max-w-6xl mx-auto py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
            RMS RASEL
          </h1>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#work" className="hover:text-blue-400 transition-colors">Works</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      <section className="relative pt-44 pb-28 px-6 flex justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <span className="particle particle-one"></span>
          <span className="particle particle-two"></span>
          <span className="particle particle-three"></span>
          <span className="particle particle-four"></span>
          <span className="particle particle-five"></span>
          <span className="particle particle-six"></span>
          <span className="particle particle-seven"></span>
          <span className="particle particle-eight"></span>
          <span className="orb orb-one"></span>
          <span className="orb orb-two"></span>
        </div>

        <div className="relative max-w-3xl w-full p-[2px] overflow-hidden rounded-[40px] group shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000_0%,#0000ff_25%,#00ff00_50%,#ffff00_75%,#ff0000_100%)]" />

          <div className="relative z-10 bg-slate-950/95 rounded-[38px] px-8 py-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_45%)]"></div>

            {playSweep && <div className="hero-sweep"></div>}

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                <span className="bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
                  RM RASEL HOSSAIN
                </span>
              </h2>

              <div className="w-20 h-[1px] bg-slate-800 mx-auto mb-8"></div>

              <p className="text-blue-400 text-xs md:text-sm font-black uppercase tracking-[0.4em] mb-4">
                My Experience
              </p>

              <div className="h-10 overflow-hidden">
                <div className="skill-slider">
                  {skills.map((skill, index) => (
                    <p key={index} className="h-10 text-xl md:text-3xl font-bold text-slate-300">
                      {skill}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 text-xs tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Creative Skill Zone
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="py-24 px-6 bg-slate-900/20 border-y border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.35em] mb-4">
              Portfolio Gallery
            </p>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight">
              Work Categories
            </h3>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              আলাদা আলাদা ক্যাটাগরিতে ডিজাইনগুলো সাজানো থাকবে, যাতে ক্লায়েন্ট সহজে কাজ দেখতে পারে।
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workCategories.map((item, index) => (
              <div
                key={index}
                className="group p-5 rounded-[28px] bg-slate-950 border border-slate-800 hover:border-blue-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_80px_rgba(59,130,246,0.12)]"
              >
                <div className="h-44 rounded-[22px] bg-slate-900 border border-slate-800 mb-6 overflow-hidden flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.16),transparent_55%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Preview type={item.type} />
                </div>

                <h4 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>

                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {item.desc}
                </p>

                <button className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-bold hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all">
                  View Works
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto p-[1px] rounded-[32px] bg-gradient-to-r from-blue-500 via-emerald-400 to-purple-500">
          <div className="rounded-[31px] bg-slate-950 px-6 md:px-10 py-12 border border-slate-800">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.35em] mb-4">
              Contact Me
            </p>

            <h3 className="text-3xl md:text-4xl font-black mb-4">
              Send Your Message
            </h3>

            <p className="text-slate-500 mb-8">
              আপনার নাম, ইমেইল এবং মেসেজ লিখে পাঠিয়ে দিন। মেসেজ আমার ইমেইলে চলে আসবে।
            </p>

            <form
              action="https://formspree.io/f/mwvykpvl"
              method="POST"
              className="space-y-4 text-left"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                required
                rows="5"
                className="w-full px-5 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black transition-all hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-900 text-center text-slate-600 text-xs tracking-widest uppercase">
        © 2026 RMS RASEL • Graphic Design Portfolio
      </footer>

      <style>{`
        .welcome-box {
          animation: welcomeMotion 2.2s ease forwards;
        }

        @keyframes welcomeMotion {
          0% {
            transform: translateY(90px) scale(.75);
            opacity: 0;
            filter: blur(14px);
          }
          45% {
            transform: translateY(0) scale(1.08);
            opacity: 1;
            filter: blur(0);
          }
          68% {
            transform: translateY(-12px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(40px) scale(.92);
            opacity: 0;
            filter: blur(12px);
          }
        }

        .hero-sweep {
          position: absolute;
          inset: -40%;
          z-index: 5;
          background: linear-gradient(
            115deg,
            transparent 35%,
            rgba(255,255,255,0.04) 44%,
            rgba(96,165,250,0.35) 50%,
            rgba(34,197,94,0.16) 54%,
            transparent 64%
          );
          transform: translateX(-85%) rotate(8deg);
          animation: heroSweep 1.45s ease forwards;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        @keyframes heroSweep {
          0% {
            transform: translateX(-90%) rotate(8deg);
            opacity: 0;
          }
          18% {
            opacity: 1;
          }
          100% {
            transform: translateX(90%) rotate(8deg);
            opacity: 0;
          }
        }

        @keyframes skillSlide {
          0%, 6% { transform: translateY(0); }
          7%, 13% { transform: translateY(-40px); }
          14%, 20% { transform: translateY(-80px); }
          21%, 27% { transform: translateY(-120px); }
          28%, 34% { transform: translateY(-160px); }
          35%, 41% { transform: translateY(-200px); }
          42%, 48% { transform: translateY(-240px); }
          49%, 55% { transform: translateY(-280px); }
          56%, 62% { transform: translateY(-320px); }
          63%, 69% { transform: translateY(-360px); }
          70%, 76% { transform: translateY(-400px); }
          77%, 83% { transform: translateY(-440px); }
          84%, 90% { transform: translateY(-480px); }
          91%, 96% { transform: translateY(-520px); }
          97%, 100% { transform: translateY(0); }
        }

        .skill-slider {
          animation: skillSlide 25s infinite ease-in-out;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .particle {
          position: absolute;
          bottom: -80px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(96,165,250,.95), transparent 72%);
          opacity: .26;
          box-shadow: 0 0 34px rgba(96,165,250,.5);
          animation: floatParticle linear infinite;
        }

        .particle-one { left: 10%; width: 8px; height: 8px; animation-duration: 13s; animation-delay: 0s; }
        .particle-two { left: 22%; width: 5px; height: 5px; animation-duration: 16s; animation-delay: 2s; }
        .particle-three { left: 38%; width: 11px; height: 11px; animation-duration: 18s; animation-delay: 1s; }
        .particle-four { left: 51%; width: 6px; height: 6px; animation-duration: 14s; animation-delay: 4s; }
        .particle-five { left: 68%; width: 9px; height: 9px; animation-duration: 17s; animation-delay: 3s; }
        .particle-six { left: 82%; width: 7px; height: 7px; animation-duration: 15s; animation-delay: 5s; }
        .particle-seven { left: 92%; width: 12px; height: 12px; animation-duration: 20s; animation-delay: 2.5s; }
        .particle-eight { left: 45%; width: 4px; height: 4px; animation-duration: 12s; animation-delay: 6s; }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0) scale(.5);
            opacity: 0;
          }
          18% {
            opacity: .34;
          }
          50% {
            transform: translateY(-55vh) translateX(28px) scale(1);
          }
          100% {
            transform: translateY(-125vh) translateX(-24px) scale(1.35);
            opacity: 0;
          }
        }

        .orb {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 999px;
          filter: blur(70px);
          opacity: .12;
          animation: driftOrb 18s ease-in-out infinite alternate;
        }

        .orb-one {
          left: 14%;
          top: 20%;
          background: #2563eb;
        }

        .orb-two {
          right: 10%;
          top: 32%;
          background: #22c55e;
          animation-delay: 4s;
        }

        @keyframes driftOrb {
          from {
            transform: translateY(20px) translateX(-20px) scale(.9);
          }
          to {
            transform: translateY(-30px) translateX(30px) scale(1.08);
          }
        }
      `}</style>
    </div>
  );
};

export default App;