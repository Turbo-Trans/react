import type { Route } from "./+types/userManagement";
import { UserManagement } from "~/screens/userManagement";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kullanıcı Yönetim" },
    { name: "description", content: "Last kullanıcı yönetim ekranı" },
  ];
}
export default function UserManagementRoute() {
  return <UserManagement />;
}
