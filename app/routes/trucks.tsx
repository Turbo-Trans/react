import type { Route } from "./+types/trucks";
import { TruckScreen } from "~/screens/truckScreen";

export function meta({}: Route.MetaArgs){
    return [
        {title: "Tır Yönetimi - TransFlow"},
        {name: "description", content: "Transflow tır yönetimi ekranı"},
    ];
}

export default function TrucksRoute(){
    return <TruckScreen />;
}