import type { Route } from "./+types/dashboard";
import { Dashboard } from "~/screens/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - TransFlow" },
    { name: "description", content: "TransFlow lojistik yönetim paneline hoşgeldiniz" },
  ];
}

export default function DashboardRoute(){
    return <Dashboard />;
}