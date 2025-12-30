import type { Route } from "./+types/login";
import { Login } from "../screens/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Giriş Yap - Last" },
    { name: "description", content: "Last lojistik yönetim paneline giriş yapın" },
  ];
}

export default function LoginRoute() {
  return <Login />;
}

