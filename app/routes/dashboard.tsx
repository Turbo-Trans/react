import type { Route } from "./+types/dashboard";
import { Dashboard } from "~/screens/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Last" },
    { name: "description", content: "Last lojistik yönetim paneline hoşgeldiniz" },
  ];
}

export default function DashboardRoute(){
    return <Dashboard />;
}