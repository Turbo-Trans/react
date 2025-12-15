import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NavbarProps, ProfileMenuItem } from "../props/navbarProps";

export function Navbar({ brand, menu, profile }: NavbarProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleProfileAction = (item: ProfileMenuItem) => {
    if (item.action === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (item.action === "navigate" && item.path) {
      navigate(item.path);
      setOpen(false);
    }
  };

  return (
    <header className="w-full bg-gray-50 border-b border-gray-300 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">

        {/* SOL: MARKA */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 rounded-full bg-blue-700" />
          <div className="leading-tight">
            <p className="font-semibold text-gray-900">
              {brand.name}
            </p>
            {brand.subtitle && (
              <p className="text-xs text-gray-700">
                {brand.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* ORTA: MENÜ */}
        <nav className="hidden md:flex gap-8">
          {menu.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="text-sm font-semibold text-gray-800 hover:text-black hover:underline underline-offset-4 transition"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* SAĞ: PROFİL */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-gray-200 hover:bg-gray-300 transition 
                       text-sm font-medium text-gray-900"
          >
            {profile.buttonLabel}
            <span className="text-xs">▼</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 
                            bg-white border border-gray-300 
                            rounded-xl shadow-xl p-2">
              {profile.items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleProfileAction(item)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition
                    ${
                      item.danger
                        ? "text-red-700 hover:bg-red-100"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
