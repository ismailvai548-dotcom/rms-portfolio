import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc || !image) {
      alert("সবগুলো ঘর পূরণ করুন!");
      return;
    }

    setUploading(true);

    try {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('works')
        .insert([{ title, desc, image_url: data.publicUrl }]);

      if (insertError) throw insertError;

      alert("সফলভাবে আপলোড হয়েছে! 🎉");
      setTitle(''); setDesc(''); setImage(null);
      e.target.reset();

    } catch (error) {
      alert("সমস্যা: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-400">Admin Dashboard</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
            placeholder="Title"
          />
          <textarea 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows="3"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
            placeholder="Description"
          ></textarea>
          <input 
            type="file" 
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-sm text-slate-400"
          />
          <button 
            type="submit" 
            disabled={uploading}
            className="w-full py-4 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Project"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-slate-500 hover:text-white text-sm">← Back to Home</a>
        </div>
      </div>
    </div>
  );
};

export default Admin;