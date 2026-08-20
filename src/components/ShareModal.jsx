import React, { useState } from "react";

export default function ShareModal({ onClose, activeVariant = 'v1', allowEmbed = true }) {
  // Core format selection engine
  const [shareTab, setShareTab] = useState("Download"); 
  const [shareFormat, setShareFormat] = useState("Video"); 
  
  // Configuration elements state parameters
  const [sendCopy, setSendCopy] = useState(true);
  const [slideshowWidth, setSlideshowWidth] = useState("Standard");
  const [videoWidth, setVideoWidth] = useState("Standard");
  const [slideshowStart, setSlideshowStart] = useState("Introduction");
  const [displayFlowTitle, setDisplayFlowTitle] = useState("Yes");

  // 🌍 Multi-Language Setup Parameters
  const languagesList = ["English (en)", "Spanish (es)", "French (fr)", "German (de)", "Japanese (ja)"];
  const [selectedLanguages, setSelectedLanguages] = useState([]); // Default select no language
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // UX State Triggers
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [copyStates, setCopyStates] = useState({ liveLink: false, urlEmbed: false, iframe: false, html: false });

  // 🛡️ Static Tabs List for Mapping
  const availableTabs = ["Download", "Email", "Embed", "Convert"];

  // Master config map of tabs and formats
  const shareFormatsConfig = {
    "Download": ["Video", "PDF", "ODF", "Link"],
    "Email": ["Video", "PDF", "ODF", "Link"],
    "Embed": ["Video", "Script", "Slideshow", "Article"],
    "Convert": ["Video", "Slideshow as Link"]
  };

  const handleShareTabChange = (tab) => {
    // Prevent switching to Embed if multi-select disables it
    if (!allowEmbed && tab === "Embed") return;
    
    setShareTab(tab);
    setShareFormat(shareFormatsConfig[tab][0]);
    setIsPreviewExpanded(false);
    setIsLangDropdownOpen(false);
  };

  const handleFormatChange = (format) => {
    setShareFormat(format);
    setIsPreviewExpanded(false);
    setIsLangDropdownOpen(false);
  };

  const handleLanguageToggle = (lang) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleCopy = (field) => {
    setCopyStates(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [field]: false }));
    }, 2000);
  };

  // Shared Preview Component: Slideshow/Article
  const renderSlideshowPreviewCard = () => (
    <div className="w-[412px] h-[305px] bg-white rounded-lg border border-[#DFDDE7] p-5 flex flex-col justify-between relative overflow-hidden shadow-sm select-none shrink-0 mx-auto">
      <div className="flex flex-col gap-1">
        <span className="font-['Inter'] font-bold text-[18px] leading-[24px] text-[#1F1F32]">Floating Branch</span>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-white text-[11px] font-bold font-['Inter']">AM</div>
          <div className="flex flex-col">
            <span className="font-['Inter'] text-[10px] leading-[12px] text-gray-400">created 12 jan</span>
            <span className="font-['Inter'] text-[12px] font-medium text-[#3D3C52]">Aravind Manohar</span>
          </div>
        </div>
        <div className="inline-block self-start bg-rose-50 text-rose-600 font-['Inter'] text-[11px] px-2 py-0.5 rounded mt-3 font-medium border border-rose-100">
          am-wfx.github.io
        </div>
      </div>
      <button className="absolute right-5 top-14 box-border border border-[#C74900] text-[#C74900] font-['Inter'] font-semibold text-[13px] px-3 py-1 bg-white rounded hover:bg-orange-50 transition-colors">
        Start
      </button>
      <div className="w-full flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] text-gray-400 font-['Inter'] mt-4">
        <div className="flex items-center gap-3">
          <span>👍 0 Votes</span>
          <span>👁️ 0 Views</span>
          <span>🏃 0 Runs</span>
          <span>❌ 0 Failures</span>
        </div>
        <div className="flex items-center gap-2 bg-[#3D3C52] text-white py-1 px-3 rounded shadow-sm font-medium">
          <span>&lt;&nbsp; 1/3 &nbsp;&gt;</span>
          <span className="bg-[#C74900] px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">See live</span>
        </div>
      </div>
      <div className="absolute bottom-2 left-5 text-[10px] font-['Inter'] text-gray-300">
        Powered by <span className="italic font-bold">whatfix</span>
      </div>
    </div>
  );

  // Shared Preview Component: Video Mock (Ready State)
  const renderVideoPreviewCard = () => (
    <div className="w-[412px] h-[305px] bg-[#1F1F32] rounded-lg border border-[#DFDDE7] flex flex-col items-center justify-center relative overflow-hidden shadow-sm shrink-0 mx-auto group">
       <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-slate-800 opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
       <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer group-hover:bg-white/30 transition-all border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)] group-hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none" className="ml-1">
             <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
       </div>
       <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between px-4 pb-3 z-10">
          <span className="font-['Inter'] font-medium text-[13px] text-white drop-shadow-md">How to Create a Branch</span>
          <span className="font-['Inter'] font-semibold text-[10px] tracking-wide text-white/90 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">02:45</span>
       </div>
    </div>
  );

  // Reusable Multi-Select Language Picker UI Component
  const renderLanguagePicker = () => (
    <div className="relative w-full bg-[#FFFFFF]">
      <div 
        onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
        className="box-border flex flex-row items-center py-[4px] px-[12px] w-full min-h-[44px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] hover:border-[#6B697B] cursor-pointer transition-colors"
      >
        <div className="flex flex-wrap gap-1.5 flex-1 py-1">
          {selectedLanguages.length === 0 ? (
            <span className="font-['Inter'] italic font-normal text-[14px] leading-[20px] text-[#6B697B]">Select languages</span>
          ) : (
            selectedLanguages.map(lang => (
              <span key={lang} className="bg-blue-50 text-[#0975D7] text-[12px] font-medium font-['Inter'] px-2 py-0.5 rounded flex items-center gap-1 border border-blue-100 animate-fade-in-up">
                {lang}
                <span 
                  onClick={(e) => { e.stopPropagation(); handleLanguageToggle(lang); }}
                  className="hover:text-red-500 font-bold ml-0.5 cursor-pointer text-[10px]"
                >
                  ✕
                </span>
              </span>
            ))
          )}
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" stroke="#6B697B" strokeWidth="2" fill="none" className={`transition-transform duration-200 shrink-0 ml-1 ${isLangDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      
      {isLangDropdownOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#FFFFFF] opacity-100 border border-[#DFDDE7] rounded-[4px] shadow-lg py-1.5 flex flex-col z-[5500] max-h-[180px] overflow-y-auto custom-scrollbar">
          {languagesList.map(lang => {
            const isChecked = selectedLanguages.includes(lang);
            return (
              <div 
                key={lang} 
                onClick={() => handleLanguageToggle(lang)}
                className="flex flex-row items-center gap-2.5 px-3 py-2 text-[14px] font-['Inter'] text-[#3D3C52] bg-[#FFFFFF] opacity-100 hover:bg-[#F4F5F7] cursor-pointer transition-colors"
              >
                <div className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#0975D7] border-[#0975D7]' : 'bg-white border-[#C0BECC]'}`}>
                  {isChecked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </div>
                <span className="font-medium bg-[#FFFFFF]">{lang}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderFormFields = () => {
    const isExpandedPreview = shareTab === "Embed" && (shareFormat === "Slideshow" || shareFormat === "Article" || shareFormat === "Video");

    // ==========================================
    // ⬇️ SPECIAL TWO-COLUMN CONFIG (VIDEO, SLIDESHOW, ARTICLE)
    // ==========================================
    if (isExpandedPreview) {
      return (
        <div className="w-full flex flex-col gap-[16px]">
          
          {activeVariant !== 'v1' && (
            <div className="flex flex-row justify-between items-center w-full mb-1 shrink-0">
              <span className="font-['Inter'] font-semibold text-[15px] text-[#1F1F32]">Configuration</span>
              <button 
                onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                className="flex items-center gap-1.5 text-[#0975D7] hover:text-[#0861B5] font-['Inter'] font-medium text-[13px] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isPreviewExpanded ? (
                    <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></>
                  ) : (
                    <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></>
                  )}
                </svg>
                {isPreviewExpanded ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
          )}

          <div className={`flex flex-col items-start p-0 gap-[4px] w-full shrink-0 ${isLangDropdownOpen ? 'relative z-50' : ''}`}>
            <div className="flex flex-row items-center p-0 gap-[2px]">
              <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">
                {shareFormat} Language
              </span>
            </div>
            <div className="w-full mt-1">
              {renderLanguagePicker()}
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#F2F2F8] shrink-0" />

          {/* Width Configurations with Icons + Grid UI */}
          {shareFormat === "Video" ? (
            <div className="flex flex-col items-start p-0 gap-[12px] w-full shrink-0 relative">
              <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Width of Video</span>
              
              <div className="grid grid-cols-2 gap-y-[16px] gap-x-[24px] w-full">
                 <div className="flex flex-row items-center gap-[8px] cursor-pointer group" onClick={() => setVideoWidth("Small")}>
                   <div className={`box-border w-[20px] h-[20px] rounded-[10px] flex items-center justify-center transition-all ${videoWidth === "Small" ? "bg-[#FFFFFF] border-[6px] border-[#0975D7]" : "border border-[#8C899F]"}`}></div>
                   <svg width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={videoWidth === "Small" ? "text-[#0975D7]" : "text-[#6B697B]"}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                   <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Small (400px)</span>
                 </div>
                 <div className="flex flex-row items-center gap-[8px] cursor-pointer group" onClick={() => setVideoWidth("Standard")}>
                   <div className={`box-border w-[20px] h-[20px] rounded-[10px] flex items-center justify-center transition-all ${videoWidth === "Standard" ? "bg-[#FFFFFF] border-[6px] border-[#0975D7]" : "border border-[#8C899F]"}`}></div>
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={videoWidth === "Standard" ? "text-[#0975D7]" : "text-[#6B697B]"}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                   <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Standard (600px)</span>
                 </div>
                 <div className="flex flex-row items-center gap-[8px] cursor-pointer group" onClick={() => setVideoWidth("Large")}>
                   <div className={`box-border w-[20px] h-[20px] rounded-[10px] flex items-center justify-center transition-all ${videoWidth === "Large" ? "bg-[#FFFFFF] border-[6px] border-[#0975D7]" : "border border-[#8C899F]"}`}></div>
                   <svg width="18" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={videoWidth === "Large" ? "text-[#0975D7]" : "text-[#6B697B]"}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                   <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Large (853px)</span>
                 </div>
                 <div className="flex flex-row items-center gap-[8px] cursor-pointer group" onClick={() => setVideoWidth("ExtraLarge")}>
                   <div className={`box-border w-[20px] h-[20px] rounded-[10px] flex items-center justify-center transition-all ${videoWidth === "ExtraLarge" ? "bg-[#FFFFFF] border-[6px] border-[#0975D7]" : "border border-[#8C899F]"}`}></div>
                   <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={videoWidth === "ExtraLarge" ? "text-[#0975D7]" : "text-[#6B697B]"}><rect x="1" y="3" width="22" height="16" rx="2" ry="2"></rect><line x1="12" y1="19" x2="12" y2="23"></line></svg>
                   <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Extra Large (1280px)</span>
                 </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start p-0 gap-[12px] w-full shrink-0 relative">
              <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Width of {shareFormat}</span>
              <div className="flex flex-row items-center gap-[28px] h-[20px]">
                <div className="flex flex-row items-center gap-[8px] cursor-pointer" onClick={() => setSlideshowWidth("Standard")}>
                  <div className={`box-border w-[20px] h-[20px] rounded-[10px] flex items-center justify-center transition-all ${slideshowWidth === "Standard" ? "bg-[#FFFFFF] border-[6px] border-[#0975D7]" : "border border-[#8C899F]"}`}></div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={slideshowWidth === "Standard" ? "text-[#0975D7]" : "text-[#6B697B]"}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                  <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Standard (600px)</span>
                </div>
                <div className="flex flex-row items-center gap-[8px] cursor-pointer" onClick={() => setSlideshowWidth("Small")}>
                  <div className={`box-border w-[20px] h-[20px] rounded-[10px] flex items-center justify-center transition-all ${slideshowWidth === "Small" ? "bg-[#FFFFFF] border-[6px] border-[#0975D7]" : "border border-[#8C899F]"}`}></div>
                  <svg width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={slideshowWidth === "Small" ? "text-[#0975D7]" : "text-[#6B697B]"}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                  <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Small (400px)</span>
                </div>
              </div>
            </div>
          )}

          <div className="w-full h-[1px] bg-[#F2F2F8] shrink-0" />

          {/* Remaining Configs */}
          {shareFormat === "Slideshow" ? (
            <div className="flex flex-col items-start p-0 gap-[12px] w-full shrink-0 relative">
              <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">First Slide</span>
              <div className="flex flex-row items-center gap-[28px] h-[20px]">
                <div className="flex flex-row items-center gap-[8px] cursor-pointer" onClick={() => setSlideshowStart("Introduction")}>
                  <div className={`box-border w-[20px] h-[20px] rounded-[10px] flex items-center justify-center transition-all ${slideshowStart === "Introduction" ? "bg-[#FFFFFF] border-[6px] border-[#0975D7]" : "border border-[#8C899F]"}`}></div>
                  <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Introduction</span>
                </div>
                <div className="flex flex-row items-center gap-[8px] cursor-pointer" onClick={() => setSlideshowStart("FirstStep")}>
                  <div className={`box-border w-[20px] h-[20px] rounded-[10px] flex items-center justify-center transition-all ${slideshowStart === "FirstStep" ? "bg-[#FFFFFF] border-[6px] border-[#0975D7]" : "border border-[#8C899F]"}`}></div>
                  <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">First Step of Flow</span>
                </div>
              </div>
            </div>
          ) : shareFormat === "Article" ? (
            <div className="flex flex-col items-start p-0 gap-[12px] w-full shrink-0 relative">
              <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Display Flow Title</span>
              <div className="flex flex-row items-center gap-[28px] h-[20px]">
                <div className="flex flex-row items-center gap-[8px] cursor-pointer" onClick={() => setDisplayFlowTitle("Yes")}>
                  <div className={`box-border w-[20px] h-[20px] rounded-[10px] flex items-center justify-center transition-all ${displayFlowTitle === "Yes" ? "bg-[#FFFFFF] border-[6px] border-[#0975D7]" : "border border-[#8C899F]"}`}></div>
                  <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Yes</span>
                </div>
                <div className="flex flex-row items-center gap-[8px] cursor-pointer" onClick={() => setDisplayFlowTitle("No")}>
                  <div className={`box-border w-[20px] h-[20px] rounded-[10px] flex items-center justify-center transition-all ${displayFlowTitle === "No" ? "bg-[#FFFFFF] border-[6px] border-[#0975D7]" : "border border-[#8C899F]"}`}></div>
                  <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">No</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* V1 Compact Inline Preview */}
          {activeVariant === 'v1' && (
            <div className="w-full mt-4 shrink-0 bg-[#F4F5F7] p-4 rounded-lg flex flex-col gap-2">
              <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#6B697B]">Live Preview</span>
              {shareFormat === "Video" ? renderVideoPreviewCard() : renderSlideshowPreviewCard()}
            </div>
          )}

        </div>
      );
    }

    // ==========================================
    // ⬇️ DOWNLOAD TAB LAYOUTS
    // ==========================================
    if (shareTab === "Download" && shareFormat === "Video") {
      return (
        <>
          <div className={`flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up ${isLangDropdownOpen ? 'relative z-50' : ''}`}>
            <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Languages</span>
            <div className="w-full mt-1">
              {renderLanguagePicker()}
            </div>
          </div>
          <div className="flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up">
            <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Voice</span>
            <div className="box-border flex flex-row items-center py-[4px] px-[12px] w-full h-[44px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] hover:border-[#6B697B] cursor-pointer">
              <span className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#6B697B] flex-1">Female</span>
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="#6B697B" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <span className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#6B697B] w-full mt-[2px]">
              Sample text: "You are all set. Let's begin by walking through the keys steps on your screen."
            </span>
          </div>
          <div className="flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up">
            <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Narration Style</span>
            <div className="box-border flex flex-row items-center py-[4px] px-[12px] w-full h-[44px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] hover:border-[#6B697B] cursor-pointer">
              <span className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#6B697B] flex-1">Default (Verbatim)</span>
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="#6B697B" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <span className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#6B697B] w-full mt-[2px]">
              Reads the script exactly as written
            </span>
          </div>
        </>
      );
    }

    if (shareTab === "Download" && (shareFormat === "PDF" || shareFormat === "ODF" || shareFormat === "Link")) {
      return (
        <>
          <div className={`flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up ${isLangDropdownOpen ? 'relative z-50' : ''}`}>
            <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Languages</span>
            <div className="w-full mt-1">
              {renderLanguagePicker()}
            </div>
          </div>
          <span className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#3D3C52] w-full shrink-0 animate-fade-in-up">
            {shareFormat === "Link" 
              ? "You’ll receive an email with a link to a CSV file that contains links to the live flows in all selected languages."
              : `Once the ${shareFormat} sets are ready for download, an email will be sent to your registered id with direct package retrieval links.`}
          </span>
        </>
      );
    }

    // ==========================================
    // 📧 EMAIL TAB LAYOUTS
    // ==========================================
    if (shareTab === "Email") {
      return (
        <>
          <div className="flex flex-col items-start p-0 gap-[12px] w-full shrink-0 animate-fade-in-up">
             <div className="flex flex-col items-start p-0 gap-[4px] w-full">
                <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">To:</span>
                <div className="box-border flex flex-row items-center px-[12px] w-full h-[44px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] focus-within:border-[#0975D7] transition-colors">
                   <input type="text" placeholder="Separate multiple emails with commas" className="w-full bg-transparent font-['Inter'] italic font-normal text-[14px] leading-[20px] text-[#3D3C52] placeholder:text-[#6B697B] outline-none" />
                </div>
             </div>
             <div className="flex flex-row items-center p-0 gap-[8px] cursor-pointer group" onClick={() => setSendCopy(!sendCopy)}>
                <div className={`flex flex-row justify-center items-center w-[20px] h-[20px] rounded-[4px] transition-colors relative ${sendCopy ? 'bg-[#0975D7] group-hover:bg-[#0861B5]' : 'bg-[#FFFFFF] border border-[#DFDDE7] group-hover:border-[#0975D7]'}`}>
                   {sendCopy && (
                     <svg className="absolute" width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   )}
                </div>
                <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Send me a copy</span>
             </div>
          </div>
          <div className={`flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up ${isLangDropdownOpen ? 'relative z-50' : ''}`}>
            <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Languages</span>
            <div className="w-full mt-1">
              {renderLanguagePicker()}
            </div>
            {shareFormat !== "Video" && (
              <span className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#3D3C52] w-full mt-[2px]">
                {shareFormat === "Link" 
                  ? "You’ll receive an email with a link to a CSV file that contains localized links to the live flows you selected." 
                  : `Once the ${shareFormat} sets are ready for download, an email will be sent to your registered id with direct package retrieval links.`}
              </span>
            )}
          </div>
          
          {shareFormat === "Video" && (
            <>
              <div className="flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up">
                <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Voice</span>
                <div className="box-border flex flex-row items-center py-[4px] px-[12px] w-full h-[44px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] hover:border-[#6B697B] cursor-pointer">
                  <span className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#6B697B] flex-1">Female</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" stroke="#6B697B" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <span className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#6B697B] w-full mt-[2px]">
                  Sample text: "You are all set. Let's begin by walking through the keys steps on your screen."
                </span>
              </div>
              <div className="flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up">
                <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Narration Style</span>
                <div className="box-border flex flex-row items-center py-[4px] px-[12px] w-full h-[44px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] hover:border-[#6B697B] cursor-pointer">
                  <span className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#6B697B] flex-1">Default (Verbatim)</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" stroke="#6B697B" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up">
            <div className="box-border flex flex-row items-start p-0 w-full h-[108px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] focus-within:border-[#0975D7] relative transition-colors">
              <textarea placeholder="Write your note here..." className="w-full h-full bg-transparent outline-none resize-none p-[12px] font-['Inter'] italic font-normal text-[14px] leading-[20px] text-[#3D3C52] placeholder:text-[#6B697B]"></textarea>
              <div className="absolute right-[8px] bottom-[8px] pointer-events-none text-[#DFDDE7]">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
            </div>
          </div>
        </>
      );
    }

    // ==========================================
    // 🌐 EMBED TAB (SCRIPT FORMAT)
    // ==========================================
    if (shareTab === "Embed" && shareFormat === "Script") {
      return (
        <>
          <div className={`flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up ${isLangDropdownOpen ? 'relative z-50' : ''}`}>
            <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Languages</span>
            <div className="w-full mt-1">
              {renderLanguagePicker()}
            </div>
          </div>
          
          <div className="flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up mt-2">
            <div className="flex flex-row justify-between items-center w-full">
               <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Live Link</span>
            </div>
            <div className="box-border flex flex-row items-center pl-[12px] w-full h-[44px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] focus-within:border-[#0975D7] overflow-hidden">
               <input type="text" value="https://www.whatfix.com/?_wfx=bacfd0fb-07ec-4584-a..." readOnly className="flex-1 bg-transparent font-['Inter'] font-normal text-[14px] leading-[20px] text-[#3D3C52] outline-none truncate" />
               <button 
                 onClick={() => handleCopy('liveLink')}
                 className={`flex flex-row items-center justify-center gap-[6px] w-[96px] h-full border-l border-[#DFDDE7] transition-colors shrink-0 ${copyStates.liveLink ? 'bg-[#E6F4EA] text-[#1E7B34]' : 'bg-[#F2F2F8] hover:bg-[#E5E5EB] text-[#6B697B]'}`}
               >
                  {!copyStates.liveLink && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B7891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                  <span className={`font-['Inter'] font-medium text-[14px] leading-[20px] ${copyStates.liveLink ? 'text-[#1E7B34]' : 'text-[#6B697B]'}`}>
                    {copyStates.liveLink ? 'Copied!' : 'Copy'}
                  </span>
               </button>
            </div>
            <span className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#6B697B] w-full mt-[2px]">
              Use this link to direct users to the target page with live instructions automatically enabled.
            </span>
          </div>

          <div className="flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up mt-2">
            <div className="flex flex-row justify-between items-center w-full">
               <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">URL Embed</span>
            </div>
            <div className="box-border flex flex-row items-center pl-[12px] w-full h-[44px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] focus-within:border-[#0975D7] overflow-hidden">
               <input type="text" value="https://www.whatfix.com/embed/script/?_wfx=bacfd0fb..." readOnly className="flex-1 bg-transparent font-['Inter'] font-normal text-[14px] leading-[20px] text-[#3D3C52] outline-none truncate" />
               <button 
                 onClick={() => handleCopy('urlEmbed')}
                 className={`flex flex-row items-center justify-center gap-[6px] w-[96px] h-full border-l border-[#DFDDE7] transition-colors shrink-0 ${copyStates.urlEmbed ? 'bg-[#E6F4EA] text-[#1E7B34]' : 'bg-[#F2F2F8] hover:bg-[#E5E5EB] text-[#6B697B]'}`}
               >
                  {!copyStates.urlEmbed && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B7891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                  <span className={`font-['Inter'] font-medium text-[14px] leading-[20px] ${copyStates.urlEmbed ? 'text-[#1E7B34]' : 'text-[#6B697B]'}`}>
                    {copyStates.urlEmbed ? 'Copied!' : 'Copy'}
                  </span>
               </button>
            </div>
            <span className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#6B697B] w-full mt-[2px]">
              Use this URL to embed the live instructions directly into your application's iframe or web portal.
            </span>
          </div>
        </>
      );
    }

    // ==========================================
    // 🔄 CONVERT TAB LAYOUTS
    // ==========================================
    if (shareTab === "Convert" && (shareFormat === "Video" || shareFormat === "Slideshow as Link")) {
      return (
        <>
          <div className={`flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up ${isLangDropdownOpen ? 'relative z-50' : ''}`}>
            <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Source Languages</span>
            <div className="w-full mt-1">
              {renderLanguagePicker()}
            </div>
          </div>
          <div className="flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up">
            <div className="flex flex-row items-center p-0 gap-[2px]">
              <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Target Transformation Language</span>
              <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#B3141D]">*</span>
            </div>
            <div className="box-border flex flex-row items-center py-[4px] px-[12px] w-full h-[44px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] hover:border-[#6B697B] cursor-pointer">
              <span className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#1F1F32] flex-1">Match Source Selection (Default)</span>
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="#6B697B" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          <div className="flex flex-col items-start p-0 gap-[4px] w-full shrink-0 animate-fade-in-up">
            <div className="flex flex-row justify-between items-center w-full">
               <div className="flex flex-row items-center p-0 gap-[2px]">
                  <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#3D3C52]">Title Prefix</span>
                  <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-[#B3141D]">*</span>
               </div>
               <span className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#6B697B]">0/100</span>
            </div>
            <div className="box-border flex flex-row items-center px-[12px] w-full h-[44px] bg-[#FFFFFF] border border-[#DFDDE7] rounded-[4px] focus-within:border-[#0975D7]">
               <input key={shareFormat} type="text" defaultValue={shareFormat === "Video" ? "Video:" : "Slideshow:"} className="w-full bg-transparent font-['Inter'] font-normal text-[14px] leading-[20px] text-[#1F1F32] outline-none" />
            </div>
            <span className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#6B697B] w-full mt-[2px]">
               Add prefix to distinguish flow title from its corresponding {shareFormat === "Video" ? "Video" : "Slideshow"} title
            </span>
          </div>
        </>
      );
    }

    return null;
  };

  const renderPreviewFiller = () => {
    const isExpandedPreview = shareTab === "Embed" && (shareFormat === "Slideshow" || shareFormat === "Article" || shareFormat === "Video");
    if (activeVariant !== 'v2' || isExpandedPreview) return null;
    return (
      <div className="mt-auto flex-1 min-h-[140px] w-full bg-[#FCFCFD] rounded-lg border border-dashed border-[#DFDDE7] flex flex-col items-center justify-center p-6 gap-3 shrink-0 animate-fade-in-up">
         <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-[#ECECF3] flex items-center justify-center text-[#C74900]">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
         </div>
         <div className="text-center font-['Inter'] font-semibold text-[14px] text-[#3D3C52]">
           {shareTab} {shareFormat}
         </div>
      </div>
    );
  };

  const isExpandedPreview = shareTab === "Embed" && (shareFormat === "Slideshow" || shareFormat === "Article" || shareFormat === "Video");
  const useWideLayout = (activeVariant === 'v2' || activeVariant === 'v3') && isExpandedPreview && isPreviewExpanded;
  const isEmbedScript = shareTab === "Embed" && shareFormat === "Script";

  const getModalWidth = () => {
    if (useWideLayout) {
      return activeVariant === 'v3' ? "1210px" : "1010px";
    }
    return activeVariant === 'v3' ? "760px" : "560px";
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-[#1a1a2e]/60 flex items-center justify-center transition-all backdrop-blur-sm" onClick={onClose}>
      
      <div 
        className="flex flex-col relative bg-white rounded-[12px] shadow-[0_4px_24px_8px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.1),0_6px_18px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          width: "100%",
          maxWidth: getModalWidth(),
          height: "680px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER LAYER MAP */}
        <div className="box-border flex flex-row items-center justify-between p-[12px] w-full h-[68px] bg-[#FFFFFF] border-b border-[#ECECF3] shrink-0">
          <div className="flex flex-row items-center gap-[12px] flex-1 min-w-0">
            <div className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] bg-[#FFF8F5] rounded-[18px] shrink-0 relative">
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="#C74900" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="absolute">
                <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </div>
            <div className="flex flex-col justify-center items-start px-[12px] flex-1 min-w-0">
              <span className="font-['Inter'] font-semibold text-[18px] leading-[24px] text-[#1F1F32] truncate">Share</span>
            </div>
          </div>
          <button onClick={onClose} className="flex flex-row justify-center items-center p-[12px] w-[44px] h-[44px] rounded-[24px] hover:bg-gray-100 transition-colors shrink-0">
             <div className="relative w-[20px] h-[20px] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" stroke="#6B697B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </div>
          </button>
        </div>

        {/* INTERIOR VIEW STRATEGY HUB ROUTER */}
        {activeVariant === 'v3' ? (
          <div className="flex flex-row flex-1 overflow-hidden w-full h-full bg-[#FCFCFD]">
            
            <div className="w-[160px] shrink-0 border-r border-[#ECECF3] bg-[#FCFCFD] flex flex-col pt-[16px] px-[12px] gap-[8px] relative z-20">
              {availableTabs.map((tab) => {
                const isDisabled = !allowEmbed && tab === "Embed";
                return (
                  <div key={tab} className="relative group/tooltip">
                    <button 
                      onClick={(e) => {
                        if (isDisabled) { e.preventDefault(); return; }
                        handleShareTabChange(tab);
                      }} 
                      className={`w-full text-left font-['Inter'] font-semibold text-[14px] leading-[20px] py-[10px] px-[12px] rounded-[6px] transition-all duration-150 ${
                        shareTab === tab 
                          ? "bg-[#D7EFFE] text-[#0975D7]" 
                          : isDisabled 
                            ? "text-[#C0BECC] cursor-not-allowed" 
                            : "text-[#3D3C52] hover:bg-gray-50"
                      }`}
                      tabIndex={isDisabled ? -1 : 0}
                    >
                      {tab}
                    </button>
                    {isDisabled && (
                      <div className="absolute top-[calc(100%+4px)] left-0 w-[240px] z-[5000] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 px-3 py-2 bg-[#1F1F32] text-white text-[12px] font-medium rounded shadow-lg">
                        Not available when sharing multiple content pieces
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex-1 flex flex-row overflow-hidden">
               <div className="flex-1 flex flex-col overflow-hidden min-w-[600px]">
                 <div className="px-[24px] pt-[20px] pb-[12px] shrink-0 border-b border-[#F2F2F8]">
                    <div className="flex flex-row items-center gap-[8px] w-full flex-wrap rounded-[4px]">
                      {shareFormatsConfig[shareTab].map((format) => {
                        return (
                          <button key={format} onClick={() => handleFormatChange(format)} className={`box-border flex flex-row justify-center items-center gap-[8px] rounded-[4px] py-[8px] px-[16px] h-[36px] transition-colors ${shareFormat === format ? "bg-[#D7EFFE] border border-[#0975D7]" : "bg-[#FFFFFF] border border-[#DFDDE7] hover:bg-gray-50"}`}>
                            <span className={`font-['Inter'] font-medium text-[13px] leading-[20px] text-center ${shareFormat === format ? "text-[#0975D7]" : "text-[#3D3C52]"}`}>
                              {format}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                 </div>
                 <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar px-[24px] py-[24px] gap-[24px]">
                    {renderFormFields()}
                 </div>
               </div>
               
               <div 
                 className={`shrink-0 bg-[#F4F5F7] flex items-center justify-center border-[#ECECF3] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${
                   useWideLayout ? "w-[450px] border-l opacity-100" : "w-0 border-l-0 opacity-0"
                 }`}
               >
                 <div className="w-[450px] flex items-center justify-center p-[24px]">
                    {shareFormat === "Video" ? renderVideoPreviewCard() : renderSlideshowPreviewCard()}
                 </div>
               </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-row flex-1 overflow-hidden w-full h-full bg-[#FCFCFD]">
            
            <div className="flex-1 flex flex-col overflow-hidden min-w-[560px]">
              <div className="flex flex-col px-[24px] pt-[24px] pb-[16px] gap-[24px] bg-[#FCFCFD] border-b border-[#F2F2F8] shrink-0 relative z-20">
                <div className="flex flex-row items-start p-0 gap-[16px] w-full border-b border-[#ECECF3]">
                  {availableTabs.map((tab) => {
                    const isDisabled = !allowEmbed && tab === "Embed";
                    return (
                      <div key={tab} className="relative group/tooltip flex flex-col items-center p-0 outline-none">
                        <button 
                          onClick={(e) => {
                            if (isDisabled) { e.preventDefault(); return; }
                            handleShareTabChange(tab);
                          }}
                          className={`flex flex-col items-center p-0 outline-none w-full ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          tabIndex={isDisabled ? -1 : 0}
                        >
                          <div className={`flex flex-row items-center py-[10px] px-[4px] gap-[8px] rounded-t-[4px] mb-[-2px] transition-colors ${isDisabled ? '' : 'group-hover/tooltip:bg-gray-50/50'}`}>
                            <span className={`font-['Inter'] font-semibold text-[16px] leading-[24px] transition-colors ${
                              shareTab === tab 
                                ? "text-[#0975D7]" 
                                : isDisabled 
                                  ? "text-[#C0BECC]" 
                                  : "text-[#3D3C52] group-hover/tooltip:text-gray-600"
                            }`}>
                              {tab}
                            </span>
                          </div>
                          <div className={`w-full h-[2px] rounded-t-[2px] transition-colors z-10 ${shareTab === tab ? "bg-[#0975D7]" : "bg-transparent"}`}></div>
                        </button>
                        {isDisabled && (
                          <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[240px] z-[5000] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 px-3 py-2 bg-[#1F1F32] text-white text-[12px] font-medium rounded shadow-lg text-center">
                            Not available when sharing multiple content pieces
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-row items-center gap-[8px] w-full flex-wrap rounded-[4px]">
                  {shareFormatsConfig[shareTab].map((format) => {
                    return (
                      <button key={format} onClick={() => handleFormatChange(format)} className={`box-border flex flex-row justify-center items-center gap-[8px] rounded-[4px] py-[8px] px-[16px] h-[36px] transition-colors ${shareFormat === format ? "bg-[#D7EFFE] border border-[#0975D7]" : "bg-[#FFFFFF] border border-[#DFDDE7] hover:bg-gray-50"}`}>
                        <span className={`font-['Inter'] font-medium text-[14px] leading-[20px] text-center ${shareFormat === format ? "text-[#0975D7]" : "text-[#3D3C52]"}`}>
                          {format}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar px-[24px] py-[24px] gap-[24px] bg-[#FCFCFD]">
                {renderFormFields()}
                {renderPreviewFiller()}
              </div>
            </div>

            <div 
              className={`shrink-0 bg-[#F4F5F7] flex items-center justify-center border-[#ECECF3] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${
                useWideLayout ? "w-[450px] border-l opacity-100" : "w-[0px] border-l-0 opacity-0"
              }`}
            >
              <div className="w-[450px] flex items-center justify-center p-[24px]">
                 {shareFormat === "Video" ? renderVideoPreviewCard() : renderSlideshowPreviewCard()}
              </div>
            </div>
            
          </div>
        )}

        {/* FOOTER ACTION BAR MAP */}
        <div className="box-border flex flex-row justify-between items-center py-[16px] px-[24px] w-full h-[76px] bg-[#FFFFFF] border-t border-[#F2F2F8] shrink-0 mt-auto">
          
          <button onClick={onClose} className="box-border flex flex-row justify-center items-center py-[10px] px-[16px] h-[40px] border border-[#DFDDE7] bg-white rounded-[4px] hover:bg-gray-50 transition-colors">
            <span className="font-['Inter'] font-medium text-[14px] text-[#3D3C52]">
              {isEmbedScript ? 'Close' : 'Cancel'}
            </span>
          </button>
          
          {!isEmbedScript && (
            <div className="flex flex-row justify-end items-center gap-[12px]">
              {isExpandedPreview ? (
                <>
                  <button 
                    onClick={() => handleCopy('iframe')}
                    className={`box-border flex flex-row justify-center items-center gap-[8px] w-[140px] h-[40px] border rounded-[4px] transition-colors ${copyStates.iframe ? 'bg-[#FFF8F5] border-[#C74900] text-[#C74900]' : 'bg-white border-[#C74900] text-[#C74900] hover:bg-orange-50/50'}`}
                  >
                    {!copyStates.iframe && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C74900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                    <span className="font-['Inter'] font-medium text-[14px] whitespace-nowrap">
                      {copyStates.iframe ? 'Copied!' : 'Copy iFrame'}
                    </span>
                  </button>
                  <button 
                    onClick={() => handleCopy('html')}
                    className={`flex flex-row justify-center items-center gap-[8px] w-[140px] h-[40px] rounded-[4px] transition-colors shadow-sm ${copyStates.html ? 'bg-[#9E4100] text-white' : 'bg-[#C74900] text-white hover:bg-[#9E4100]'}`}
                  >
                    {!copyStates.html && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                    <span className="font-['Inter'] font-medium text-[14px] whitespace-nowrap">
                      {copyStates.html ? 'Copied!' : 'Copy HTML'}
                    </span>
                  </button>
                </>
              ) : (
                <button className={`flex flex-row justify-center items-center py-[10px] px-[16px] gap-[8px] h-[40px] rounded-[4px] transition-colors shadow-sm bg-[#C74900] hover:bg-[#9E4100]`}>
                  <span className="font-['Inter'] font-medium text-[14px] text-[#FFFFFF] whitespace-nowrap">
                    {shareTab === "Convert" ? `Convert to ${shareFormat === "Slideshow as Link" ? "Slideshow" : shareFormat}` : (shareTab === "Email" ? "Email" : shareTab)} {shareTab !== "Convert" && (shareFormat === "Slideshow as Link" ? "Slideshow" : shareFormat)}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}