"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "./globals.css";

// 📦 Sidebar component reading live parameters
function StatefulSidebar({ children }) {
  const searchParams = useSearchParams();
  const isWidgetView = searchParams.get("view") === "widget";

  return (
    <div id="wfx-hub-layout" className="flex h-screen w-full overflow-hidden">
      
      {/* 🚀 TRUE SPEC WHATFIX SIDEBAR */}
      <div id="dash-sidebar" className="w-[235px] bg-[#1a1a2e] text-[#fff8f5] flex flex-col shrink-0 relative border-r border-white/5 shadow-xl z-20">
        
        {/* Header Brand Area: Icon -> Text -> Switcher */}
        <div className="dash-header-switcher mx-3 px-2 h-[60px] mt-2 flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <img src="/icons/Guidance Icon.svg" alt="Guidance" className="w-5 h-5 object-contain" />
            <h5 className="h-[24px] leading-[24px] font-semibold text-[16px] text-white tracking-wide">Guidance</h5>
          </div>
          <img src="/icons/Product Switcher.svg" alt="Product Switcher" className="w-[18px] h-[18px] opacity-80" />
        </div>

        <div className="dash-divider h-px bg-white/10 mx-3 shrink-0 my-1"></div>

        <div className="dash-nav-container w-full px-3 py-2 flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          
          {/* User Account Switcher Block */}
          <div className="dash-account-switch w-full h-[44px] flex items-center justify-center mb-1">
            <button className="w-full h-[44px] flex items-center rounded-lg hover:bg-white/10 transition-colors px-3">
              <div className="w-full h-[24px] flex items-center justify-between w-full">
                
                {/* Left grouped container for icon and text string layout alignment */}
                <div className="flex items-center gap-2 truncate">
                  <img src="/icons/Dashboard Icon.svg" alt="Dashboard" className="w-[18px] h-[18px] shrink-0" />
                  <span className="dash-nav-text font-medium text-[14px] text-white truncate">Aravind_Demo</span>
                </div>

                {/* Dropdown switch icon pinned neatly onto the right flank */}
                <img src="/icons/Dashboard Switch.svg" alt="Dashboard Switch" className="w-4 h-4 opacity-80 shrink-0" />
                
              </div>
            </button>
          </div>

          {/* Dynamic Sidebar Icons Mapping */}
          <div className="dash-nav-primary space-y-0.5">
            <div className="w-full h-[44px] flex items-center justify-center">
              <a 
                href="/" 
                className={`dash-nav-btn w-full h-[44px] flex items-center rounded-lg font-medium transition-colors ${
                  !isWidgetView ? "bg-white/10 text-white" : "text-[#fff8f5] hover:bg-white/5"
                }`}
              >
                <div className="w-full h-[24px] flex items-center">
                  <div className="dash-nav-icon w-[44px] h-[24px] flex items-center justify-center shrink-0">
                    <img 
                      src={!isWidgetView ? "/icons/Sidebar Content (Selected).svg" : "/icons/Sidebar Content.svg"} 
                      alt="Content" 
                      className="w-[20px] h-[20px]" 
                    />
                  </div>
                  <span className="dash-nav-text text-[14px] leading-[24px]">Content</span>
                </div>
              </a>
            </div>
            
            <div className="w-full h-[44px] flex items-center justify-center">
              <a 
                href="/?view=widget" 
                className={`dash-nav-btn w-full h-[44px] flex items-center rounded-lg font-medium transition-colors ${
                  isWidgetView ? "bg-white/10 text-white" : "text-[#fff8f5] hover:bg-white/5"
                }`}
              >
                <div className="w-full h-[24px] flex items-center">
                  <div className="dash-nav-icon w-[44px] h-[24px] flex items-center justify-center shrink-0">
                    <img 
                      src={isWidgetView ? "/icons/Sidebar Widget (Selected).svg" : "/icons/Sidebar Widget.svg"} 
                      alt="Widget" 
                      className="w-[20px] h-[20px]" 
                    />
                  </div>
                  <span className="dash-nav-text text-[14px] leading-[24px]">Widget</span>
                </div>
              </a>
            </div>
            
            <div className="w-full h-[44px] flex items-center justify-center">
              <a href="#" className="dash-nav-btn w-full h-[44px] flex items-center rounded-lg text-[#fff8f5] font-medium hover:bg-white/5 transition-colors">
                <div className="w-full h-[24px] flex items-center">
                  <div className="dash-nav-icon w-[44px] h-[24px] flex items-center justify-center shrink-0">
                    <img src="/icons/Sidebar Guidance Analytics.svg" alt="Analytics" className="w-[20px] h-[20px]" />
                  </div>
                  <span className="dash-nav-text text-[14px] leading-[24px]">Guidance Analytics</span>
                </div>
              </a>
            </div>

            <div className="w-full h-[44px] flex items-center justify-center">
              <a href="/popup-editor" className="dash-nav-btn w-full h-[44px] flex items-center rounded-lg text-[#fff8f5] font-medium hover:bg-white/5 transition-colors">
                <div className="w-full h-[24px] flex items-center">
                  <div className="dash-nav-icon w-[44px] h-[24px] flex items-center justify-center shrink-0">
                    <img src="/icons/Sidebar Style.svg" alt="Style" className="w-[20px] h-[20px]" />
                  </div>
                  <span className="dash-nav-text text-[14px] leading-[24px]">Style</span>
                </div>
              </a>
            </div>

            <div className="w-full h-[44px] flex items-center justify-center">
              <a href="#" className="dash-nav-btn w-full h-[44px] flex items-center rounded-lg text-[#fff8f5] font-medium hover:bg-white/5 transition-colors">
                <div className="w-full h-[24px] flex items-center">
                  <div className="dash-nav-icon w-[44px] h-[24px] flex items-center justify-center shrink-0">
                    <img src="/icons/Sidebar Tags.svg" alt="Tags" className="w-[20px] h-[20px]" />
                  </div>
                  <span className="dash-nav-text text-[14px] leading-[24px]">Tags</span>
                </div>
              </a>
            </div>

            <div className="w-full h-[44px] flex items-center justify-center">
              <a href="/studio" className="dash-nav-btn w-full h-[44px] flex items-center rounded-lg text-[#fff8f5] font-medium hover:bg-white/5 transition-colors">
                <div className="w-full h-[24px] flex items-center">
                  <div className="dash-nav-icon w-[44px] h-[24px] flex items-center justify-center shrink-0">
                    <img src="/icons/Sidebar Settings.svg" alt="Settings" className="w-[20px] h-[20px]" />
                  </div>
                  <span className="dash-nav-text text-[14px] leading-[24px]">Settings</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="dash-divider h-px bg-white/10 mx-3 shrink-0 my-1"></div>

        {/* Footer Deck Options */}
        <div className="dash-nav-secondary w-full px-3 py-2 flex flex-col shrink-0 space-y-0.5">
          <div className="w-full h-[44px] flex items-center px-3 text-[#fff8f5]">
            <div className="w-[24px] h-[24px] rounded-full bg-amber-500 font-bold flex items-center justify-center text-[11px] mr-3">JD</div>
            <span className="text-[14px] font-medium">John Doe</span>
          </div>

          <div className="w-full h-[44px] flex items-center px-3 text-[#fff8f5] gap-3">
            <img src="/icons/Notification icon non empty.svg" alt="Alerts" className="w-[20px] h-[20px]" />
            <span className="text-[14px]">Notifications</span>
          </div>

          <div className="w-full h-[44px] flex items-center px-3 text-[#fff8f5] gap-3">
            <img src="/icons/Sidebar Footer Resources.svg" alt="Resources" className="w-[20px] h-[20px]" />
            <span className="text-[14px]">Resources</span>
          </div>

          {/* 🎯 INJECTED SUPPORT COMPONENT BUTTON */}
          <div className="w-full h-[44px] flex items-center px-3 text-[#fff8f5] gap-3 cursor-pointer hover:bg-white/5 rounded-lg transition-colors">
            <img src="/icons/Self Help.svg" alt="Support" className="w-[20px] h-[20px]" />
            <span className="text-[14px]">Support</span>
          </div>
        </div>

        <div className="dash-footer flex justify-center pb-6 shrink-0 mt-4">
          <img src="/icons/Footer Whatfix Logo.svg" alt="Whatfix" className="h-[24px] w-auto" />
        </div>
      </div>

      {/* VIEWPORT AREA */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {children}
      </div>

    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#f6f7fa] font-['Inter'] text-[14px] antialiased text-[#1F1F32] overflow-hidden select-none">
        <Suspense fallback={<div className="p-8 text-sm text-gray-400">Loading Sidebar Architecture...</div>}>
          <StatefulSidebar children={children} />
        </Suspense>
      </body>
    </html>
  );
}