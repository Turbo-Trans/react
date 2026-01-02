import React, { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../node_api/auth";
import { loginTexts } from "../props/loginProps";


export function Login() {
  const navigate = useNavigate();

  // FORM STATE
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // UI STATE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(identifier, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");

    } catch (err: any) {
      setError(err.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">

        {/* TITLE */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-1">
            {loginTexts.brand}
            <img 
              src="/favicon.ico" 
              alt="Logo" 
              className="h-[1em] w-auto"
            />
          </h1>
          <p className="mt-2 text-gray-600">
            {loginTexts.subtitle}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {/* USERNAME / EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              {loginTexts.identifierLabel}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder= {loginTexts.identifierPlaceholder}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl 
                         text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              {loginTexts.passwordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={loginTexts.passwordPlaceholder}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl 
                         text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-sm text-red-600">
              {error ?? loginTexts.errorFallback}
            </p>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white font-medium 
                       hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? loginTexts.submit.loading : loginTexts.submit.idle}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <button
            onClick={() => navigate("/")}
            className="hover:text-black transition"
          >
            {loginTexts.backToHome}
          </button>
        </div>
      </div>

    </main>
  );
}
