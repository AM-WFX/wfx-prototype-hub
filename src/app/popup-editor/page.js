"use client";

import { useState } from "react";

export default function PopupEditorPage() {
  // --- 📦 WORKSPACE INTERACTIVE STATE ---
  const [activeTab, setActiveTab] = useState("config"); // config, visibility, css
  const [popupTitle, setPopupTitle] = useState("New Feature Announcement");
  const [popupDesc, setPopupDesc] = useState("We've upgraded the core interface pipelines for a smoother workspace experience.");
  const [showBackdrop, setShowBackdrop] = useState(true);
  const [backdropColor, setBackdropColor] = useState("dark"); // dark, light, blurred

  return (
    <div className="flex flex-col h-screen w-full bg-[#f6f6f9] overflow-hidden relative">
      
      {/* 🎯 EXACT MATCH: DVM MASTER HEADER AND NAVIGATION TAB DECK */}
      <div id="dvm-header" className="bg-white shrink-0 shadow-sm z-10">
        <div className="px-6 pt-4 pb-0">
          
          {/* Breadcrumbs Row */}
          <div className="dvm-breadcrumbs flex items-center gap-2 text-[13px] mb-3 text-[#6b697b]">
            <a href="/" className="hover:text-[#1f1f32] font-medium transition-colors">Widgets Dashboard</a>
            <span className="text-[#d7d6d1]">/</span>
            <span className="text-[#1f1f32] font-medium">Pop-up Editor</span>
            <span className="ml-2 px-2.5 py-[2px] bg-blue-50 text-[#0975d7] border border-blue-100 rounded-full text-[11px] font-semibold tracking-wide">Editing</span>
          </div>
          
          {/* Title and Functional Action Button Area (Locked at mb-5 height layout) */}
          <div className="dvm-title-area flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <img src="/icons/Pop-up.svg" alt="Popup View" className="w-5 h-5 object-contain" />
              <h2 className="text-[20px] font-bold text-[#1f1f32]">{popupTitle}</h2>
            </div>
            
            <div className="dvm-header-actions flex items-center gap-2.5">
              <button className="h-[46px] px-4 bg-white border border-[#0975d7] text-[#0975d7] rounded-[4px] text-[14px] font-medium flex items-center gap-1.5 hover:bg-blue-50 transition-colors">
                <svg className="icon icon-tabler icon-tabler-sparkles" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"></path></svg> Enhance ▾
              </button>
              <button className="h-[46px] px-4 bg-white border border-[#d7d6d1] text-[#3d3c52] rounded-[4px] text-[14px] font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                <svg className="icon icon-tabler icon-tabler-eye" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="2"></circle><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"></path></svg> Preview ▾
              </button>
              
              <button className="h-[46px] px-4 bg-white border border-[#dfdde7] text-[#2b2b40] text-[14px] font-medium rounded-[4px] hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5 w-fit">
                Launch live edit 
                <svg className="icon icon-tabler icon-tabler-external-link" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"></path><line x1="10" y1="14" x2="20" y2="4"></line><polyline points="15 4 20 4 20 9"></polyline></svg>
              </button>

              <button className="h-[46px] px-3 bg-white border border-[#d7d6d1] text-[#3d3c52] rounded-[4px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="icon icon-tabler icon-tabler-dots-vertical" width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="12" cy="5" r="1"></circle></svg>
              </button>
            </div>
          </div>

          {/* 橘色 DVM-Tabs Row Frame Cloned Exactly */}
          <div className="dvm-tabs flex gap-6 h-[48px]">
            {[
              { id: "config", label: "Configurations" },
              { id: "visibility", label: "Visibility Rules" },
              { id: "css", label: "CSS" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-item h-full flex items-center relative transition-colors text-[14px] font-medium cursor-pointer ${
                    isActive 
                      ? "font-semibold text-[#c74900] after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[4px] after:bg-[#c74900] after:rounded-t-[4px]" 
                      : "text-[#6b697b] hover:text-[#1f1f32]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 🖥️ MAIN WORKSPACE ARCHITECTURE */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* LEFT CANVAS WINDOWPANEL */}
        <div className={`flex-1 p-8 flex items-center justify-center transition-all ${
          showBackdrop 
            ? backdropColor === "dark" ? "bg-slate-900/60" 
            : backdropColor === "blurred" ? "bg-slate-900/40 backdrop-blur-xs" 
            : "bg-white/40 shadow-inner"
            : "bg-[#eef1f6]"
        }`}>
          
          {/* POP-UP WORKSPACE TOOLTIP CONTROLLER CONTAINER */}
          <div className="w-full max-w-[480px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="relative h-[160px] bg-gradient-to-br from-slate-800 to-indigo-900 p-6 flex items-end">
              <button className="absolute top-4 right-4 w-6 h-6 bg-white/10 text-white hover:bg-white/20 rounded-full flex items-center justify-center text-sm transition-colors">&times;</button>
              <span className="absolute top-4 left-4 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold uppercase rounded tracking-wider">Announcement</span>
              <h3 className="text-xl font-bold text-white tracking-tight">{popupTitle}</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-500 text-[13px] leading-relaxed">{popupDesc}</p>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2.5">
                <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800">Remind Me Later</button>
                <button className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded shadow-xs">Explore Feature</button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PROPERTY EDIT DRAWER (Driven dynamically by the main header tabs) */}
        <div className="w-[340px] bg-white h-full border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-5 space-y-5 text-xs pb-24">
          
          {activeTab === "config" && (
            <>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Content Parameters</span>
              
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Popover Banner Heading</label>
                <input 
                  type="text" 
                  value={popupTitle}
                  onChange={(e) => setPopupTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:outline-blue-500 bg-white text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Description Body Context</label>
                <textarea 
                  rows={3}
                  value={popupDesc}
                  onChange={(e) => setPopupDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:outline-blue-500 bg-white text-gray-800 leading-relaxed resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Backdrop Modifiers</span>
                
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-gray-700">Dim Overlay Backdrop</span>
                  <input 
                    type="checkbox" 
                    className="wfx-switch" 
                    checked={showBackdrop}
                    onChange={() => setShowBackdrop(!showBackdrop)}
                  />
                </div>

                {showBackdrop && (
                  <div className="space-y-1.5 animate-fade-in-up">
                    <label className="font-bold text-gray-700 block">Overlay Texture Style</label>
                    <select 
                      value={backdropColor}
                      onChange={(e) => setBackdropColor(e.target.value)}
                      className="w-full h-9 border border-gray-300 rounded px-2 bg-white text-gray-700 focus:outline-blue-500"
                    >
                      <option value="dark">Standard Charcoal Slate (60%)</option>
                      <option value="blurred">Immersive Frosted Glass Blur</option>
                      <option value="light">Vanilla Highlight Accent</option>
                    </select>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "visibility" && (
            <div className="text-gray-400 text-center py-8">
              <img src="/icons/Blocker icon.svg" alt="Gating" className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p className="font-medium">User segmentation parameter configurations...</p>
            </div>
          )}

          {activeTab === "css" && (
            <div className="text-gray-400 text-center py-8">
              <p className="font-mono text-[11px] bg-gray-50 border p-2 rounded text-left text-gray-500">.wfx-popup-custom-frame {'{ border-radius: 12px; }'}</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}