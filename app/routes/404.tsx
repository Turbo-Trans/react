import type { Route } from "./+types/404";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "404 - Sayfa Bulunamadı - TransFlow" },
    { name: "description", content: "Aradığınız sayfa TransFlow sisteminde bulunamadı." },
  ];
}

export default function NotFoundRoute() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Gradyan Arka Plan */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-center">
          
          {/* 404 Alanı */}
          <div className="mb-10 flex justify-center">
            <div className="relative group flex items-center gap-0">
              <span className="text-8xl md:text-9xl font-black text-blue-600/10 tracking-tighter select-none transition-transform duration-500 group-hover:scale-110">
                4
              </span>
              <img 
                src="/truck-404.png" 
                alt="Tır"
                className="h-[6rem] md:h-[8rem] w-auto object-contain drop-shadow-[0_20px_20px_rgba(37,99,235,0.2)] transition-transform duration-500 group-hover:scale-110" 
              />
              <span className="text-8xl md:text-9xl font-black text-blue-600/10 tracking-tighter select-none transition-transform duration-500 group-hover:scale-110">
                4
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Rota Bulunamadı!
          </h2>
          <p className="text-gray-500 mb-10 text-lg">
            Görünüşe göre rotadan saptınız. <br />
            Aradığınız sayfa sistemimizde mevcut değil.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 text-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ana Sayfaya Dön
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full py-4 bg-white text-gray-600 font-bold rounded-2xl border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all text-lg"
            >
              Geri Git
            </button>
          </div>
        </div>
        {/* Footer */}
        <p className="text-center mt-10 text-gray-400 text-sm tracking-widest uppercase">
          © 2025 TransFlow Lojistik Sistemleri
        </p>
      </div>
    </main>
  );
}