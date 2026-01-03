import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import type { NavbarProps, ProfileMenuItem } from "../props/navbarProps";
import { logout } from "~/node_api/auth";

export function Navbar({ brand, menu, profile }: NavbarProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileAction = async (item: ProfileMenuItem) => {
    if (item.action === "logout") {
      try {
        await logout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
      return;
    }
    if (item.action === "navigate" && item.path) {
      navigate(item.path);
      setOpen(false);
    }
  };

  // Orta Menü
  const centerMenuItems = [
    { label: "Çalışan Yönetimi", path: "/userManagement" },
    { label: "Depo Yönetimi", path: "/warehouse" },
    { label: "Tır Yönetimi", path: "/trucks" }
  ];

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        
        {/* SOL: LOGO */}
        <div
          className="flex items-center gap-4 group cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="leading-tight">
            <h1 className="font-black text-xl text-gray-900 tracking-tight">
              {brand.name.toUpperCase()}
            </h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              {brand.subtitle || "Lojistik Sistemleri"}
            </p>
          </div>
        </div>

        {/* ORTA MENÜ */}
        <nav className="hidden md:flex items-center gap-1">
          {centerMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 relative group"
            >
              {item.label}
              <span className="absolute bottom-1.5 left-5 right-5 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          ))}
        </nav>

        {/* SAĞ MENÜ DROP-DOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm
              ${open ? "bg-blue-600 text-white shadow-xl shadow-blue-100" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            <span>Menü</span>
            <svg className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-[24px] shadow-2xl p-2.5 animate-in fade-in zoom-in duration-200 origin-top-right">
              <div className="px-3 py-2 mb-2 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                İşlemler
              </div>
              <div className="space-y-1">
                {profile.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleProfileAction(item)}
                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-[14px] transition-all duration-200 flex items-center justify-between
                      ${item.danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}