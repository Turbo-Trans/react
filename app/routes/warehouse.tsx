import type { Route } from "./+types/warehouse";
import { WarehouseManagement } from "~/screens/warehouse";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Depo Yönetimi - TransFlow" },
    { name: "description", content: "TransFlow depo yönetimi ekranı" },
  ];
}

export default function WarehouseRoute() {
  return <WarehouseManagement />;
}

