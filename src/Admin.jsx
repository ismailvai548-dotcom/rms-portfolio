import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function Admin() {
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
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  // Analytics State
  const [rawViews, setRawViews] = useState([]);
  const [analytics, setAnalytics] = useState({
    last7Days: 0,
    last30Days: 0,
    allTime: 0,
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

  useEffect(() => {
    fetchWorks();
    fetchSocials();
    fetchAnalytics();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (rawViews.length > 0) {
      processAnalytics(rawViews, timeFilter);
    }
  }, [timeFilter, rawViews]);

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

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.from("page_views").select("*");
      if (error || !data) return;
      setRawViews(data);
      processAnalytics(data, timeFilter);
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
    }
  };

  const processAnalytics = (data, filterType) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const data7 = data.filter((item) => new Date(item.created_at) >= sevenDaysAgo);
    const data30 = data.filter((item) => new Date(item.created_at) >= thirtyDaysAgo);

    let targetDataset = data;
    if (filterType === "7days") targetDataset = data7;
    if (filterType === "30days") targetDataset = data30;

    const visitorMap = {};
    targetDataset.forEach((item) => {
      if (!visitorMap[item.visitor_id]) {
        visitorMap[item.visitor_id] = {
          id: item.visitor_id,
          visits: 0,
          device: item.device_type || "Desktop",
          lastSeen: item.created_at
        };
      }
      visitorMap[item.visitor_id].visits += 1;
      if (new Date(item.created_at) > new Date(visitorMap[item.visitor_id].lastSeen)) {
        visitorMap[item.visitor_id].lastSeen = item.created_at;
      }
    });

    const sortedRecent = [...data].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    setAnalytics({
      last7Days: data7.length,
      last30Days: data30.length,
      allTime: data.length,
      filteredVisitors: Object.values(visitorMap).sort(
        (a, b) => new Date(b.lastSeen) - new Date(a.lastSeen)
      ),
      recentVisitors: sortedRecent.slice(0, 5)
    });
  };

  const fetchWorks = async () => {
    const { data, error } = await supabase
      .from("works")
      .select("*")
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleAddWork = async (e) => {
    e.preventDefault();
    if (!title || !videoUrl) {
      alert("টাইটেল এবং ভিডিও লিংক আবশ্যক!");
      return;
    }

    setUploading(true);
    setMsg("");

    let finalImageUrl = imageUrl;

    if (imageFile) {
      try {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from("thumbnails")
          .upload(fileName, imageFile);

        if (!storageError && storageData) {
          const { data: publicUrlData } = supabase.storage
            .from("thumbnails")
            .getPublicUrl(fileName);
          finalImageUrl = publicUrlData.publicUrl;
        }
      } catch (err) {
        console.log("Storage upload skipped or fallback to URL", err);
      }
    }

    const { error } = await supabase.from("works").insert([
      {
        title,
        category,
        video_url: videoUrl,
        image_url: finalImageUrl,
        desc
      }
    ]);

    setUploading(false);

    if (error) {
      setMsg("ভিডিও আপলোড করতে সমস্যা হয়েছে: " + error.message);
    } else {
      setMsg("প্রজেক্ট সফলভাবে পোস্ট করা হয়েছে! 🎉");
      setTitle("");
      setVideoUrl("");
      setImageUrl("");
      setImageFile(null);
      setDesc("");
      fetchWorks();
    }
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

    if (!error) setMsg("সোশ্যাল লিংকগুলো সফলভাবে আপডেট করা হয়েছে! 🎉");
  };

  const menuItems = [
    { id: "order-tracker", label: "Client Payment Tracker", icon: "💎" },
    { id: "analytics", label: "Live Visitor Analytics", icon: "📊" },
    { id: "add-work", label: "Add New Work", icon: "📹" },
    { id: "existing-works", label: "Portfolio Posts", icon: "📂" },
    { id: "social-links", label: "Social Contacts", icon: "🔗" }
  ];

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

        {/* Menu Toggle */}
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

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
              Admin v2.5 • System Active
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

        {/* TAB: CLIENT PAYMENT TRACKER (DARK THEME, HORIZONTAL TABLE LAYOUT) */}
        {activeTab === "order-tracker" && (
          <div className="space-y-8">
            {/* Input Form Box */}
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
                      <option value="Partial Paid">Partial Paid (অর্ধেক দেওয়া)</option>
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

            {/* SAVED CLIENT ORDERS - DARK THEME HORIZONTAL TABLE LAYOUT */}
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800/80 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Financial Records & Client Orders ({orders.length})
                </h3>
                <span className="text-[10px] font-semibold text-slate-600">Horizontal Row View</span>
              </div>

              {orders.length === 0 ? (
                <p className="text-slate-500 text-xs italic py-8 text-center">
                  এখনো কোনো হিসাব যুক্ত করা হয়নি।
                </p>
              ) : (
                /* Responsive Horizontal Table Container */
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
                <p className="text-xs text-slate-500 mt-0.5">Click any card below to filter visitors list</p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
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
                <p className="text-[10px] text-slate-500 mt-2 font-medium">Click to filter list</p>
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
                <p className="text-[10px] text-slate-500 mt-2 font-medium">Click to filter list</p>
              </div>

              <div
                onClick={() => setTimeFilter("alltime")}
                className={`p-5 rounded-2xl bg-[#0d121f] border cursor-pointer transition-all shadow-lg relative overflow-hidden ${
                  timeFilter === "alltime"
                    ? "border-emerald-400 ring-2 ring-emerald-500/20 bg-[#101728]"
                    : "border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1 flex items-center justify-between">
                  All-Time Total
                  {timeFilter === "alltime" && <span className="text-[9px] bg-emerald-500/20 px-2 py-0.5 rounded">Active</span>}
                </p>
                <div className="text-3xl font-black text-white tracking-tight">
                  {analytics.allTime}
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">Click to filter list</p>
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
                  কোনো ভিজিটর পাওয়া যায়নি।
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

        {/* TAB 2: ADD NEW WORK */}
        {activeTab === "add-work" && (
          <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800/80 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-slate-800/60">
              Add New Project
            </h2>

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

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Video Link (YouTube) *</label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtu.be/..."
                    required
                    className="w-full p-3 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-white outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Thumbnail Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 rounded-xl bg-[#080b12] border border-slate-800 text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-blue-600 file:text-white cursor-pointer mt-1"
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
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20"
              >
                {uploading ? "Publishing..." : "Publish Project"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: EXISTING POSTS */}
        {activeTab === "existing-works" && (
          <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800/80 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-slate-800/60">
              Existing Portfolio Posts ({works.length})
            </h2>

            {works.length === 0 ? (
              <p className="text-slate-500 text-xs italic py-6 text-center">এখনো কোনো প্রজেক্ট আপলোড করা হয়নি।</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {works.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#080b12] border border-slate-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="overflow-hidden">
                      <span className="text-[9px] uppercase font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-slate-200 text-xs truncate mt-1">
                        {item.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDeleteWork(item.id)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-[11px] font-bold transition-all shrink-0"
                    >
                      Delete
                    </button>
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