"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ShareModal from "@/components/ShareModal";

function MainDashboardShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") === "widget" ? "widget" : "content";
  
  // --- 🎛️ VARIANT CONTROLLER ---
  const [activeVariant, setActiveVariant] = useState('v1'); // 'v1', 'v2', 'v3'

  // Dashboard Core State
  const [subTab, setSubTab] = useState("Ready"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([7]); 
  
  // Hover & Menu States
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null); 

  // Modal Triggers
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Figma Accurate Content Data 
  const contentRows = [
    { id: 1, name: "Employee onboarding", type: "-", author: "John G", date: "Sep 15, 2021", isFolder: true, count: 5 },
    { id: 2, name: "Introduction to the team", type: "Flow", author: "John G", date: "Sep 15, 2021" },
    { id: 3, name: "Company overview", type: "Flow", author: "John G", date: "Sep 15, 2021" },
    { id: 4, name: "Policies and procedures", type: "Flow", author: "John G", date: "Sep 15, 2021" },
    { id: 5, name: "Company overview", type: "Flow", author: "John G", date: "Sep 15, 2021" },
    { id: 6, name: "Job shadowing", type: "Flow", author: "John G", date: "Sep 15, 2021" },
    { id: 7, name: "Performance expectations", type: "Flow", author: "John Doe", date: "Sep 15, 2021" },
    { id: 8, name: "Company culture", type: "Flow", author: "John Doe", date: "Sep 15, 2021" },
    { id: 9, name: "Feedback and checkin", type: "Flow", author: "John Doe", date: "Sep 15, 2021" },
    { id: 10, name: "Setting up payroll", type: "Flow", author: "John Doe", date: "Sep 15, 2021" },
    { id: 11, name: "Setting up payroll", type: "Flow", author: "John Doe", date: "Sep 15, 2021" },
    { id: 12, name: "Setting up payroll", type: "Flow", author: "John Doe", date: "Sep 15, 2021" },
  ];

  const filteredData = contentRows.filter(row => row.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Multi-Select Handlers
  const toggleSelection = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(row => row.id));
    }
  };

  const hasSelection = selectedItems.length > 0;
  const isEmbedAllowed = selectedItems.length <= 1;

  // Closes dropdowns when clicking outside
  const handleAppClick = () => {
    if (openMenuId) setOpenMenuId(null);
  };

  return (
    <div className="absolute inset-0 flex flex-col min-w-0 bg-[#FFFFFF] overflow-hidden font-['Inter']" onClick={handleAppClick}>
      
      {/* --- 🎛️ MINIFIED VARIANT TOGGLE (Invisible until hovered over in the top right corner) --- */}
      <div className={`absolute top-0 right-0 p-6 z-[100] opacity-0 hover:opacity-100 transition-opacity duration-300 ${isShareModalOpen ? 'hidden' : 'block'}`}>
        <div className="flex items-center gap-0.5 bg-white border border-[#dfdde7] rounded-md p-1 shadow-md scale-90 origin-top-right">
          {['v1', 'v2', 'v3'].map(v => (
            <label key={v} className={`flex items-center px-2 py-1 rounded cursor-pointer text-[11px] font-bold uppercase transition-all ${activeVariant === v ? 'bg-blue-50 text-[#0975D7]' : 'text-[#6B697B] hover:bg-gray-50'}`}>
              <input type="radio" name="variant" checked={activeVariant === v} onChange={() => setActiveVariant(v)} className="hidden" />
              {v}
            </label>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* 1️⃣ HEADER                                 */}
      {/* ========================================== */}
      <div className="flex flex-row justify-between items-center px-[32px] pt-[24px] pb-[16px] shrink-0">
        <h1 className="font-bold text-[24px] leading-[32px] text-[#1F1F32]">
          Content
        </h1>
        <button className="flex flex-row justify-center items-center px-[16px] py-[10px] h-[44px] bg-[#C74900] hover:bg-[#A83D00] rounded-[4px] gap-[8px] transition-colors cursor-pointer">
          <span className="font-medium text-[14px] text-[#FFFFFF]">Create content</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>

      {/* ========================================== */}
      {/* 2️⃣ TABS & TOOLBAR                         */}
      {/* ========================================== */}
      <div className="flex flex-row justify-between items-end px-[32px] border-b border-[#F2F2F8] shrink-0">
        
        <div className="flex flex-row items-center h-[52px] gap-[24px]">
          {["Draft", "Ready", "Production"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setSubTab(tab)}
              className="flex flex-col items-center justify-between h-full pt-[14px] relative group cursor-pointer border-none outline-none"
            >
              <span className={`font-semibold text-[16px] pb-[12px] transition-colors ${subTab === tab ? "text-[#0975D7]" : "text-[#3D3C52] group-hover:text-[#0975D7]"}`}>
                {tab}
              </span>
              <div className={`absolute bottom-0 w-full h-[4px] rounded-t-[4px] transition-colors ${subTab === tab ? "bg-[#0975D7]" : "bg-transparent"}`}></div>
            </button>
          ))}
        </div>

        <div className="flex flex-row items-center gap-[12px] pb-[8px]">
          <button className="flex flex-row items-center justify-center px-[8px] py-[8px] gap-[6px] h-[44px] bg-white rounded-[4px] hover:bg-blue-50 transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0975D7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
            <span className="font-medium text-[14px] text-[#0975D7]">Create folder</span>
          </button>
          
          <div className="box-border flex flex-row items-center px-[12px] w-[300px] h-[44px] bg-white border border-[#C0BECC] rounded-[4px] focus-within:border-[#0975D7] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B697B" strokeWidth="2" className="mr-[8px] shrink-0"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none font-italic text-[14px] text-[#3D3C52] placeholder:text-[#6B697B] placeholder:italic"
            />
          </div>

          <button className="box-border flex flex-row justify-center items-center px-[16px] gap-[8px] h-[44px] bg-white border border-[#DFDDE7] rounded-[4px] hover:bg-gray-50 text-[#3D3C52] transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B697B" strokeWidth="2"><circle cx="14" cy="6" r="2"></circle><line x1="4" y1="6" x2="12" y2="6"></line><line x1="16" y1="6" x2="20" y2="6"></line><circle cx="8" cy="18" r="2"></circle><line x1="4" y1="18" x2="6" y2="18"></line><line x1="10" y1="18" x2="20" y2="18"></line></svg>
            <span className="font-medium text-[14px]">Filters</span>
          </button>

          <div className="w-[1px] h-[44px] bg-[#F2F2F8] mx-[4px]"></div>

          <div className="flex border border-[#8C899F] rounded-[4px] overflow-hidden h-[44px] shrink-0 cursor-pointer">
            <button className="box-border flex justify-center items-center w-[44px] h-full bg-white border-r border-[#DFDDE7] hover:bg-gray-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B697B" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
            </button>
            <button className="box-border flex justify-center items-center w-[44px] h-full bg-white hover:bg-gray-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B697B" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3️⃣ PERMANENT BULK ACTION TOOLBAR            */}
      {/* ========================================== */}
      <div className="flex flex-row items-center w-full px-[32px] h-[52px] shrink-0 bg-white z-20 border-b border-[#F2F2F8]">
        {hasSelection && (
          <>
            {/* Selected Count Chip */}
            <div className="w-[120px] flex items-center shrink-0">
              <div className="box-border flex flex-row items-center px-[8px] py-[2px] gap-[6px] h-[28px] bg-[#D7EFFE] border border-[#0975D7] rounded-[24px] animate-fade-in-up">
                <span className="font-medium text-[14px] leading-[20px] text-[#0D59AB] whitespace-nowrap">{selectedItems.length} Selected</span>
                <button onClick={() => setSelectedItems([])} className="flex flex-row items-center justify-center p-[2px] w-[20px] h-[20px] rounded-[16px] hover:bg-blue-200 transition-colors cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0975D7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center gap-[4px] animate-fade-in-up">
              <button className="flex flex-row items-center px-[10px] py-[6px] gap-[6px] h-[36px] rounded-[4px] transition-colors text-[#3D3C52] hover:bg-gray-50 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525066" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                <span className="font-medium text-[14px]">Send to Ready</span>
              </button>

              <button className="flex flex-row items-center px-[10px] py-[6px] gap-[6px] h-[36px] rounded-[4px] transition-colors text-[#3D3C52] hover:bg-gray-50 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525066" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                <span className="font-medium text-[14px]">Move to folder</span>
              </button>
              
              <button onClick={() => setIsShareModalOpen(true)} className="flex flex-row items-center px-[10px] py-[6px] gap-[6px] h-[36px] rounded-[4px] transition-colors text-[#3D3C52] hover:bg-gray-50 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525066" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                <span className="font-medium text-[14px]">Share</span>
              </button>

              <button className="flex flex-row items-center px-[10px] py-[6px] gap-[6px] h-[36px] rounded-[4px] transition-colors text-[#3D3C52] hover:bg-gray-50 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525066" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 18 15 15"></polyline></svg>
                <span className="font-medium text-[14px]">Download language files</span>
              </button>

              <button className="flex flex-row items-center px-[10px] py-[6px] gap-[6px] h-[36px] rounded-[4px] transition-colors text-[#3D3C52] hover:bg-gray-50 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525066" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                <span className="font-medium text-[14px]">Tags</span>
              </button>

              <button className="flex flex-row items-center px-[10px] py-[6px] gap-[6px] h-[36px] rounded-[4px] transition-colors text-[#3D3C52] hover:bg-gray-50 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525066" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                <span className="font-medium text-[14px]">Archive</span>
              </button>

              <button className="flex flex-row items-center px-[10px] py-[6px] gap-[6px] h-[36px] rounded-[4px] transition-colors text-[#B3141D] hover:bg-red-50 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B3141D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                <span className="font-medium text-[14px]">Delete</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ========================================== */}
      {/* 4️⃣ CORE TABLE AREA                          */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col overflow-hidden px-[32px] py-[16px]">
        <div className="flex-1 overflow-auto custom-scrollbar border border-[#DFDDE7] rounded-[4px] bg-white w-full">
          <div className="flex flex-col min-w-[1100px]">
            
            {/* Table Header */}
            <div className="flex flex-row items-center w-full h-[48px] bg-[#F2F2F8] border-b border-[#DFDDE7] shrink-0 sticky top-0 z-[30]">
              {/* Header Checkbox */}
              <div className="flex items-center justify-center w-[48px] h-full shrink-0 border-r border-transparent">
                <input 
                  type="checkbox" 
                  checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 border-[#8C899F] rounded-[4px] cursor-pointer"
                />
              </div>
              
              <div className="flex flex-row items-center gap-[4px] flex-1 px-[16px] h-full shrink-0 min-w-[300px]">
                <span className="font-semibold text-[14px] text-[#2B2B40]">Name</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525066" strokeWidth="2"><path d="M7 15l5 5 5-5"></path><path d="M7 9l5-5 5 5"></path></svg>
              </div>

              <div className="flex flex-row items-center px-[16px] w-[70px] h-full shrink-0">
                <span className="font-semibold text-[14px] text-[#2B2B40]">Type</span>
              </div>

              <div className="flex flex-row items-center gap-[4px] px-[16px] w-[164px] h-full shrink-0">
                <span className="font-semibold text-[14px] text-[#2B2B40]">Last updated on</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525066" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </div>

              <div className="flex flex-row items-center gap-[4px] px-[16px] w-[164px] h-full shrink-0">
                <span className="font-semibold text-[14px] text-[#2B2B40]">Last updated by</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525066" strokeWidth="2"><path d="M7 15l5 5 5-5"></path><path d="M7 9l5-5 5 5"></path></svg>
              </div>
            </div>

            {/* Table Rows */}
            {filteredData.map((row) => {
              const isSelected = selectedItems.includes(row.id);
              const isHovered = hoveredRowId === row.id || openMenuId === row.id;

              return (
                <div 
                  key={row.id} 
                  className={`flex flex-row items-center w-full h-[48px] border-b border-[#F1F1EE] last:border-b-0 transition-colors group relative ${isSelected ? "bg-[#F0F9FF]" : "bg-white hover:bg-[#F0F9FF]"}`}
                  onMouseEnter={() => setHoveredRowId(row.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                >
                  {/* Checkbox */}
                  <div className="flex flex-row items-center justify-center w-[48px] h-full shrink-0 bg-transparent">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleSelection(row.id)}
                      className="w-4 h-4 border-[#8C899F] rounded-[4px] cursor-pointer"
                    />
                  </div>
                  
                  {/* Name Col */}
                  <div className="flex flex-row items-center gap-[12px] flex-1 px-[16px] h-full bg-transparent min-w-[300px] relative">
                    {row.isFolder ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B697B" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    ) : row.type === "Flow" ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B697B" strokeWidth="2"><path d="M12 21v-4"></path><path d="M12 13v-4"></path><path d="M12 5v-2"></path><path d="M10 21h4"></path><path d="M8 5v4h11l2 -2l-2 -2z"></path><path d="M14 13v4h-8l-2 -2l2 -2z"></path></svg>
                    ) : (
                      <div className="w-[20px]" />
                    )}
                    
                    <span className="font-normal text-[14px] text-[#3D3C52] truncate max-w-[280px]">{row.name}</span>
                    
                    {row.count && (
                      <div className="flex items-center justify-center px-[8px] h-[28px] bg-[#F6F6F9] rounded-[32px] shrink-0 ml-1 border border-[#DFDDE7]">
                        <span className="font-medium text-[14px] text-[#3D3C52]">{row.count}</span>
                      </div>
                    )}

                    {/* Inline Hover Action Group */}
                    {isHovered && !row.isFolder && (
                      <div className="absolute right-[16px] flex items-center gap-[4px] z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-transparent hover:bg-[#E2E8F0] transition-colors cursor-pointer text-[#6B697B]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </button>
                        
                        {/* PENCIL BUTTON WITH ROUTER LINK */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push('/dvm');
                          }}
                          className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-transparent hover:bg-[#E2E8F0] transition-colors cursor-pointer text-[#6B697B]"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        
                        <div className="relative flex items-center h-full">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === row.id ? null : row.id); }}
                            className={`flex items-center justify-center w-[32px] h-[32px] rounded-full transition-colors cursor-pointer text-[#6B697B] ${openMenuId === row.id ? 'bg-[#E2E8F0]' : 'bg-transparent hover:bg-[#E2E8F0]'}`}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle><circle cx="5" cy="12" r="1.5"></circle></svg>
                          </button>
                          
                          {/* Ellipsis Dropdown Menu */}
                          {openMenuId === row.id && (
                            <div className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-[116px] bg-white rounded-[4px] py-[4px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-50 border border-[#DFDDE7]">
                              <button onClick={(e) => { e.stopPropagation(); setIsShareModalOpen(true); setOpenMenuId(null); }} className="w-full flex items-center px-[12px] py-[6px] gap-[8px] hover:bg-gray-50 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B697B" strokeWidth="1.6"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                                <span className="text-[14px] text-[#3D3C52] font-normal">Share</span>
                              </button>
                              <button className="w-full flex items-center px-[12px] py-[6px] gap-[8px] hover:bg-gray-50 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B697B" strokeWidth="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                <span className="text-[14px] text-[#3D3C52] font-normal">PDF</span>
                              </button>
                              <button className="w-full flex items-center px-[12px] py-[6px] gap-[8px] hover:bg-gray-50 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B697B" strokeWidth="1.6"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                                <span className="text-[14px] text-[#3D3C52] font-normal">Archive</span>
                              </button>
                              <div className="w-full px-[8px] py-[4px]">
                                <div className="w-full h-[1px] bg-[#F2F2F8]"></div>
                              </div>
                              <button className="w-full flex items-center px-[12px] py-[6px] gap-[8px] hover:bg-red-50 transition-colors cursor-pointer">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B3141D" strokeWidth="1.6"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                <span className="text-[14px] text-[#B3141D] font-normal">Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Type Col */}
                  <div className="flex flex-row items-center px-[16px] w-[70px] h-full shrink-0 bg-transparent pointer-events-none">
                    <span className="font-normal text-[14px] text-[#8C899F]">{row.type}</span>
                  </div>

                  {/* Date Col */}
                  <div className="flex flex-row items-center px-[16px] w-[164px] h-full shrink-0 bg-transparent pointer-events-none">
                    <span className="font-normal text-[14px] text-[#8C899F]">{row.date}</span>
                  </div>

                  {/* Author Col */}
                  <div className="flex flex-row items-center px-[16px] w-[164px] h-full shrink-0 bg-transparent pointer-events-none">
                    <span className="font-normal text-[14px] text-[#8C899F] truncate">{row.author}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 5️⃣ FOOTER & PAGINATION                      */}
      {/* ========================================== */}
      <div className="flex flex-row items-center justify-center px-[32px] h-[56px] border-t border-[#F2F2F8] bg-white shrink-0 mt-auto relative z-[50]">
        
        <div className="absolute left-[32px] flex items-center">
          <span className="font-normal text-[14px] text-[#2B2B40]">Rows <span className="font-bold">1-15</span> of <span className="font-bold">120</span></span>
        </div>
        
        <div className="flex flex-row items-center border border-[#DFDDE7] rounded-[4px] h-[36px] overflow-hidden bg-white shadow-sm">
          <button className="flex items-center justify-center w-[36px] h-full bg-white border-r border-[#DFDDE7] text-[#6B697B] hover:bg-gray-50 transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button className="w-[36px] h-full bg-white text-[#3D3C52] font-normal text-[14px] border-r border-[#DFDDE7] hover:bg-gray-50 transition-colors cursor-pointer">1</button>
          <button className="w-[36px] h-full bg-[#2775C4] text-white font-normal text-[14px] border-r border-[#DFDDE7]">2</button>
          <button className="w-[36px] h-full bg-white text-[#3D3C52] font-normal text-[14px] border-r border-[#DFDDE7] hover:bg-gray-50 transition-colors cursor-pointer">3</button>
          <button className="w-[36px] h-full bg-white text-[#3D3C52] font-normal text-[14px] border-r border-[#DFDDE7] flex justify-center items-center pb-2 cursor-pointer">...</button>
          <button className="w-[36px] h-full bg-white text-[#3D3C52] font-normal text-[14px] border-r border-[#DFDDE7] hover:bg-gray-50 transition-colors cursor-pointer">21</button>
          <button className="flex items-center justify-center w-[36px] h-full bg-white text-[#6B697B] hover:bg-gray-50 transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      {/* MODAL MOUNT NODE */}
      {isShareModalOpen && (
        <ShareModal 
          onClose={() => setIsShareModalOpen(false)} 
          activeVariant={activeVariant} 
          allowEmbed={isEmbedAllowed} 
        />
      )}

    </div>
  );
}

export default function ContentDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-500">Loading Dashboard...</div>}>
      <MainDashboardShell />
    </Suspense>
  );
}
