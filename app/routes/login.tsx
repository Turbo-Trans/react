import type { Route } from "./+types/login";
import { Login } from "../screens/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Giriş Yap - TransFlow" },
    { name: "description", content: "TransFlow lojistik yönetim paneline giriş yapın" },
  ];
}

export default function LoginRoute() {
  return <Login />;
}

