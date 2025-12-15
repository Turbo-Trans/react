import React, { useEffect, useState} from "react";
import { dashboardTexts } from "../props/dashBoardProps";
import { Navbar } from "~/components/navbar";
import { navbarTexts } from "~/props/navbarProps";

type User = {
    username: string;
}

export function Dashboard (){
    //sayfa açıldığında tokendan user bilgisini al
    const[user, setUser] = useState <User | null>(null);

    useEffect(() => {
        const rawUser = localStorage.getItem("user");

        if(!rawUser) return;
        try{
            const parsed = JSON.parse(rawUser);
            setUser(parsed);
        } catch{
            setUser(null);
        }
    }, []);
    return(
        <>
        <Navbar {...navbarTexts} />
        <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

            <div className="bg-white border border-gray-200 rounded-2x1 p-8 shadow-sm text-center">
                <h1 className="text-2x1 font-bold text-gray-900">
                    {dashboardTexts.title}
                </h1>
                <p className="mt-4 text-gray-700">
                    {dashboardTexts.welcome}
                </p>
                <p className="mt-1 text-lg font-semibold text-black">
                    {user?.username ?? dashboardTexts.fallbackUsername}
                </p>
            </div>
        </main>
        </>
    );
}