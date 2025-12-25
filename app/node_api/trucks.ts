import { request } from "./client"

// tüm tırları listeler
export async function getTrucks() {
    return request("/listTrucks");
}

// tır bilgilerini listeler
// TODO: BU API'A FILTRE EKLENECEK
export async function listTruckInfo() {
    return request("/listTruckInfo")
}

// tır ekleme
export async function addTruck(payload:{
       truckBrand: string;
       truckModel: string;
}){
    return request("/addTruck",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

// tır bilgilerini ekleme
export async function addTruckInfo(payload:{
    truckID: number;
    plate: string;
}){
    return request("/addTruckInfo", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

// tır bilgilerini düzenler
export async function editTruckInfo(ID: number, payload:{
    truckID?: number;
    plate?: string;
}){
    return request(`/editTruckInfo?id=${ID}`,{
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

// tır bilgilerini siler
export function deleteTruckInfo(truckID: number){
    return request(`/removeTruckInfo?id=${truckID}`,{
        method: "DELETE",
    });
}

// bir tır siler
export async function deleteTruck(truckID: number) {
    return request(`/removeTruck?id=${truckID}`,{
        method: "DELETE",
    });
}

