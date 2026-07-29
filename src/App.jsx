import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [playSweep, setPlaySweep] = useState(false);

  // Popup Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Supabase Data State
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // Dynamic Social Links State
  const [socials, setSocials] = useState({
    facebook: "https://www.facebook.com/profile.php?id=61562833449395",
    telegram: "https://t.me/rm_rasel_hossain",
    whatsapp: "https://wa.me/8801933243074",
    linkedin: "https://linkedin.com"
  });

  // Single Text Animation State
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const skills = [
    "Adobe Premiere Pro",
    "Adobe After Effects",
    "Video Editing",
    "Color Grading",
    "Motion Graphics",
    "Sound Design & Mixing",
    "Visual Effects (VFX)",
    "Green Screen / Keying",
    "Video Transitions",
    "Text Animation & Titles",
    "AI Video Prompting",
    "Commercial Editing"
  ];

  // AUTOMATIC VISITOR DETECTION LOGIC
  useEffect(() => {
    trackVisitor();
  }, []);

  const trackVisitor = async () => {
    try {
      let visitorId = localStorage.getItem("rm_portfolio_visitor_id");
      if (!visitorId) {
        visitorId = "visitor_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
        localStorage.setItem("rm_portfolio_visitor_id", visitorId);
      }

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const device = isMobile ? "Mobile" : "Desktop";

      await supabase.from("page_views").insert([
        {
          visitor_id: visitorId,
          device_type: device
        }
      ]);
    } catch (err) {
      console.error("Visitor Detection Error:", err.message);
    }
  };

  // Text Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSkillIndex((prevIndex) => (prevIndex + 1) % skills.length);
        setFade(true);
      }, 300);
    }, 2500);

    return () => clearInterval(timer);
  }, [skills.length]);

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      setPlaySweep(true);
    }, 2400);

    const sweepTimer = setTimeout(() => {
      setPlaySweep(false);
    }, 4000);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(sweepTimer);
    };
  }, []);

  // Fetch Works & Social Links
  useEffect(() => {
    fetchWorks();
    fetchSocialLinks();
  }, []);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setWorks(data);
    } catch (err) {
      console.error("Error fetching works:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase.from("social_links").select("*").eq("id", 1).single();
      if (data && !error) {
        setSocials({
          facebook: data.facebook || socials.facebook,
          telegram: data.telegram || socials.telegram,
          whatsapp: data.whatsapp || socials.whatsapp,
          linkedin: data.linkedin || socials.linkedin
        });
      }
    } catch (err) {
      console.error("Error fetching social links:", err.message);
    }
  };

  // Form Submit Handler for Popup
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mwvykpvl", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        setShowSuccessModal(true);
        form.reset();
      } else {
        alert("Oops! There was a problem submitting your form.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      videoId = urlParams.get("v");
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const socialLinks = [
    {
      name: "Facebook",
      url: socials.facebook,
      color: "bg-[#1877F2]/10 border-[#1877F2]/30 hover:bg-[#1877F2]/20 hover:border-[#1877F2]",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "Telegram",
      url: socials.telegram,
      color: "bg-[#24A1DE]/10 border-[#24A1DE]/30 hover:bg-[#24A1DE]/20 hover:border-[#24A1DE]",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#24A1DE">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm5.833 7.85c-.14.647-1.98 9.33-1.98 9.33-.145.647-.532.807-1.077.502l-3.022-2.227-1.458 1.403c-.161.161-.297.297-.61.297l.217-3.084 5.612-5.07c.244-.217-.054-.337-.377-.122l-6.936 4.368-2.988-.934c-.65-.203-.663-.65.136-.962l11.684-4.502c.542-.196 1.015.127.839.999z"/>
        </svg>
      )
    },
    {
      name: "WhatsApp",
      url: socials.whatsapp,
      color: "bg-[#25D366]/10 border-[#25D366]/30 hover:bg-[#25D366]/20 hover:border-[#25D366]",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.061-4.512 10.063-10.062 0-2.69-1.048-5.216-2.951-7.121s-4.439-2.951-7.128-2.951c-5.55 0-10.061 4.513-10.064 10.063-.001 2.032.547 3.513 1.541 5.143l-1.019 3.722 3.84-.986zm11.367-7.584c-.31-.155-1.837-.906-2.115-1.006-.279-.1-.482-.149-.683.155-.201.304-.777 1.006-.953 1.207-.176.201-.351.226-.662.071-1.144-.572-1.923-.913-2.686-2.219-.201-.344.201-.319.577-1.071.075-.155.038-.291-.019-.396-.057-.106-.482-1.161-.662-1.595-.175-.424-.351-.366-.483-.372h-.411c-.142 0-.372.053-.566.265-.194.212-.741.724-.741 1.765s.757 2.047.863 2.19c.106.142 1.489 2.273 3.606 3.185.504.217.897.347 1.206.445.506.161.966.138 1.33.084.406-.06 1.837-.751 2.096-1.477.259-.725.259-1.347.182-1.477-.077-.13-.284-.207-.594-.362z"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      url: socials.linkedin,
      color: "bg-[#0A66C2]/10 border-[#0A66C2]/30 hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    }
  ];

  const filteredWorks =
    activeCategory === "All"
      ? works
      : works.filter((w) => w.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* SUCCESS POPUP MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-2">Thank You!</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Your message has been received successfully. I will get back to you shortly!
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            >
              Back To Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Intro Overlay */}
      {showIntro && (
        <div className="fixed inset-0 z-[999] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center intro-container">
          <div className="welcome-box text-center px-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white via-slate-200 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              WELCOME
            </h1>
            <p className="mt-3 text-blue-400 text-xs sm:text-sm font-bold uppercase tracking-[0.4em] welcome-sub">
              To My Creative Portfolio
            </p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="fixed w-full bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-800/50 px-6">
        <div className="max-w-6xl mx-auto py-3.5 flex justify-between items-center">
          <h1 className="text-lg font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
            RM RASEL HOSSAIN
          </h1>
          <div className="flex gap-5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <a href="#work" className="hover:text-blue-400 transition-colors">
              Works
            </a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6 flex justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <span className="orb orb-one"></span>
          <span className="orb orb-two"></span>
        </div>

        <div className="relative max-w-xl w-full text-center">
          <div className="relative inline-block p-[2px] rounded-[32px] overflow-hidden group shadow-[0_15px_60px_rgba(0,0,0,0.5)] mb-8">
            <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000_0%,#00ff00_25%,#0000ff_50%,#ffff00_75%,#ff0000_100%)]" />

            <div className="relative z-10 bg-slate-950/90 backdrop-blur-md rounded-[30px] p-6 sm:p-8 flex flex-col items-center">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl mb-4">
                <img
                  src="/my-photo.jpg"
                  alt="RM RASEL HOSSAIN"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                RM RASEL HOSSAIN
              </h2>

              <p className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">
                CREATIVE EDITOR
              </p>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.35em] text-slate-400 mb-3">
              EXPERIENCE
            </h3>

            <div className="h-12 max-w-xs mx-auto bg-slate-900/90 border border-slate-800 rounded-full flex items-center justify-center px-4 shadow-inner">
              <span
                className={`text-blue-400 text-xs sm:text-sm font-black uppercase tracking-widest transition-opacity duration-300 ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              >
                {skills[currentSkillIndex]}
              </span>
            </div>
          </div>

          <div>
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 hover:scale-105"
            >
              Explore Works ↓
            </a>
          </div>
        </div>
      </section>

      {/* Dynamic Portfolio Works Section */}
      <section
        id="work"
        className="py-14 px-6 bg-slate-900/30 border-t border-slate-800/80"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase mb-6 bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
              WORK GALLERY
            </h3>

            <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2 px-1">
              {["All", "Video Editing", "Motion Design"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all shrink-0 ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500 font-bold">
              Loading portfolio projects...
            </div>
          ) : filteredWorks.length === 0 ? (
            <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-3xl">
              No projects found in this category.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredWorks.map((item) => (
                <div
                  key={item.id}
                  className="group p-5 rounded-[28px] bg-slate-950 border border-slate-800 hover:border-blue-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_80px_rgba(59,130,246,0.12)] flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full aspect-video rounded-[20px] bg-slate-900 border border-slate-800 mb-5 overflow-hidden relative">
                      {item.video_url ? (
                        <iframe
                          src={getEmbedUrl(item.video_url)}
                          title={item.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          No Video Link
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                        {item.category || "Video Editing"}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>

                    {item.desc && (
                      <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                        {item.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto p-[1px] rounded-[28px] bg-gradient-to-r from-blue-500 via-emerald-400 to-purple-500">
          <div className="rounded-[27px] bg-slate-950 px-6 md:px-8 py-10 border border-slate-800">
            <p className="text-blue-400 text-[11px] font-bold uppercase tracking-[0.3em] mb-2">
              Get In Touch
            </p>

            <h3 className="text-2xl md:text-3xl font-black mb-6 text-white">
              Contact with Email
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-left">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 text-sm outline-none focus:border-blue-500 transition-all"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 text-sm outline-none focus:border-blue-500 transition-all"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                required
                rows="4"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 text-sm outline-none focus:border-blue-500 transition-all resize-none"
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            {/* Dynamic Social Media Links Container */}
            <div className="mt-10 pt-6 border-t border-slate-800/60">
              <h4 className="text-base sm:text-lg font-bold text-slate-200 mb-4">
                Prefer Instant Messaging? Reach Out Here
              </h4>

              <div className="flex justify-center gap-4 flex-wrap">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all duration-300 hover:scale-110 shadow-lg ${social.color}`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-slate-900 text-center text-slate-600 text-[11px] tracking-widest uppercase">
        © 2026 RM RASEL HOSSAIN • Video Editing Portfolio
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .intro-container {
          animation: fadeContainer 2.4s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }
        .welcome-box {
          animation: smoothWelcome 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .welcome-sub {
          animation: spreadLetters 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeContainer {
          0% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }

        @keyframes smoothWelcome {
          0% { transform: scale(0.85) translateY(30px); opacity: 0; filter: blur(10px); }
          30% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
          75% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
          100% { transform: scale(1.05) translateY(-20px); opacity: 0; filter: blur(8px); }
        }

        @keyframes spreadLetters {
          0% { letter-spacing: 0.1em; opacity: 0; }
          35% { letter-spacing: 0.4em; opacity: 1; }
          100% { letter-spacing: 0.5em; opacity: 0; }
        }

        .orb { position: absolute; width: 220px; height: 220px; border-radius: 999px; filter: blur(70px); opacity: .12; }
        .orb-one { left: 10%; top: 10%; background: #2563eb; }
        .orb-two { right: 10%; top: 20%; background: #22c55e; }
      `}</style>
    </div>
  );
};

export default App;