import React from "react";
import { useNavigate } from "react-router-dom";
import type { FeatureProps, StepProps } from "../props/landingProps";
import { landingTexts } from "../props/landingProps";

export function Landing() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl">
          {landingTexts.hero.titleLine1} <br className="hidden md:block" />
          {landingTexts.hero.titleLine2}
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl">
          {landingTexts.hero.description}
        </p>

        <div className="mt-10 flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
          >
            {landingTexts.hero.cta}
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {landingTexts.features.map((feature, index) => (
            <Feature
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {landingTexts.howItWorks.title}
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            {landingTexts.howItWorks.steps.map((step, index) => (
              <Step
                key={index}
                number=""
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-gray-50 py-10 px-6 text-sm text-gray-600">
        <div className="max-w-6xl mx-auto relative min-h-[80px]">
          <div className="text-left">
            <p className="font-semibold text-gray-900">
              {landingTexts.footer.brand}
            </p>
            <p className="mt-2 leading-relaxed">
              {landingTexts.footer.addressLine1} <br />
              {landingTexts.footer.addressLine2}
            </p>
          </div>

          <div className="absolute right-0 bottom-0 text-right">
            <p className="text-gray-500">
              © {new Date().getFullYear()} {landingTexts.footer.brand}
            </p>
            <p className="text-gray-400">
              {landingTexts.footer.copyright}
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}

// fonksşyonalar

function Feature({ title, description }: FeatureProps) {
  return (
    <div className="text-center md:text-left">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-4 text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="text-center md:text-left">
      <span className="text-sm font-semibold text-gray-400">{number}</span>
      <h3 className="mt-2 text-xl font-semibold">{title}</h3>
      <p className="mt-4 text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
