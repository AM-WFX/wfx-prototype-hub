"use client";

import React, { useState, useEffect } from "react";
import ShareModal from "@/components/ShareModal"; 

export default function DVMPage() {
  // --- 🎛️ VARIANT CONTROLLER ---
  const [activeVariant, setActiveVariant] = React.useState('v1'); // 'v1', 'v2', 'v3'
  
  // --- 📦 CORE STATE ENGINE ---
  const [viewMode, setViewMode] = React.useState("grid"); // 'grid', 'list', 'slides'
  const [activeTab, setActiveTab] = React.useState("steps");
  const [isEditMode, setIsEditMode] = React.useState(false); 
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  
  const isEditActive = activeVariant === 'v1' || isEditMode;

  // Collapse Logic for List View
  const [isAllCollapsed, setIsAllCollapsed] = React.useState(false);
  const [collapsedCards, setCollapsedCards] = React.useState({});
  
  // Dropdown States
  const [openBranchMenuId, setOpenBranchMenuId] = React.useState(null);
  const [openAddMenuId, setOpenAddMenuId] = React.useState(null);
  
  // Modal States
  const [activeModal, setActiveModal] = React.useState(null); // 'expanded', 'delete', 'launch', 'import', 'share'
  const [isReselectMode, setIsReselectMode] = React.useState(false);
  
  // Import Flow State
  const [selectedImportFlow, setSelectedImportFlow] = React.useState(null);

  // V3 Contextual Capture Menu State
  const [captureMenu, setCaptureMenu] = React.useState({ 
    isOpen: false, top: 0, left: 0, title: '', subtitle: '', primaryOptText: '', actionBtnText: '' 
  });
  const [selectedCaptureOption, setSelectedCaptureOption] = React.useState(null);
  const [isTabsAccordionOpen, setIsTabsAccordionOpen] = React.useState(false);

  // Drag and Drop State
  const [draggedCardId, setDraggedCardId] = React.useState(null);

  // Database of Steps
  const [stepCards, setStepCards] = React.useState([
    { id: 1, title: "Click here", image: "/images/Step 1.png", trigger: "On click of selected element", top: 118, left: 94, width: 504, height: 204, tooltipTop: 330, tooltipLeft: 238 },
    { id: 2, title: "Enter Details", image: "/images/Step 2.png", trigger: "On type of form content field", top: 10, left: 250, width: 350, height: 40, tooltipTop: 62, tooltipLeft: 310 },
    { id: 3, title: "Select Option", image: "/images/Step 3.png", trigger: "On click of dropdown element", top: 250, left: 400, width: 120, height: 36, tooltipTop: 298, tooltipLeft: 340 },
    { id: 4, title: "Submit", image: "/images/Step 4.png", trigger: "On click of submit confirmation button", top: 118, left: 20, width: 60, height: 60, tooltipTop: 190, tooltipLeft: 20 }
  ]);

  const [selectedStepId, setSelectedStepId] = React.useState(1);
  const activeStepData = stepCards.find(c => c.id === selectedStepId) || stepCards[0] || {};
  const currentStepIndex = stepCards.findIndex(c => c.id === selectedStepId);

  // Right Panels Property Tabs
  const [rightInspectorTab, setRightInspectorTab] = React.useState("config");

  // Fallback Screenshot Reference
  const defaultScreenshot = "/images/screenshot.png";

  // --- HANDLERS ---
  const markAsChanged = () => setHasUnsavedChanges(true);

  const closeAllMenus = () => {
    setOpenBranchMenuId(null);
    setOpenAddMenuId(null);
    setCaptureMenu(prev => ({ ...prev, isOpen: false }));
  };

  const toggleCollapseAll = () => {
    const newState = !isAllCollapsed;
    setIsAllCollapsed(newState);
    if (newState) {
      const allCollapsed = {};
      stepCards.forEach(c => { allCollapsed[c.id] = true; });
      setCollapsedCards(allCollapsed);
    } else {
      setCollapsedCards({});
    }
  };

  const handleCardCollapse = (e, id) => {
    e.stopPropagation();
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const triggerDelete = (e, id) => {
    e.stopPropagation();
    closeAllMenus();
    setSelectedStepId(id);
    setActiveModal("delete");
  };

  const confirmDelete = () => {
    setStepCards(prev => prev.filter(c => c.id !== selectedStepId));
    setActiveModal(null);
    markAsChanged();
  };

  const createNewStep = () => {
    const nextId = Date.now();
    setStepCards(prev => [...prev, {
      id: nextId, title: `Step ${prev.length + 1}`, image: defaultScreenshot, trigger: "On click of selected element", top: 118, left: 94, width: 504, height: 204, tooltipTop: 330, tooltipLeft: 238
    }]);
    setSelectedStepId(nextId);
    markAsChanged();
  };

  const handleDummyElementClick = (e, box) => {
    if (!isReselectMode) return;
    e.stopPropagation();
    setStepCards(prev => prev.map(card => {
      if (card.id === selectedStepId) {
        return { 
          ...card, 
          top: box.top, left: box.left, width: box.width, height: box.height,
          tooltipTop: box.top + box.height + 12,
          tooltipLeft: box.left + (box.width / 2) - 130
        };
      }
      return card;
    }));
    setIsReselectMode(false);
    markAsChanged();
  };

  const executeImportSplicing = () => {
    setActiveModal(null);
    setSelectedImportFlow(null);
    markAsChanged();
  };

  const openLaunchMenu = (e, actionName, context = 'main', stepNum = null) => {
    e.stopPropagation();
    closeAllMenus();
    setIsTabsAccordionOpen(false);

    if (activeVariant !== 'v3') {
      setActiveModal("launch");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.left;

    if (left + 320 > window.innerWidth) left = rect.left - 320 - 8;
    if (top + 400 > window.innerHeight) top = window.innerHeight - 420;

    let title = stepNum ? `${actionName} (Step ${stepNum})` : actionName;
    let primaryOptText = "Step URL";
    let subtitle = "All newly captured steps will be inserted into this flow. Capture will begin at the URL of the selected option.";

    if (context === 'main') {
      primaryOptText = "Flow Source URL";
    } else if (context === 'reselect') {
      primaryOptText = stepNum ? `Step ${stepNum} URL` : "Step URL";
      subtitle = "Choose starting point to reselect the element.";
    } else if (stepNum) {
      primaryOptText = `Step ${stepNum} URL`;
      if (actionName === 'Add step before') subtitle = `Choose starting point to add step before Step ${stepNum}.`;
      else if (actionName === 'Add step after') subtitle = `Choose starting point to add step after Step ${stepNum}.`;
      else if (actionName === 'Add new flow') subtitle = "Choose starting point to add a new branch to this flow.";
      else if (actionName === 'Add steps') subtitle = `Choose starting point to insert new steps.`;
    }

    setCaptureMenu({
      isOpen: true, top, left, title, subtitle, primaryOptText, actionBtnText: actionName
    });
    setSelectedCaptureOption(null);
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    
    const cardElement = document.getElementById(`step-card-${id}`);
    if (cardElement) {
      e.dataTransfer.setDragImage(cardElement, 20, 20);
    }
    
    setTimeout(() => setDraggedCardId(id), 0);
  };
  
  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    if (!draggedCardId || draggedCardId === targetId) return;

    const draggedIndex = stepCards.findIndex(c => c.id === draggedCardId);
    const targetIndex = stepCards.findIndex(c => c.id === targetId);

    const newCards = [...stepCards];
    const [removed] = newCards.splice(draggedIndex, 1);
    newCards.splice(targetIndex, 0, removed);
    setStepCards(newCards);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    markAsChanged();
  };

  const RightPanelContent = () => (
    <div className={`w-[340px] bg-white h-full border-l border-[#e5e7eb] flex flex-col shrink-0 z-10 ${!isEditActive ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="p-4 border-b border-[#e5e7eb] w-full">
        <div className="flex w-full h-[40px] border border-[#d7d6d1] rounded-[4px] bg-white shadow-sm overflow-hidden">
          <button onClick={(e) => {
            if (activeVariant === 'v1' || activeVariant === 'v2') {
              setActiveModal("launch");
            } else {
              setIsReselectMode(!isReselectMode);
              if (!isReselectMode) {
                openLaunchMenu(e, 'Reselect Element', 'reselect', currentStepIndex + 1);
              }
            }
          }} className={`flex-1 flex items-center justify-center gap-1.5 transition-colors focus:z-10 relative text-[12px] font-semibold whitespace-nowrap px-2 ${isReselectMode ? "bg-orange-50 text-[#d45f00]" : "text-[#3d3c52] hover:bg-gray-50"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5"></path></svg> Reselect Element
          </button>
          <div className="w-px bg-[#d7d6d1] h-full shrink-0"></div>
          <button className="flex-1 flex items-center justify-center gap-1.5 text-[#3d3c52] text-[12px] font-semibold hover:bg-gray-50 transition-colors focus:z-10 relative whitespace-nowrap px-2">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="8"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="2" y1="12" x2="4" y2="12"></line></svg> Element Precision
          </button>
        </div>
      </div>
      
      <div className="flex border-b border-[#e5e7eb] h-[48px] w-full px-4 justify-start">
        {["config", "visibility", "css"].map(tab => (
          <button key={tab} onClick={() => setRightInspectorTab(tab)} className={`h-full flex-1 flex items-center justify-center font-bold text-[13px] capitalize transition-colors ${rightInspectorTab === tab ? "text-[#d13B1A] border-b-2 border-[#d13B1A]" : "text-gray-400 hover:text-gray-600 border-b-2 border-transparent"}`}>
            {tab === "config" ? "Configurations" : tab === "visibility" ? "Visibility Rules" : "CSS"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {rightInspectorTab === "config" && (
          <div className="border border-[#e5e7eb] rounded-lg bg-white overflow-hidden shadow-xs">
            <div className="h-[48px] px-4 flex items-center justify-between bg-gray-50/50 border-b border-[#e5e7eb] cursor-pointer">
              <span className="font-semibold text-[#1f1f32]">Appearance</span>
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[#3d3c52]">Step Type</label>
                <div className="h-[40px] border border-[#d7d6d1] rounded px-3 flex items-center justify-between cursor-pointer hover:border-gray-400">
                  <span className="text-[13px] text-[#1f1f32]">Attached to element</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              {/* Static Tooltip Preview */}
              <div className="w-full flex flex-col pt-2 pb-2">
                <div className="w-full bg-[#f4f5f8] rounded-lg p-6 flex items-center justify-center relative overflow-hidden mb-3">
                  <div className="relative w-[210px] bg-[#19265d] rounded-md shadow-lg flex flex-col text-white z-10 pointer-events-none">
                    <div className="absolute -top-[6px] left-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#19265d]"></div>
                    <div className="flex justify-between items-center px-2.5 py-2 text-[10px] font-bold">
                      <span>2/5</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 6l-12 12M6 6l12 12"></path></svg>
                    </div>
                    <div className="px-2.5 pb-1.5 space-y-0.5">
                      <h4 className="font-bold text-[13px] leading-tight">Description part of the tip</h4>
                      <p className="text-[11px] text-white/80 leading-tight">Optional note section</p>
                    </div>
                    <div className="px-2.5 py-1.5 flex justify-between items-center text-[12px] font-bold">
                      <span className="opacity-80 font-normal">← Back</span>
                      <span>Next →</span>
                    </div>
                    <div className="px-2.5 pb-2 pt-1 text-[9px] uppercase tracking-wider opacity-60">Flow Name</div>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full px-1">
                  <span className="text-[13px] font-bold text-[#1f1f32]">Modern</span>
                  <span className="text-[13px] font-bold text-[#0975d7] cursor-pointer hover:underline">Change</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#3d3c52]">Color</label>
                  <div className="h-[36px] w-[50px] border border-[#d7d6d1] rounded bg-[#3b5999] cursor-pointer" onClick={markAsChanged}></div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#3d3c52]">Close (X) color</label>
                  <div className="h-[36px] w-[50px] border border-[#d7d6d1] rounded bg-white cursor-pointer" onClick={markAsChanged}></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[13px] font-medium text-[#3d3c52]">Show back button</span>
                <input type="checkbox" className="wfx-switch" defaultChecked onChange={markAsChanged} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`absolute inset-0 flex flex-col min-w-0 bg-[#f6f6f9] overflow-hidden select-none ${!isEditActive ? 'view-mode' : ''}`} onClick={closeAllMenus}>
      
      {/* --- 🎛️ MINIFIED VARIANT TOGGLE (Hidden when Modals Open, Invisible until hovered hitbox) --- */}
      <div className={`absolute top-0 right-0 p-6 z-[50] opacity-0 hover:opacity-100 transition-opacity duration-300 ${activeModal ? 'hidden' : 'block'}`}>
        <div className="flex items-center gap-0.5 bg-white border border-[#dfdde7] rounded-md p-1 shadow-xs scale-90 origin-top-right">
          {['v1', 'v2', 'v3'].map(v => (
            <label key={v} className={`flex items-center px-2 py-1 rounded cursor-pointer text-[11px] font-bold uppercase transition-all ${activeVariant === v ? 'bg-blue-50 text-[#0975d7]' : 'text-[#6b697b] hover:bg-gray-50'}`}>
              <input type="radio" name="variant" checked={activeVariant === v} onChange={() => setActiveVariant(v)} className="hidden" />
              {v}
            </label>
          ))}
        </div>
      </div>

      {/* ================= HEADER ================= */}
      <div id="dvm-header" className="bg-white shrink-0 shadow-sm z-10 flex flex-col h-auto">
        <div className="px-6 pt-4 pb-2 flex flex-col">
          <div className="dvm-breadcrumbs flex items-center gap-2 text-[13px] mb-3 text-[#6b697b]">
            <a href="#" className="hover:text-[#1f1f32] font-medium transition-colors">All Content</a>
            <span className="text-[#d7d6d1]">/</span>
            <span className="text-[#1f1f32] font-medium">Test Flow 1</span>
            <span className={`ml-2 px-2.5 py-[2px] rounded-full text-[11px] font-semibold tracking-wide ${isEditActive ? 'bg-blue-50 text-[#0975d7] border border-blue-100' : 'bg-[#f2f2f8] text-[#3d3c52] border border-[#e5e7eb]'}`}>
              {isEditActive ? "Editing" : "Viewing"}
            </span>
          </div>
          
          <div className="dvm-title-area flex items-center justify-between min-h-[46px]">
            <div className="flex items-center gap-2.5">
              <svg className="icon icon-tabler icon-tabler-directions" width="24" height="24" viewBox="0 0 24 24" stroke="#6b697b" strokeWidth="2" fill="none"><path d="M12 21v-4"></path><path d="M12 13v-4"></path><path d="M12 5v-2"></path><path d="M10 21h4"></path><path d="M8 5v4h11l2 -2l-2 -2z"></path><path d="M14 13v4h-8l-2 -2l2 -2z"></path></svg>
              <h2 className="text-[20px] font-bold text-[#1f1f32]">Test Flow 1</h2>
            </div>

            <div className="dvm-header-actions flex items-center justify-end gap-2.5 min-h-[46px]">
              
              {/* V1 Header Actions (Edit Active always) */}
              {activeVariant === 'v1' && (
                <>
                  <button onClick={() => setActiveModal("share")} className="h-[46px] px-3 bg-transparent text-[#3d3c52] text-[14px] font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors rounded-[4px]">
                    <img src="/icons/Share icon.svg" alt="Share" className="w-[18px] h-[18px]" /> Share
                  </button>
                  <button className="h-[46px] px-4 bg-white border border-[#0975d7] text-[#0975d7] rounded-[4px] text-[14px] font-medium flex items-center gap-1.5 hover:bg-blue-50 transition-colors">
                    <svg className="icon icon-tabler icon-tabler-sparkles" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"></path></svg> Enhance ▾
                  </button>
                  <button className="h-[46px] px-4 bg-white border border-[#d7d6d1] text-[#3d3c52] rounded-[4px] text-[14px] font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                    <svg className="icon icon-tabler icon-tabler-eye" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="2"></circle><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"></path></svg> Preview ▾
                  </button>
                  <button onClick={(e) => openLaunchMenu(e, 'Launch Live Edit', 'main')} className="h-[46px] px-4 bg-white border border-[#dfdde7] text-[#2b2b40] text-[14px] font-medium rounded-[4px] hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5 w-fit">
                    Launch live edit 
                    <svg className="icon icon-tabler icon-tabler-external-link" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"></path><line x1="10" y1="14" x2="20" y2="4"></line><polyline points="15 4 20 4 20 9"></polyline></svg>
                  </button>
                  <button className="h-[46px] px-3 bg-white border border-[#d7d6d1] text-[#3d3c52] rounded-[4px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <svg className="icon icon-tabler icon-tabler-dots-vertical" width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="12" cy="5" r="1"></circle></svg>
                  </button>
                </>
              )}

              {/* V2/V3 VIEW MODE Header Actions (Includes Share + Flow ID logic) */}
              {!isEditMode && activeVariant !== 'v1' && (
                <>
                  <button onClick={() => setActiveModal("share")} className="h-[36px] px-3 bg-transparent text-[#3d3c52] text-[14px] font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors rounded-[4px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    Share
                  </button>
                  <button className="h-[36px] px-3 bg-transparent text-[#3d3c52] text-[14px] font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors rounded-[4px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path></svg>
                    Flow ID
                  </button>
                  <div className="flex border border-[#dfdde7] rounded-[4px] overflow-hidden h-[36px] ml-1">
                    <button className="px-4 bg-white text-[#3d3c52] text-[14px] font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors border-r border-[#dfdde7]">
                      Preview
                    </button>
                    <button className="px-2 bg-white text-[#3d3c52] hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6l6 -6"></path></svg>
                    </button>
                  </div>
                  <button className="h-[36px] w-[36px] bg-transparent text-[#3d3c52] flex items-center justify-center hover:bg-gray-50 transition-colors rounded-[4px] ml-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                  </button>
                </>
              )}

              {/* V2/V3 EDIT MODE Header Actions (No Share logic) */}
              {isEditMode && activeVariant !== 'v1' && (
                 <>
                   <button className="h-[36px] px-4 bg-white border border-[#0975d7] text-[#0975d7] rounded-[4px] text-[14px] font-medium flex items-center gap-1.5 hover:bg-blue-50 transition-colors">
                     <svg className="icon icon-tabler icon-tabler-sparkles" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"></path></svg> Enhance ▾
                   </button>
                   <button className="h-[36px] px-4 bg-white border border-[#d7d6d1] text-[#3d3c52] rounded-[4px] text-[14px] font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                     <svg className="icon icon-tabler icon-tabler-eye" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="2"></circle><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"></path></svg> Preview ▾
                   </button>
                   <button onClick={(e) => openLaunchMenu(e, 'Launch Live Edit', 'main')} className="h-[36px] px-4 bg-white border border-[#dfdde7] text-[#2b2b40] text-[14px] font-medium rounded-[4px] hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5 w-fit">
                     Launch live edit 
                     <svg className="icon icon-tabler icon-tabler-external-link" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"></path><line x1="10" y1="14" x2="20" y2="4"></line><polyline points="15 4 20 4 20 9"></polyline></svg>
                   </button>
                   <button className="h-[36px] px-3 bg-white border border-[#d7d6d1] text-[#3d3c52] rounded-[4px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                     <svg className="icon icon-tabler icon-tabler-dots-vertical" width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="12" cy="5" r="1"></circle></svg>
                   </button>
                 </>
              )}
            </div>
          </div>

          <div className="dvm-tabs inline-flex gap-6 h-[48px] px-6 mb-1">
            <button onClick={() => setActiveTab("steps")} className={`tab-item relative flex items-center h-full font-semibold transition-all ${activeTab === "steps" ? "text-[#c74900] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-full after:h-[4px] after:bg-[#c74900] after:rounded-t-[4px]" : "text-[#6b697b] hover:text-[#1f1f32]"}`}>Steps</button>
            <button onClick={() => setActiveTab("details")} className={`tab-item flex items-center h-full font-medium transition-all ${activeTab === "details" ? "text-[#c74900] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-full after:h-[4px] after:bg-[#c74900] after:rounded-t-[4px]" : "text-[#6b697b] hover:text-[#1f1f32]"}`}>Details</button>
          </div>
        </div>
      </div>

      {/* ================= TOOLBAR ================= */}
      <div className="w-full border-b border-[#e5e7eb] bg-[#f6f6f9] shrink-0">
        <div id="dvm-toolbar" className={`flex items-center justify-between py-4 mx-auto w-full transition-all duration-300 ${viewMode === 'list' ? 'max-w-[620px]' : viewMode === 'grid' ? 'max-w-[1200px]' : 'max-w-full px-6'}`}>
          <div className="flex items-center gap-3">
            <h3 id="total-steps-count" className="font-bold text-[#1f1f32] text-[16px]">{stepCards.length} Steps</h3>
            {viewMode === "list" && (
              <button id="btn-toggle-collapse" onClick={toggleCollapseAll} className="flex items-center gap-1 text-[#0975d7] font-semibold text-[13px] hover:bg-blue-50/50 px-2 py-1 rounded transition-colors ml-2">
                <span id="collapse-text">{isAllCollapsed ? "Expand all" : "Collapse all"}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d={isAllCollapsed ? "M6 9l6 6l6 -6" : "M6 15l6 -6l6 6"}></path></svg>
              </button>
            )}
          </div>
          <div className="flex gap-1 bg-white border border-[#dfdde7] rounded-[4px] p-[2px] shadow-sm">
            <button id="btn-view-grid" onClick={() => setViewMode('grid')} className={`p-1.5 rounded-[2px] transition-colors ${viewMode === "grid" ? "bg-blue-50 text-[#0975d7]" : "text-[#6b697b] hover:text-[#1f1f32]"}`} title="Grid View">
              <svg className="icon icon-tabler icon-tabler-layout-grid" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="4" y="4" width="6" height="6" rx="1"></rect><rect x="14" y="4" width="6" height="6" rx="1"></rect><rect x="4" y="14" width="6" height="6" rx="1"></rect><rect x="14" y="14" width="6" height="6" rx="1"></rect></svg>
            </button>
            <button id="btn-view-list" onClick={() => setViewMode('list')} className={`p-1.5 rounded-[2px] transition-colors ${viewMode === "list" ? "bg-blue-50 text-[#0975d7]" : "text-[#6b697b] hover:text-[#1f1f32]"}`} title="List View">
              <svg className="icon icon-tabler icon-tabler-layout-list" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="4" y="4" width="16" height="6" rx="2"></rect><rect x="4" y="14" width="16" height="6" rx="2"></rect></svg>
            </button>
            <button onClick={() => setViewMode('slides')} className={`p-1.5 rounded-[2px] transition-colors ${viewMode === "slides" ? "bg-blue-50 text-[#0975d7]" : "text-[#6b697b] hover:text-[#1f1f32]"}`} title="Storyboard View">
              <svg className="icon icon-tabler icon-tabler-slideshow" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="15" y1="6" x2="15" y2="22"></line><line x1="9" y1="6" x2="9" y2="22"></line><rect x="4" y="6" width="16" height="12" rx="1"></rect></svg>
            </button>
            <button className="p-1.5 text-[#6b697b] hover:text-[#1f1f32] rounded-[2px] transition-colors" title="Full Screen">
              <svg className="icon icon-tabler icon-tabler-arrows-diagonal" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="16 4 20 4 20 8"></polyline><line x1="14" y1="10" x2="20" y2="4"></line><polyline points="8 20 4 20 4 16"></polyline><line x1="4" y1="20" x2="10" y2="14"></line></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN CANVASES ================= */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        
        {viewMode !== "slides" ? (
          /* 📐 STANDARD GRID AND LIST COMPONENT VIEWPORTS */
          <div id="dvm-canvas" 
               className="flex-1 overflow-y-auto custom-scrollbar p-6 min-h-0"
               onDragOver={(e) => e.preventDefault()}
               onDrop={(e) => { e.preventDefault(); handleDragEnd(); }}>
            <div id="dvm-grid-container" className={`mx-auto transition-all duration-300 ${viewMode === "grid" ? "grid grid-cols-[repeat(auto-fill,368px)] gap-x-[48px] gap-y-[36px] justify-start max-w-[1200px]" : "flex flex-col items-center gap-y-[20px] w-full max-w-[620px]"}`}>
              
              {stepCards.map((card, index) => {
                const isCollapsed = viewMode === "list" && collapsedCards[card.id];
                const isMenuOpen = (openAddMenuId && openAddMenuId.includes(`${card.id}`)) || (openBranchMenuId && openBranchMenuId.includes(`branch-${card.id}`));
                
                return (
                  <div key={card.id} id={`step-card-${card.id}`}
                    className={`step-card-wrapper group/step relative transition-all duration-200 ${isMenuOpen ? "z-[100]" : "z-10"} ${viewMode === "grid" ? "w-[368px] h-[322px]" : `w-[620px] ${isCollapsed ? "h-[68px]" : "h-[514px]"}`}`}
                    onDragOver={(e) => handleDragOver(e, card.id)}
                    onDrop={(e) => { e.preventDefault(); handleDragEnd(); }}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Dashed placeholder overlay when dragging */}
                    <div className={`absolute inset-0 z-0 border-2 border-dashed border-[#0975d7] bg-blue-50/20 rounded-lg pointer-events-none transition-opacity duration-200 ${card.id === draggedCardId ? 'opacity-100' : 'opacity-0'}`}></div>

                    <div onClick={() => { setSelectedStepId(card.id); setActiveModal("expanded"); }} className={`step-card-inner w-full h-full bg-white border rounded-lg shadow-sm flex flex-col hover:border-[#d7d6d1] transition-opacity duration-200 cursor-pointer ${card.id === draggedCardId ? "opacity-0" : "opacity-100 border-[#e5e7eb]"}`}>
                      <div className={`card-header px-3 flex items-center justify-between bg-white transition-all ${isCollapsed ? "h-[68px] border-b-transparent rounded-lg" : "h-[48px] border-b border-[#f2f2f8]"}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 truncate">
                          {isEditActive && (
                            <div className="drag-handle cursor-grab active:cursor-grabbing text-[#d7d6d1]" draggable onDragStart={(e) => handleDragStart(e, card.id)} onDragEnd={handleDragEnd}>
                              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
                            </div>
                          )}
                          <span className="step-number-badge w-[28px] h-[28px] flex items-center justify-center bg-[#f6f6f9] text-[#3d3c52] text-[11px] font-semibold rounded-full border border-[#dfdde7]">{index + 1}</span>
                          <span className="font-bold text-[#3d3c52] text-[18px] font-['Inter'] truncate">{card.title}</span>
                        </div>
                        {viewMode === "list" && (
                          <div className="list-collapse-toggle items-center">
                            <button className="p-1.5 text-[#6b697b] hover:bg-gray-100 rounded transition-colors" onClick={(e) => handleCardCollapse(e, card.id)}>
                              <svg className={`icon-chevron transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 15l-6 -6l-6 6"></path></svg>
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {!isCollapsed && (
                        <div className="card-preview collapsible-section flex-1 bg-[#fcfcfd] p-4 flex items-center justify-center border-b border-[#f2f2f8]">
                          <div className="w-full h-full bg-white border border-[#e5e7eb] shadow-sm rounded flex items-center justify-center overflow-hidden relative">
                            <div className="absolute inset-0 bg-[length:100%_100%] bg-no-repeat bg-center" style={{ backgroundImage: `url("${card.image || defaultScreenshot}")` }}></div>
                          </div>
                        </div>
                      )}
                      
                      <div className={`card-footer px-3 flex items-center justify-between bg-white ${isCollapsed ? "absolute top-0 right-10 h-[68px] bg-transparent" : "h-[48px] rounded-b-lg"}`} onClick={(e) => e.stopPropagation()}>
                        {!isCollapsed && <span className="text-[12px] font-['Inter'] text-[#6b697b] step-completion-text truncate pr-2">{card.trigger}</span>}
                        <div className="flex items-center gap-1.5 text-[#6b697b]">
                          {isEditActive && (
                            <>
                              {/* Inner Plus Button - Appears inside the footer in V2 and V3 only */}
                              {activeVariant !== 'v1' && (
                                <div className="relative flex items-center justify-center">
                                  <button className="p-1 hover:bg-gray-50 rounded transition-colors" onClick={(e) => { e.stopPropagation(); setOpenAddMenuId(openAddMenuId === `inner-${card.id}` ? null : `inner-${card.id}`); setSelectedStepId(card.id); }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                  </button>
                                  {openAddMenuId === `inner-${card.id}` && (
                                    <ul className="add-step-dropdown absolute top-[calc(100%+4px)] right-0 w-[180px] bg-white shadow-lg border border-[#e5e7eb] rounded-[6px] py-1.5 flex flex-col z-50">
                                      <li onClick={(e) => openLaunchMenu(e, 'Add step before', 'step', index + 1)} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium">Add step before</li>
                                      <li onClick={(e) => openLaunchMenu(e, 'Add step after', 'step', index + 1)} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium">Add step after</li>
                                      <li onClick={() => { closeAllMenus(); setActiveModal("import"); }} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium">Copy steps before</li>
                                      <li onClick={() => { closeAllMenus(); setActiveModal("import"); }} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium">Copy steps after</li>
                                    </ul>
                                  )}
                                </div>
                              )}
                              <div className="relative flex items-center justify-center">
                                <button className="p-1 hover:bg-gray-50 rounded transition-colors" onClick={(e) => { e.stopPropagation(); setOpenBranchMenuId(openBranchMenuId === `branch-${card.id}` ? null : `branch-${card.id}`); setSelectedStepId(card.id); }}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="7" cy="18" r="2"></circle><circle cx="7" cy="6" r="2"></circle><circle cx="17" cy="6" r="2"></circle><line x1="7" y1="8" x2="7" y2="16"></line><path d="M9 18h6a2 2 0 0 0 2 -2v-5"></path><polyline points="14 14 17 11 20 14"></polyline></svg>
                                </button>
                                {openBranchMenuId === `branch-${card.id}` && (
                                  <ul className="branch-dropdown absolute top-[calc(100%+4px)] right-0 w-[180px] bg-white shadow-lg border border-[#e5e7eb] rounded-[6px] py-1.5 flex flex-col z-50">
                                    <li onClick={(e) => openLaunchMenu(e, 'Add new flow', 'step', index + 1)} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium flex items-center gap-2">
                                      <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add new flow
                                    </li>
                                    <li onClick={() => { closeAllMenus(); setActiveModal("import"); }} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium flex items-center gap-2">
                                      <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path><polyline points="7 9 12 4 17 9"></polyline><line x1="12" y1="4" x2="12" y2="16"></line></svg> Import existing flow
                                    </li>
                                  </ul>
                                )}
                              </div>
                              <button className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors" onClick={(e) => triggerDelete(e, card.id)} title="Delete Step">
                                <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Add Step Button Outside inner block - V1 ONLY */}
                    {activeVariant === 'v1' && (
                      <div className={`absolute z-30 flex flex-col items-center ${viewMode === "grid" ? "top-1/2 right-[-24px] translate-x-1/2 -translate-y-1/2" : "left-1/2 bottom-[-32px] -translate-x-1/2 translate-y-1/2"}`}>
                        <button onClick={(e) => { e.stopPropagation(); setOpenAddMenuId(openAddMenuId === `outer-${card.id}` ? null : `outer-${card.id}`); setSelectedStepId(card.id); }} className="w-6 h-6 bg-[#f0f0f4] text-[#a1a0ab] rounded-full flex items-center justify-center hover:bg-blue-50 hover:text-[#0975d7] transition-colors relative shadow-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        {openAddMenuId === `outer-${card.id}` && (
                          <ul className="add-step-dropdown absolute w-[160px] bg-white shadow-lg border border-[#e5e7eb] rounded-[6px] py-1.5 flex flex-col z-50 top-8">
                            <li onClick={(e) => openLaunchMenu(e, 'Add step before', 'step', index + 1)} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add steps
                            </li>
                            <li onClick={() => { closeAllMenus(); setActiveModal("import"); }} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path><polyline points="7 9 12 4 17 9"></polyline><line x1="12" y1="4" x2="12" y2="16"></line></svg> Import steps
                            </li>
                          </ul>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
              
              <div className={viewMode === "grid" ? "w-[368px] h-[322px] relative" : "w-[620px] h-[70px] relative"}>
                <div className={`end-message-inner w-full h-full bg-white border border-[#e5e7eb] rounded-lg shadow-sm flex ${viewMode === "grid" ? "flex-col justify-center" : "flex-row justify-center px-5"} items-center gap-3 cursor-pointer hover:border-[#d1d5db] hover:shadow transition-all group`}>
                  <div className="w-10 h-10 rounded-full bg-[#f6f6f9] text-[#6b697b] flex items-center justify-center group-hover:bg-[#f0f0f4] transition-colors shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M5 14h14v-9h-14v16"></path></svg>
                  </div>
                  <div className="flex flex-col text-center">
                    <h4 className="font-bold text-[#3d3c52] text-[14px]">End Message</h4>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* 🎞️ IMMERSIVE PRESENTATION STORYBOARD VIEW ENGINE         */
          /* ======================================================== */
          <div className="flex-1 flex overflow-hidden w-full bg-white">
            
            {/* Left Thumbnails List Column */}
            <div className="w-[220px] bg-[#f8f9fa] h-full border-r border-[#e5e7eb] flex flex-col overflow-y-auto px-4 py-2 custom-scrollbar shrink-0"
                 onDragOver={(e) => e.preventDefault()}
                 onDrop={(e) => { e.preventDefault(); handleDragEnd(); }}>
              {stepCards.map((card, index) => {
                const isActive = selectedStepId === card.id;
                const isMenuBeforeOpen = openAddMenuId === `story-before-${card.id}`;
                const isMenuAfterOpen = openAddMenuId === `story-after-${card.id}`;

                return (
                  <React.Fragment key={card.id}>
                    {/* Persistent Inline Plus Above Card (All Variants) */}
                    {isEditActive && (
                      <div className={`flex justify-center py-2 relative opacity-100 ${isMenuBeforeOpen ? "z-[100]" : "z-10"}`}>
                        <button onClick={(e) => { e.stopPropagation(); setOpenAddMenuId(isMenuBeforeOpen ? null : `story-before-${card.id}`); }} className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors shadow-sm relative z-10 ${isMenuBeforeOpen ? "bg-blue-50 border-[#0975d7] text-[#0975d7]" : "bg-white text-[#a1a0ab] border-[#d7d6d1] hover:bg-blue-50 hover:border-[#0975d7] hover:text-[#0975d7]"}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>

                        {isMenuBeforeOpen && (
                          <ul className="add-step-dropdown absolute top-[calc(50%+14px)] left-1/2 -translate-x-1/2 w-[160px] bg-white shadow-lg border border-[#e5e7eb] rounded-[6px] py-1.5 flex flex-col z-50">
                            <li onClick={(e) => openLaunchMenu(e, 'Add steps', 'step', index + 1)} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add steps
                            </li>
                            <li onClick={() => { closeAllMenus(); setActiveModal("import"); }} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path><polyline points="7 9 12 4 17 9"></polyline><line x1="12" y1="4" x2="12" y2="16"></line></svg> Copy steps
                            </li>
                          </ul>
                        )}
                      </div>
                    )}

                    <div 
                      id={`step-card-${card.id}`}
                      className={`shrink-0 relative w-full h-[130px] rounded-lg transition-all flex flex-col ${!isEditActive && index !== stepCards.length - 1 ? 'mb-4' : ''}`}
                      onDragOver={(e) => handleDragOver(e, card.id)}
                      onDrop={(e) => { e.preventDefault(); handleDragEnd(); }}
                      onDragEnd={handleDragEnd}
                    >
                      {/* Dashed placeholder overlay when dragging */}
                      <div className={`absolute inset-0 z-0 border-2 border-dashed border-[#0975d7] bg-blue-50/20 rounded-lg pointer-events-none transition-opacity duration-200 ${card.id === draggedCardId ? 'opacity-100' : 'opacity-0'}`}></div>

                      <div 
                        onClick={() => setSelectedStepId(card.id)} 
                        className={`w-full h-full border shadow-xs transition-opacity duration-200 p-2 flex flex-col group cursor-pointer rounded-lg ${isActive ? "bg-white border-[#c74900] ring-2 ring-[#c74900]/10" : "bg-white border-[#e5e7eb] hover:border-gray-300"} ${card.id === draggedCardId ? 'opacity-0' : 'opacity-100'}`}
                      >
                        <div className="flex items-center justify-between mb-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5 truncate">
                            {isEditActive && (
                              <div className="drag-handle cursor-grab active:cursor-grabbing text-[#6b697b] mr-1" draggable onDragStart={(e) => handleDragStart(e, card.id)} onDragEnd={handleDragEnd}>
                                <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="9" cy="5" r="2"></circle><circle cx="9" cy="12" r="2"></circle><circle cx="9" cy="19" r="2"></circle><circle cx="15" cy="5" r="2"></circle><circle cx="15" cy="12" r="2"></circle><circle cx="15" cy="19" r="2"></circle></svg>
                              </div>
                            )}
                            <span className={`w-4 h-4 flex items-center justify-center rounded-full border text-[10px] font-bold ${isActive ? "bg-[#c74900] border-[#c74900] text-white" : "bg-gray-100 border-[#e5e7eb] text-gray-600"}`}>{index + 1}</span>
                            <span className="font-bold text-gray-700 text-[11px] truncate">{card.title}</span>
                          </div>
                          <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${!isEditActive ? 'hidden' : ''}`}>
                            <button className="p-0.5 hover:bg-gray-100 rounded text-gray-500 relative" onClick={(e) => { e.stopPropagation(); setOpenBranchMenuId(openBranchMenuId === `story-branch-${card.id}` ? null : `story-branch-${card.id}`); }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="7" cy="18" r="2"></circle><circle cx="7" cy="6" r="2"></circle><circle cx="17" cy="6" r="2"></circle><line x1="7" y1="8" x2="7" y2="16"></line><path d="M9 18h6a2 2 0 0 0 2 -2v-5"></path><polyline points="14 14 17 11 20 14"></polyline></svg>
                              {openBranchMenuId === `story-branch-${card.id}` && (
                                <ul className="branch-dropdown absolute top-full right-0 mt-1 w-[180px] bg-white shadow-lg border border-[#e5e7eb] rounded-[6px] py-1.5 flex flex-col z-50">
                                  <li onClick={(e) => openLaunchMenu(e, 'Add new flow', 'step', index + 1)} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add new flow
                                  </li>
                                  <li onClick={() => { closeAllMenus(); setActiveModal("import"); }} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path><polyline points="7 9 12 4 17 9"></polyline><line x1="12" y1="4" x2="12" y2="16"></line></svg> Import existing flow
                                  </li>
                                </ul>
                              )}
                            </button>
                            <button className="p-0.5 hover:bg-gray-100 rounded text-gray-500" onClick={(e) => triggerDelete(e, card.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 7l16 0M10 11l0 6M14 11l0 6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 rounded border border-[#e5e7eb] bg-[length:100%_100%] bg-no-repeat bg-center relative overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: `url("${card.image || defaultScreenshot}")` }}>
                        </div>
                      </div>
                    </div>

                    {/* Persistent Inline Plus Below LAST Card (All Variants) */}
                    {index === stepCards.length - 1 && isEditActive && (
                      <div className={`flex justify-center py-2 relative opacity-100 ${isMenuAfterOpen ? "z-[100]" : "z-10"}`}
                           onDragOver={(e) => handleDragOver(e, card.id)}>
                        <button onClick={(e) => { e.stopPropagation(); setOpenAddMenuId(isMenuAfterOpen ? null : `story-after-${card.id}`); }} className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors shadow-sm relative z-10 ${isMenuAfterOpen ? "bg-blue-50 border-[#0975d7] text-[#0975d7]" : "bg-white text-[#a1a0ab] border-[#d7d6d1] hover:bg-blue-50 hover:border-[#0975d7] hover:text-[#0975d7]"}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        
                        {isMenuAfterOpen && (
                          <ul className="add-step-dropdown absolute top-[calc(50%+14px)] left-1/2 -translate-x-1/2 w-[160px] bg-white shadow-lg border border-[#e5e7eb] rounded-[6px] py-1.5 flex flex-col z-50">
                            <li onClick={(e) => openLaunchMenu(e, 'Add steps', 'step', index + 2)} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add steps
                            </li>
                            <li onClick={() => { closeAllMenus(); setActiveModal("import"); }} className="w-full text-left px-3 py-2 text-[13px] text-[#3d3c52] hover:bg-[#f9fafb] cursor-pointer transition-colors font-medium flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path><polyline points="7 9 12 4 17 9"></polyline><line x1="12" y1="4" x2="12" y2="16"></line></svg> Copy steps
                            </li>
                          </ul>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            
            {/* Center Visual Authoring Stage Viewport */}
            <div className="flex-1 bg-[#eef1f6] flex items-center justify-center overflow-auto relative p-6">
              <div id="modal-screenshot-container" className={`relative shadow-2xl border border-gray-300 rounded-md overflow-hidden bg-white shrink-0`} style={{ aspectRatio: '3024 / 1650', height: '100%', maxWidth: '100%', backgroundImage: `url("${activeStepData.image || defaultScreenshot}")`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
              </div>
            </div>

            {/* Exactly Duplicated Right Properties Panel */}
            <RightPanelContent />

          </div>
        )}
      </div>

      {/* --- FOOTER ACTION COMPONENT --- */}
      <div style={{ display: 'flex' }} className="navi-modal-footer navi-modal-footer-small px-6 py-4 bg-white border-t border-[#e5e7eb] shrink-0 justify-between items-center z-10 relative">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          {isEditActive && activeVariant !== 'v1' && (
            <button onClick={() => setIsEditMode(false)} className="navi-button-root flex items-center gap-2 text-[#3d3c52] font-semibold hover:bg-gray-50 px-4 py-2 rounded transition-colors">
              <span className="navi-button-label flex items-center gap-2">
                <span className="navi-button-label-start">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12C19 12.5523 18.5523 13 18 13H8.415L11.7071 16.2929C12.0676 16.6534 12.0953 17.2206 11.7903 17.6129L11.7071 17.7071C11.3466 18.0676 10.7794 18.0953 10.3871 17.7903L10.2929 17.7071L5.29289 12.7071L5.2515 12.6631L5.19633 12.5953L5.12467 12.4841L5.07123 12.3713L5.03585 12.266L5.00683 12.1175L5 12L5.00279 11.9248L5.02024 11.7993L5.04974 11.6879L5.09367 11.5768L5.146 11.4793L5.21279 11.3832C5.23767 11.3515 5.26443 11.3214 5.29289 11.2929L10.2929 6.29289C10.6834 5.90237 11.3166 5.90237 11.7071 6.29289C12.0676 6.65338 12.0953 7.22061 11.7903 7.6129L11.7071 7.70711L8.415 11H18C18.5523 11 19 11.4477 19 12Z"></path></svg>
                </span>Back to view mode
              </span>
            </button>
          )}
        </div>
        <div style={{ display: 'flex' }} className="navi-modal-footer-cta-layout gap-3">
          {isEditActive ? (
            <>
              <button disabled={!hasUnsavedChanges} onClick={() => setHasUnsavedChanges(false)} className="box-border h-[44px] px-[15px] py-[11px] border border-[#dfdde7] bg-white text-[#3d3c52] text-[14px] font-semibold leading-[20px] rounded-[4px] hover:bg-[#f6f6f9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Discard</button>
              <button disabled={!hasUnsavedChanges} onClick={() => setHasUnsavedChanges(false)} className="box-border h-[44px] px-[16px] py-[12px] border-none bg-[#c74900] text-white text-[14px] font-semibold leading-[20px] rounded-[4px] hover:bg-[#9e4100] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button onClick={() => setIsEditMode(true)} className="h-[46px] min-w-[56px] px-[12px] bg-[#C74900] text-white rounded-[4px] text-[14px] font-semibold font-['Inter'] hover:bg-[#9e4100] transition-colors shadow-sm flex items-center justify-center">
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ⚠️ ABSOLUTE MODALS (Confined to viewport entirely)                       */}
      {/* ========================================================================= */}

      {/* 1. SHARE MODAL RENDERING */}
      {activeModal === "share" && (
        <ShareModal 
          onClose={() => setActiveModal(null)} 
          activeVariant={activeVariant} 
        />
      )}

      {/* 2. ORIGINAL EXPANDED STEP INSPECTOR MODAL OVERLAY */}
      {activeModal === "expanded" && (
        <div className="fixed inset-0 z-[1010] bg-black/60 flex items-center justify-center overflow-hidden backdrop-blur-sm transition-opacity p-8 animate-fade-in-up">
          <div className="w-[95vw] max-w-[1450px] h-[85vh] bg-[#f6f7fa] flex flex-col shadow-2xl relative rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            <div className="h-[60px] bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#1f1f32] text-[16px]">Step {currentStepIndex + 1}/{stepCards.length}</span>
                <div className="flex items-center gap-1">
                  <button disabled={currentStepIndex === 0} onClick={() => setSelectedStepId(stepCards[currentStepIndex - 1].id)} className="w-[32px] h-[32px] border border-[#d7d6d1] rounded bg-white text-[#6b697b] flex items-center justify-center hover:bg-gray-50 disabled:opacity-50">←</button>
                  <button disabled={currentStepIndex === stepCards.length - 1} onClick={() => setSelectedStepId(stepCards[currentStepIndex + 1].id)} className="w-[32px] h-[32px] border border-[#d7d6d1] rounded bg-white text-[#6b697b] flex items-center justify-center hover:bg-gray-50 disabled:opacity-50">→</button>
                </div>
              </div>
              <div className="flex items-center gap-3 min-h-[36px]">
                <button onClick={() => { setActiveModal(null); setIsReselectMode(false); }} className="p-2 text-[#6b697b] hover:bg-gray-100 rounded-full transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 6l-12 12M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden bg-white">
              <div className="flex-1 w-full bg-[#eef1f6] flex items-center justify-center overflow-auto relative p-6">
                <div id="modal-screenshot-container" className={`relative shadow-xl border border-gray-300 rounded-md overflow-hidden bg-white shrink-0`} style={{ aspectRatio: '3024 / 1650', width: '100%', maxHeight: '100%', backgroundImage: `url("${activeStepData.image || defaultScreenshot}")`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                </div>
              </div>

              {/* Exact duplication call of the Right Properties Panel */}
              <RightPanelContent />

            </div>
            
            <div className="p-4 border-t border-[#e5e7eb] bg-white shrink-0 flex items-center justify-end gap-3 z-20">
              {isEditActive ? (
                <>
                  <button disabled={!hasUnsavedChanges} onClick={() => { setActiveModal(null); setIsReselectMode(false); setHasUnsavedChanges(false); }} className="box-border h-[44px] px-[15px] py-[11px] border border-[#dfdde7] bg-white text-[#3d3c52] text-[14px] font-semibold leading-[20px] rounded-[4px] hover:bg-[#f6f6f9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Discard</button>
                  <button disabled={!hasUnsavedChanges} onClick={() => { setActiveModal(null); setIsReselectMode(false); setHasUnsavedChanges(false); }} className="box-border h-[44px] px-[16px] py-[12px] border-none bg-[#c74900] text-white text-[14px] font-semibold leading-[20px] rounded-[4px] hover:bg-[#9e4100] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <button onClick={() => setIsEditMode(true)} className="min-w-[56px] h-[46px] px-[12px] bg-[#C74900] text-white rounded-[4px] text-[14px] font-semibold font-['Inter'] hover:bg-[#9e4100] transition-colors shadow-sm flex items-center justify-center">Edit</button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 3. CENTER LAUNCH LIVE EDIT MODAL (V1 / V2) */}
      {activeModal === "launch" && (
        <div className="fixed inset-0 z-[2000] bg-[#1a1a2e]/60 flex items-center justify-center transition-opacity backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-[480px] flex flex-col overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="h-[56px] px-6 border-b border-[#e5e7eb] flex items-center justify-between">
              <h3 className="font-bold text-[#1f1f32] flex items-center gap-2">
                <svg className="text-[#d45f00]" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385"></path><path d="M6 9l4 4"></path><path d="M13 10l-4 -4"></path><path d="M3 21h4"></path><path d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l4.5 4.5c-3.025 3.025 -3.109 2.69 -3.207 2.793z"></path></svg>
                Launch Live Edit?
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-[#6b697b] hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-[#3d3c52] leading-relaxed">
                You are about to launch <span className="font-semibold text-[#1f1f32]">Live Edit</span> to insert new steps into this flow. This will automatically open the Whatfix Studio seamlessly on top of your target application.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-end gap-3 shrink-0">
              <button onClick={() => setActiveModal(null)} className="h-[46px] px-5 border border-[#d7d6d1] bg-white text-[#3d3c52] text-[13px] font-semibold rounded-[4px] hover:bg-gray-50 transition-colors">Cancel</button>
              <button className="h-[46px] px-5 bg-[#d45f00] text-white text-[13px] font-semibold rounded-[4px] hover:bg-[#b85200] transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                Launch live edit 
                <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"></path><line x1="10" y1="14" x2="20" y2="4"></line><polyline points="15 4 20 4 20 9"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. IMPORT FLOW MODAL */}
      {activeModal === "import" && (
        <div className="fixed inset-0 z-[2000] bg-[#1a1a2e]/60 flex items-center justify-center transition-opacity backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-[12px] shadow-[0_4px_24px_8px_rgba(0,0,0,0.08)] w-[800px] max-w-[90vw] max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="h-[64px] px-6 border-b border-[#ececf3] flex items-center justify-between shrink-0">
              <h3 className="font-bold text-[16px] text-[#3d3c52]">Attach Flow</h3>
              <button onClick={() => setActiveModal(null)} className="text-[#6b697b] hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="flex-1 bg-[#fcfcfd] p-6 overflow-hidden flex flex-col min-h-[400px]">
              <div className="relative flex items-center w-full max-w-[682px] h-[44px] bg-white border border-[#dfdde7] rounded px-3 shadow-sm mb-4 shrink-0 focus-within:ring-1 focus-within:ring-[#0975d7] focus-within:border-[#0975d7]">
                <svg className="text-gray-400 shrink-0 mr-2" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
                <input type="text" placeholder="Search" className="w-full h-full outline-none text-[#3d3c52] text-[14px] bg-transparent" />
              </div>

              <div className="flex-1 overflow-y-auto bg-white border border-[#dfdde7] rounded">
                <ul className="flex flex-col w-full text-[14px]">
                  <li onClick={() => setSelectedImportFlow('Alpha')} className={`flex items-center justify-between p-3 border-b border-[#f2f2f8] cursor-pointer transition-colors ${selectedImportFlow === 'Alpha' ? 'bg-blue-50' : 'hover:bg-blue-50/50'}`}>
                    <div className="flex items-center gap-3">
                      <svg className="text-[#6b697b]" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 21v-4"></path><path d="M12 13v-4"></path><path d="M12 5v-2"></path><path d="M10 21h4"></path><path d="M8 5v4h11l2 -2l-2 -2z"></path><path d="M14 13v4h-8l-2 -2l2 -2z"></path></svg>
                      <span className="font-medium text-[#3d3c52]">Test Flow Alpha</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#fefbeb] text-[#976c07]">Draft</span>
                  </li>
                  <li onClick={() => setSelectedImportFlow('Ekam')} className={`flex items-center justify-between p-3 border-b border-[#f2f2f8] cursor-pointer transition-colors ${selectedImportFlow === 'Ekam' ? 'bg-blue-50' : 'hover:bg-blue-50/50'}`}>
                    <div className="flex items-center gap-3">
                      <svg className="text-[#6b697b]" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 21v-4"></path><path d="M12 13v-4"></path><path d="M12 5v-2"></path><path d="M10 21h4"></path><path d="M8 5v4h11l2 -2l-2 -2z"></path><path d="M14 13v4h-8l-2 -2l2 -2z"></path></svg>
                      <span className="font-medium text-[#3d3c52]">ekam test flow 2</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d7effe] text-[#0d59ab]">Ready</span>
                  </li>
                  <li onClick={() => setSelectedImportFlow('Prod')} className={`flex items-center justify-between p-3 border-b border-[#f2f2f8] cursor-pointer transition-colors ${selectedImportFlow === 'Prod' ? 'bg-blue-50' : 'hover:bg-blue-50/50'}`}>
                    <div className="flex items-center gap-3">
                      <svg className="text-[#6b697b]" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 21v-4"></path><path d="M12 13v-4"></path><path d="M12 5v-2"></path><path d="M10 21h4"></path><path d="M8 5v4h11l2 -2l-2 -2z"></path><path d="M14 13v4h-8l-2 -2l2 -2z"></path></svg>
                      <span className="font-medium text-[#3d3c52]">Production Rules Branch</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#d9fbee] text-[#106a40]">Production</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 bg-white border-t border-[#ececf3] flex items-center justify-end gap-3 shrink-0">
              <button onClick={() => setActiveModal(null)} className="h-[46px] px-5 border border-[#dfdde7] bg-white text-[#3d3c52] font-semibold rounded hover:bg-gray-50 transition-colors">Cancel</button>
              <button disabled={!selectedImportFlow} onClick={executeImportSplicing} className="h-[46px] px-5 bg-[#0975d7] text-white font-semibold rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#005bb5]">Import Content</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      {activeModal === "delete" && (
        <div className="fixed inset-0 z-[2000] bg-[#1a1a2e]/60 flex items-center justify-center transition-opacity backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-lg shadow-xl w-[440px] flex flex-col p-6 animate-fade-in-up relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-[#6b697b] hover:text-[#1f1f32] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="flex items-start gap-4">
              <div className="w-[52px] h-[52px] rounded-full bg-[#fefbeb] flex items-center justify-center shrink-0">
                <div className="w-[40px] h-[40px] rounded-full bg-[#e6aa3e] flex items-center justify-center text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 9v2m0 4v.01"></path><path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"></path></svg>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4">
                <h3 className="text-[20px] font-bold text-[#1f1f32]">You are deleting this step</h3>
                <p className="text-[16px] text-[#1f1f32]">Are you sure you want to delete this step?</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 w-full">
              <button onClick={() => setActiveModal(null)} className="h-[44px] px-6 border border-[#dfdde7] bg-white text-[#3d3c52] text-[15px] font-semibold rounded hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="h-[44px] px-6 bg-[#e6aa3e] text-[#1f1f32] text-[15px] font-bold rounded shadow-sm hover:bg-[#d69b35] transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* 6. V3 CONTEXTUAL CAPTURE MENU */}
      {captureMenu.isOpen && (
        <div 
          className="fixed z-[2050] bg-white rounded-lg shadow-xl w-[320px] flex flex-col overflow-hidden border border-[#e5e7eb] animate-fade-in-up"
          style={{ top: captureMenu.top, left: captureMenu.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
            <h3 className="font-bold text-[#1f1f32] text-[14px]">{captureMenu.title}</h3>
            <button onClick={() => setCaptureMenu(prev => ({ ...prev, isOpen: false }))} className="text-[#6b697b] hover:bg-gray-100 p-1 rounded-full transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="px-4 pt-3 pb-3 bg-white">
            <p className="text-[12px] text-[#3d3c52] mb-3">{captureMenu.subtitle}</p>
            <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              <button onClick={() => setSelectedCaptureOption('primary')} className={`w-full flex items-center gap-2.5 p-2.5 border rounded-[6px] transition-all text-left bg-white ${selectedCaptureOption === 'primary' ? 'ring-2 ring-blue-200 bg-blue-50/20 border-[#0975d7]' : 'border-[#dfdde7] hover:border-[#0975d7]'}`}>
                <div className="w-6 h-6 rounded-full bg-[#f0f4f8] text-[#0975d7] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path><path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path></svg>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[12px] font-medium text-[#1f1f32] truncate">{captureMenu.primaryOptText}</span>
                </div>
              </button>

              <div onClick={() => setSelectedCaptureOption('custom')} className={`w-full flex items-center gap-2.5 p-2 border rounded-[6px] transition-all text-left bg-white cursor-text ${selectedCaptureOption === 'custom' ? 'ring-2 ring-blue-200 bg-blue-50/20 border-[#0975d7]' : 'border-[#dfdde7] hover:border-[#0975d7]'}`}>
                <div className="w-6 h-6 rounded-full bg-[#f0f4f8] text-[#0975d7] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                <input type="text" placeholder="Enter Custom URL" className="w-full h-full outline-none text-[#1f1f32] text-[12px] bg-transparent font-medium placeholder:text-[#6b697b] placeholder:font-normal" onFocus={() => setSelectedCaptureOption('custom')} />
              </div>

              {/* Collapsible Tabs Accordion */}
              <button onClick={(e) => { e.stopPropagation(); setIsTabsAccordionOpen(!isTabsAccordionOpen); }} className="flex items-center justify-between w-full p-2 mt-2 border border-[#e5e7eb] rounded-[6px] bg-[#f9fafb] hover:bg-gray-50 transition-colors">
                <span className="text-[12px] font-semibold text-[#3d3c52]">Active tabs</span>
                <svg className={`transition-transform duration-200 ${isTabsAccordionOpen ? "rotate-180" : ""}`} width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M6 9l6 6l6 -6"></path></svg>
              </button>

              {isTabsAccordionOpen && (
                <div className="flex flex-col gap-2 mt-1 animate-fade-in-up">
                  <div className="relative flex items-center w-full h-[36px] bg-white border border-[#dfdde7] rounded-[6px] px-3 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-[#0975d7] transition-all">
                    <svg className="text-gray-400 shrink-0 mr-2" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
                    <input type="text" placeholder="Search tabs" className="w-full h-full outline-none text-[#3d3c52] text-[12px] bg-transparent" />
                  </div>

                  {[{id: 'sf', color: '#00a1e0', label: 'SF', text: 'Salesforce - Home'}, {id: 'bh', color: '#f04e23', label: 'BH', text: 'Bullhorn - Candidate Search'}, {id: 'wd', color: '#005cb9', label: 'WD', text: 'Workday - Employee Directory'}, {id: 'sn', color: '#81b5a1', label: 'SN', text: 'ServiceNow - Incident Management'}].map(opt => (
                    <button key={opt.id} onClick={() => setSelectedCaptureOption(opt.id)} className={`w-full flex items-center gap-2.5 p-2.5 border rounded-[6px] transition-all text-left bg-white ${selectedCaptureOption === opt.id ? 'ring-2 ring-blue-200 bg-blue-50/20 border-[#0975d7]' : 'border-[#dfdde7] hover:border-[#0975d7]'}`}>
                      <div className="w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0" style={{ backgroundColor: opt.color }}>
                        <span className="font-bold text-[10px]">{opt.label}</span>
                      </div>
                      <span className="text-[12px] font-medium text-[#1f1f32] truncate">{opt.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="px-4 py-3 border-t border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-end gap-2 shrink-0">
            <button onClick={() => setCaptureMenu(prev => ({ ...prev, isOpen: false }))} className="h-[32px] px-4 border border-[#dfdde7] bg-white text-[#3d3c52] text-[12px] font-semibold rounded hover:bg-gray-50 transition-colors">Cancel</button>
            <button disabled={!selectedCaptureOption} className="h-[32px] px-5 bg-[#c74900] text-white text-[12px] font-semibold rounded hover:bg-[#9e4100] transition-colors shadow-sm disabled:opacity-50 disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] disabled:cursor-not-allowed">
              {captureMenu.actionBtnText}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}