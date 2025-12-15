export interface NavItem {
  label: string;
  path: string;
}

export interface ProfileMenuItem {
  label: string;
  action?: "logout" | "navigate";
  path?: string;
  danger?: boolean;
}

export interface NavbarProps {
  brand: {
    name: string;
    subtitle?: string;
  };
  menu: NavItem[];
  profile: {
    buttonLabel: string;
    items: ProfileMenuItem[];
  };
}

// textler
export const navbarTexts: NavbarProps = {
  brand: {
    name: "TransFlow",
    subtitle: "İş Ortağı Paneli",
  },

  menu: [
    { label: "Menü 1", path: "/menu1" },
    { label: "Menü 2", path: "/menu2" },
  ],

  profile: {
    buttonLabel: "Profilim",
    items: [
      {
        label: "Profil Ayarları",
        action: "navigate",
        path: "/profile",
      },
      {
        label: "Çalışanlar",
        action: "navigate",
        path: "/employees",
      },
      {
        label: "Çıkış Yap",
        action: "logout",
        danger: true,
      },
    ],
  },
};
