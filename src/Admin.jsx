import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function Admin() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("rm_admin_logged_in") === "true";
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState("order-tracker");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("alltime");

  // Client Orders State
  const [orders, setOrders] = useState([]);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Partial Paid");

  // Works State
  const [works, setWorks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Video Editing");
  
  // Video Options
  const [videoInputType, setVideoInputType] = useState("url");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  // Thumbnail Options
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [desc, setDesc] = useState("");
  const [position, setPosition] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Analytics State
  const [rawViews, setRawViews] = useState([]);
  const [analytics, setAnalytics] = useState({
    last7Days: 0,
    last30Days: 0,
    allTime: 0,
    totalViews7: 0,
    totalViews30: 0,
    totalViewsAll: 0,
    filteredVisitors: [],
    recentVisitors: []
  });

  // Social Links State
  const [socials, setSocials] = useState({
    facebook: "",
    telegram: "",
    whatsapp: "",
    linkedin: ""
  });

  const [msg, setMsg] = useState("");

  // Fetch initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWorks();
      fetchSocials();
      fetchAnalytics();
      fetchOrders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (rawViews.length > 0) {
      processAnalytics(rawViews, timeFilter);
    }
  }, [timeFilter, rawViews]);

  // LOGIN HANDLER
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const targetEmail = "rm.rasel.hossain24@gmail.com";
    const targetPassword = "rasel548";

    if (
      loginEmail.trim().toLowerCase() === targetEmail &&
      loginPassword.trim() === targetPassword
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("rm_admin_logged_in", "true");
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setLoginError("ইমেইল বা পাসওয়ার্ড সঠিক নয়! আবার চেষ্টা করুন।");
    }
  };

  // LOGOUT HANDLER
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("rm_admin_logged_in");
    setIsMenuOpen(false);
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("client_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setOrders(data);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  };

  // Add Order Logic
  const handleAddOrder = async (e) => {
    e.preventDefault();
    if (!clientName || !projectName) {
      alert("ক্লায়েন্ট নাম ও প্রজেক্টের নাম আবশ্যক!");
      return;
    }

    const advance = parseFloat(advanceAmount) || 0;
    const due = parseFloat(dueAmount) || 0;
    const calculatedTotal = advance + due;

    const { error } = await supabase.from("client_orders").insert([
      {
        client_name: clientName,
        project_name: projectName,
        advance_amount: advance,
        due_amount: due,
        total_amount: calculatedTotal,
        contact_info: contactInfo,
        payment_status: paymentStatus
      }
    ]);

    if (error) {
      setMsg("অর্ডার সেভ করতে সমস্যা: " + error.message);
    } else {
      setMsg("ক্লায়েন্ট পেমেন্ট হিসাব সফলভাবে যুক্ত হয়েছে! 💰");
      setClientName("");
      setProjectName("");
      setAdvanceAmount("");
      setDueAmount("");
      setContactInfo("");
      setPaymentStatus("Partial Paid");
      fetchOrders();
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("আপনি কি এই রেকর্ডটি ডিলিট করতে চান?")) {
      const { error } = await supabase.from("client_orders").delete().eq("id", id);
      if (!error) fetchOrders();
    }
  };

  // ANALYTICS FETCH & ACCURATE TIME CALCULATIONS
  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.from("page_views").select("*");
      if (error || !data) {
        console.error("Analytics Fetch Error:", error);
        return;
      }
      setRawViews(data);
      processAnalytics(data, timeFilter);
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
    }
  };

  const processAnalytics = (data, filterType) => {
    if (!data || !Array.isArray(data)) return;

    const now = new Date().getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    // Filter by timestamp safely
    const data7 = data.filter((item) => {
      if (!item.created_at) return true;
      const itemTime = new Date(item.created_at).getTime();
      return now - itemTime <= sevenDaysMs;
    });

    const data30 = data.filter((item) => {
      if (!item.created_at) return true;
      const itemTime = new Date(item.created_at).getTime();
      return now - itemTime <= thirtyDaysMs;
    });

    let targetDataset = data;
    if (filterType === "7days") targetDataset = data7;
    if (filterType === "30days") targetDataset = data30;

    // Unique Visitors Count Mapping
    const getUniqueVisitorCount = (dataset) => {
      const uniqueIds = new Set();
      dataset.forEach((item) => {
        if (item.visitor_id) uniqueIds.add(item.visitor_id);
      });
      return uniqueIds.size || dataset.length;
    };

    const visitorMap = {};
    targetDataset.forEach((item) => {
      const vId = item.visitor_id || "guest_visitor";
      const itemTime = item.created_at || new Date().toISOString();

      if (!visitorMap[vId]) {
        visitorMap[vId] = {
          id: vId,
          visits: 0,
          device: item.device_type || "Desktop",
          lastSeen: itemTime
        };
      }
      visitorMap[vId].visits += 1;
      if (new Date(itemTime) > new Date(visitorMap[vId].lastSeen)) {
        visitorMap[vId].lastSeen = itemTime;
      }
    });

    const sortedRecent = [...data].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });

    setAnalytics({
      last7Days: getUniqueVisitorCount(data7),
      last30Days: getUniqueVisitorCount(data30),
      allTime: getUniqueVisitorCount(data),
      totalViews7: data7.length,
      totalViews30: data30.length,
      totalViewsAll: data.length,
      filteredVisitors: Object.values(visitorMap).sort(
        (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
      ),
      recentVisitors: sortedRecent.slice(0, 5)
    });
  };

  const fetchWorks = async () => {
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("position", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (!error && data) setWorks(data);
  };

  const fetchSocials = async () => {
    const { data } = await supabase.from("social_links").select("*").eq("id", 1).single();
    if (data) {
      setSocials({
        facebook: data.facebook || "",
        telegram: data.telegram || "",
        whatsapp: data.whatsapp || "",
        linkedin: data.linkedin || ""
      });
    }
  };

  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleVideoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  // Work Add / Edit Handler
  const handleAddWork = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("টাইটেল দেওয়া আবশ্যক!");
      return;
    }

    if (videoInputType === "url" && !videoUrl) {
      alert("ভিডিও লিংক দেওয়া আবশ্যক!");
      return;
    }

    if (videoInputType === "file" && !videoFile && !editingId) {
      alert("ভিডিও ফাইল সিলেক্ট করা আবশ্যক!");
      return;
    }

    setUploading(true);
    setMsg("");

    let finalImageUrl = imageUrl;
    let finalVideoUrl = videoUrl;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `thumb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${fileExt}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from("thumbnails")
          .upload(fileName, imageFile);

        if (!storageError && storageData) {
          const { data: publicUrlData } = supabase.storage
            .from("thumbnails")
            .getPublicUrl(fileName);
          finalImageUrl = publicUrlData.publicUrl;
        } else if (storageError) {
          console.error("Thumbnail Upload Error:", storageError.message);
        }
      }

      if (videoInputType === "file" && videoFile) {
        const fileExt = videoFile.name.split(".").pop();
        const fileName = `video_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${fileExt}`;
        const { data: vidStorageData, error: vidStorageError } = await supabase.storage
          .from("videos")
          .upload(fileName, videoFile);

        if (!vidStorageError && vidStorageData) {
          const { data: publicUrlData } = supabase.storage
            .from("videos")
            .getPublicUrl(fileName);
          finalVideoUrl = publicUrlData.publicUrl;
        } else if (vidStorageError) {
          throw new Error("Video Upload Failed: " + vidStorageError.message);
        }
      }

      if (editingId) {
        const { error } = await supabase
          .from("works")
          .update({
            title,
            category,
            video_url: finalVideoUrl,
            image_url: finalImageUrl,
            desc,
            position: Number(position)
          })
          .eq("id", editingId);

        if (error) throw error;
        setMsg("প্রজেক্ট সফলভাবে আপডেট করা হয়েছে! 🎉");
      } else {
        const { error } = await supabase.from("works").insert([
          {
            title,
            category,
            video_url: finalVideoUrl,
            image_url: finalImageUrl,
            desc,
            position: Number(position || works.length + 1)
          }
        ]);

        if (error) throw error;
        setMsg("প্রজেক্ট সফলভাবে পোস্ট করা হয়েছে! 🎉");
      }

      resetWorkForm();
      fetchWorks();

    } catch (err) {
      setMsg("সমস্যা হয়েছে: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditWork = (item) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setCategory(item.category || "Video Editing");
    setVideoUrl(item.video_url || "");
    setImageUrl(item.image_url || item.thumbnail_url || "");
    setDesc(item.desc || "");
    setPosition(item.position || 1);
    setVideoInputType("url");
    setActiveTab("add-work");
  };

  const resetWorkForm = () => {
    setEditingId(null);
    setTitle("");
    setVideoUrl("");
    setVideoFile(null);
    setImageUrl("");
    setImageFile(null);
    setDesc("");
    setPosition(works.length + 1);
  };

  const handleUpdatePosition = async (id, newPos) => {
    const { error } = await supabase
      .from("works")
      .update({ position: Number(newPos) })
      .eq("id", id);

    if (!error) fetchWorks();
  };

  const handleDeleteWork = async (id) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই প্রজেক্টটি ডিলিট করতে চান?")) {
      const { error } = await supabase.from("works").delete().eq("id", id);
      if (!error) fetchWorks();
    }
  };

  const handleSocialUpdate = async (e) => {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.from("social_links").upsert({
      id: 1,
      ...socials
    });

    if (!error) setMsg("সোশ্যাল লিংকগুলো সফলভাবে আপডেট করা হয়েছে! 🎉");
  };

  const menuItems = [
    { id: "order-tracker", label: "Client Payment Tracker", icon: "💎" },
    { id: "analytics", label: "Live Visitor Analytics", icon: "📊" },
    { id: "add-work", label: editingId ? "Edit Work" : "Add New Work", icon: "📹" },
    { id: "existing-works", label: "Portfolio Posts", icon: "📂" },
    { id: "social-links", label: "Social Contacts", icon: "🔗" }
  ];

  // ----------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center px-4 font-sans text-slate-100 selection:bg-blue-500/30">
        <div className="w-full max-w-md bg-[#0b0f17] border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-[1px] mx-auto mb-4 shadow-lg shadow-blue-500/10">
              <div className="w-full h-full bg-[#0b0f17] rounded-[15px] flex items-center justify-center font-black text-xl text-blue-400">
                RM
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Authentication</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              এডমিন ড্যাশবোর্ডে প্রবেশের জন্য লগইন করুন
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium animate-pulse">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="rm.rasel.hossain24@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 mt-2"
            >
              Login To Admin
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-600 mt-8 uppercase tracking-widest font-bold">
            Protected Admin Access • RM RASEL HOSSAIN
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN ADMIN DASHBOARD (When Authenticated)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dark Navbar */}
      <nav className="fixed w-full bg-[#0b0f17]/90 backdrop-blur-xl z-40 border-b border-slate-800/60 px-6 py-3.5 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-[1px]">
            <div className="w-full h-full bg-[#0b0f17] rounded-[11px] flex items-center justify-center font-black text-xs text-blue-400">
              RM
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">
              RM RASEL HOSSAIN
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">
              Control Panel
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all flex items-center gap-2 active:scale-95"
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Side Drawer Menu */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed right-0 top-0 h-full w-72 bg-[#0b0f17] border-l border-slate-800/80 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            <div className="flex justify-between items-center pb-5 border-b border-slate-800/80 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Navigation Menu
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === item.id
                      ? "bg-blue-600/90 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-3 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              🚪 Logout Admin
            </button>
            <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest font-semibold">
              Admin v2.5 • Secured System
            </p>
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {msg && (
          <div className="mb-6 p-3.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-center text-xs font-semibold">
            {msg}
          </div>
        )}

        {/* TAB: CLIENT PAYMENT TRACKER */}
        {activeTab === "order-tracker" && (
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800/80 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>💎</span> Add Client Order & Payment Record
                </h2>
                <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  Auto Calculated
                </span>
              </div>

              <form onSubmit={handleAddOrder} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Rasel / Brand"
                      required
                      className="w-full p-2.5 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Project Name / Details *
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Commercial Video Editing"
                      required
                      className="w-full p-2.5 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Advance ($/৳)
                    </label>
                    <input
                      type="number"
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(e.target.value)}
                      placeholder="500"
                      className="w-full p-2.5 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-emerald-400 font-bold outline-none focus:border-blue-500 mt-1 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Due / Remaining ($/৳)
                    </label>
                    <input
                      type="number"
                      value={dueAmount}
                      onChange={(e) => setDueAmount(e.target.value)}
                      placeholder="1000"
                      className="w-full p-2.5 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-amber-400 font-bold outline-none focus:border-blue-500 mt-1 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Calculated Total
                    </label>
                    <div className="w-full p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-cyan-400 font-black mt-1">
                      {(parseFloat(advanceAmount) || 0) + (parseFloat(dueAmount) || 0)}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Client Contact (Email / Phone)
                    </label>
                    <input
                      type="text"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="client@gmail.com / +880..."
                      className="w-full p-2.5 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Payment Status
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-slate-200 outline-none focus:border-blue-500 mt-1 transition-all"
                    >
                      <option value="Partial Paid">Partial Paid (অর্ধেক দেওয়া)</option>
                      <option value="Fully Paid">Fully Paid (সম্পূর্ণ পরিশোধ)</option>
                      <option value="Pending">Pending (বাকি আছে)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20"
                >
                  Save Record
                </button>
              </form>
            </div>

            {/* SAVED CLIENT ORDERS */}
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800/80 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Financial Records & Client Orders ({orders.length})
                </h3>
                <span className="text-[10px] font-semibold text-slate-600">Horizontal Row View</span>
              </div>

              {orders.length === 0 ? (
                <p className="text-slate-500 text-xs italic py-8 text-center">
                  এখনো কোনো হিসাব যুক্ত করা হয়নি।
                </p>
              ) : (
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-[#080b12]/50">
                        <th className="py-3 px-3 whitespace-nowrap">Client Name</th>
                        <th className="py-3 px-3 whitespace-nowrap">Project</th>
                        <th className="py-3 px-3 whitespace-nowrap">Contact</th>
                        <th className="py-3 px-3 whitespace-nowrap">Advance</th>
                        <th className="py-3 px-3 whitespace-nowrap">Due</th>
                        <th className="py-3 px-3 whitespace-nowrap">Total</th>
                        <th className="py-3 px-3 whitespace-nowrap">Status</th>
                        <th className="py-3 px-3 text-right whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-xs">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#080b12]/80 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-white whitespace-nowrap">
                            {ord.client_name}
                          </td>
                          <td className="py-3.5 px-3 text-slate-300 font-medium whitespace-nowrap max-w-[150px] truncate">
                            {ord.project_name}
                          </td>
                          <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                            {ord.contact_info || "—"}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-emerald-400 whitespace-nowrap">
                            ${ord.advance_amount}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-amber-400 whitespace-nowrap">
                            ${ord.due_amount}
                          </td>
                          <td className="py-3.5 px-3 font-black text-blue-400 whitespace-nowrap">
                            ${ord.total_amount}
                          </td>
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                ord.payment_status === "Fully Paid"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              {ord.payment_status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-[11px] font-bold transition-all border border-red-500/20"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: VISITOR ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Live Traffic Analytics
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Click cards below to filter visitor list</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAnalytics}
                  className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg text-xs font-bold transition-all"
                >
                  🔄 Refresh Data
                </button>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Sync
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setTimeFilter("7days")}
                className={`p-5 rounded-2xl bg-[#0d121f] border cursor-pointer transition-all shadow-lg relative overflow-hidden ${
                  timeFilter === "7days"
                    ? "border-cyan-400 ring-2 ring-cyan-500/20 bg-[#101728]"
                    : "border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center justify-between">
                  Last 7 Days
                  {timeFilter === "7days" && <span className="text-[9px] bg-cyan-500/20 px-2 py-0.5 rounded">Active</span>}
                </p>
                <div className="text-3xl font-black text-white tracking-tight">
                  {analytics.last7Days}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  Unique Visitors ({analytics.totalViews7} Views)
                </p>
              </div>

              <div
                onClick={() => setTimeFilter("30days")}
                className={`p-5 rounded-2xl bg-[#0d121f] border cursor-pointer transition-all shadow-lg relative overflow-hidden ${
                  timeFilter === "30days"
                    ? "border-purple-400 ring-2 ring-purple-500/20 bg-[#101728]"
                    : "border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center justify-between">
                  Last 30 Days
                  {timeFilter === "30days" && <span className="text-[9px] bg-purple-500/20 px-2 py-0.5 rounded">Active</span>}
                </p>
                <div className="text-3xl font-black text-white tracking-tight">
                  {analytics.last30Days}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  Unique Visitors ({analytics.totalViews30} Views)
                </p>
              </div>

              <div
                onClick={() => setTimeFilter("alltime")}
                className={`p-5 rounded-2xl bg-[#0d121f] border cursor-pointer transition-all shadow-lg relative overflow-hidden ${
                  timeFilter === "alltime"
                    ? "border-emerald-400 ring-2 ring-emerald-500/20 bg-[#101728]"
                    : "border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center justify-between">
                  All-Time Total
                  {timeFilter === "alltime" && <span className="text-[9px] bg-emerald-500/20 px-2 py-0.5 rounded">Active</span>}
                </p>
                <div className="text-3xl font-black text-white tracking-tight">
                  {analytics.allTime}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  Unique Visitors ({analytics.totalViewsAll} Views)
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d121f] border border-slate-800/80 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Visitor List ({analytics.filteredVisitors.length} Found in{" "}
                  <span className="text-blue-400 uppercase">{timeFilter}</span>)
                </h3>
                <span className="text-[10px] font-medium text-slate-500">Full History</span>
              </div>

              {analytics.filteredVisitors.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500 italic">
                  কোনো ভিজিটর পাওয়া যায়নি।
                </div>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 no-scrollbar">
                  {analytics.filteredVisitors.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#080b12] border border-slate-800/50 text-xs hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-[11px] flex items-center justify-center">
                          #{i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{v.id}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {v.device} • Last Seen: {new Date(v.lastSeen).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 font-bold text-[10px] border border-blue-500/20">
                        {v.visits} Visits
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADD NEW WORK / EDIT WORK */}
        {activeTab === "add-work" && (
          <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/60">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>
              {editingId && (
                <button
                  onClick={resetWorkForm}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleAddWork} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Project Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Commercial Reel Edit"
                    required
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-slate-200 outline-none focus:border-blue-500 mt-1"
                  >
                    <option value="Video Editing">Video Editing</option>
                    <option value="Motion Design">Motion Design</option>
                  </select>
                </div>
              </div>

              {/* VIDEO INPUT TYPE SELECTOR */}
              <div className="p-4 rounded-xl bg-[#080b12] border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Video Source *
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setVideoInputType("url")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        videoInputType === "url"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      Paste Link (YouTube/Drive)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoInputType("file")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        videoInputType === "file"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      Upload Video File (PC)
                    </button>
                  </div>
                </div>

                {videoInputType === "url" ? (
                  <div>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtu.be/... or Google Drive Link"
                      className="w-full p-3 rounded-xl bg-[#0d121f] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="w-full p-2 rounded-xl bg-[#0d121f] border border-slate-800 text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-blue-600 file:text-white cursor-pointer mt-1"
                    />
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Thumbnail Image (Upload File)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full p-2 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-blue-600 file:text-white cursor-pointer mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Order / Position (1 = Top)</label>
                  <input
                    type="number"
                    min="1"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-blue-400 font-bold outline-none focus:border-blue-500 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Editing tools and project details..."
                  rows="3"
                  className="w-full p-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                {uploading ? "Publishing & Uploading..." : editingId ? "Update Project" : "Publish Project"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: EXISTING POSTS */}
        {activeTab === "existing-works" && (
          <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800/80 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-slate-800/60 flex items-center justify-between">
              <span>Existing Portfolio Posts ({works.length})</span>
              <span className="text-xs text-slate-500 font-normal">Change "Order #" to re-arrange videos</span>
            </h2>

            {works.length === 0 ? (
              <p className="text-slate-500 text-xs italic py-6 text-center">এখনো কোনো প্রজেক্ট আপলোড করা হয়নি।</p>
            ) : (
              <div className="space-y-3">
                {works.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#080b12] border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Order #</span>
                        <input
                          type="number"
                          min="1"
                          value={item.position || index + 1}
                          onChange={(e) => handleUpdatePosition(item.id, e.target.value)}
                          className="w-10 text-center bg-transparent font-black text-blue-400 text-xs outline-none"
                        />
                      </div>

                      <div className="overflow-hidden">
                        <span className="text-[9px] uppercase font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10">
                          {item.category}
                        </span>
                        <h3 className="font-semibold text-slate-200 text-xs truncate mt-1">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditWork(item)}
                        className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-[11px] font-bold transition-all border border-blue-500/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteWork(item.id)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-[11px] font-bold transition-all border border-red-500/20 shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SOCIAL LINKS */}
        {activeTab === "social-links" && (
          <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800/80 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-slate-800/60">
              Manage Contact Links
            </h2>

            <form onSubmit={handleSocialUpdate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Facebook URL</label>
                  <input
                    type="text"
                    value={socials.facebook}
                    onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Telegram Link</label>
                  <input
                    type="text"
                    value={socials.telegram}
                    onChange={(e) => setSocials({ ...socials, telegram: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Link</label>
                  <input
                    type="text"
                    value={socials.whatsapp}
                    onChange={(e) => setSocials({ ...socials, whatsapp: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">LinkedIn URL</label>
                  <input
                    type="text"
                    value={socials.linkedin}
                    onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-500/20"
              >
                Save Contact Links
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}