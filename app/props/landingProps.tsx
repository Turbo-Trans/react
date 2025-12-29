// typelar
export interface FeatureProps {
  title: string;
  description: string;
}

export interface StepProps {
  number: string;
  title: string;
  description: string;
}

// textler
export const landingTexts = {
  hero: {
    titleLine1: "Last",
    titleLine2: "Yapay Zeka Destekli Lojistik Optimizasyonu",
    description:
      "Depolar, araç filoları ve ürün akışları için uçtan uca lojistik yönetimi. Daha az maliyet, daha hızlı teslimat, daha akıllı kararlar.",
    cta: "Giriş Yap",
  },

  features: [
    {
      title: "Akıllı Rota Optimizasyonu",
      description:
        "Yapay zeka algoritmaları ile yakıt tüketimini, teslimat süresini ve operasyonel maliyetleri minimize edin.",
    },
    {
      title: "Gerçek Zamanlı Veri Analizi",
      description:
        "Araçlar, depolar ve sevkiyatlar tek panelden canlı olarak izleyin ve analiz edin.",
    },
    {
      title: "Kurumsal Ölçeklenebilirlik",
      description:
        "Küçük filolardan büyük operasyonlara kadar büyüyebilen, modüler ve bulut uyumlu mimari.",
    },
  ],

  howItWorks: {
    title: "Nasıl Çalışır?",
    steps: [
      {
        title: "Veri Toplama",
        description:
          "Araçlar, depolar ve operasyonel sistemlerden tüm lojistik veriler güvenli şekilde toplanır.",
      },
      {
        title: "Yapay Zeka Analizi",
        description:
          "Toplanan veriler AI modelleri ile analiz edilir, en verimli senaryolar hesaplanır.",
      },
      {
        title: "Optimizasyon & Karar",
        description:
          "En uygun rota, planlama ve dağıtım önerileri yöneticilere sunulur ve uygulanır.",
      },
    ],
  },

  footer: {
    brand: "TransFlow",
    addressLine1: "Halkalı Merkez Mah. Halkalı Cad No:281/23",
    addressLine2: "Ofis No:34, 34303 Küçükçekmece / İstanbul",
    copyright: "Tüm hakları saklıdır.",
  },
};
