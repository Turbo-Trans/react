import type { Route } from "./+types/home";
import { Landing } from "../screens/landing";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Last" },
    { name: "description", content: "Welcome to TransFlow — AI-Powered Logistics Optimization!" },
  ];
}

export default function Home() {
  return <Landing />;
}
