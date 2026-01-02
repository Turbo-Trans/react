import { request } from "./client";

// tüm kullanıcıları getir
export async function getUsers(page: number = 1, limit: number = 10) {
  const response = await request<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    filters: any;
    data: any[];
  }>(`/getUsers?page=${page}&limit=${limit}`);
  return response;
}

// kullanıcı ekle
export async function addUser(payload: {
  username: string;
  password: string;
  permission: number;
  email?: string;
  tel?: string;
  cityID?: number;
  address?: string;
  job?: string;
  warehouseID?: number;
}) {
  return request("/addUser", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// kullancı sil
export async function deleteUser(userID: number) {
  return request(`/deleteUser?userID=${userID}`, {
    method: "DELETE",
  });
}
