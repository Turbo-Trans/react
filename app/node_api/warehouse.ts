import { request } from "./client";
import type {
  AddWarehousePayload,
  AddWarehouseResponse,
  EditWarehousePayload,
  EditWarehouseResponse,
  GetWarehouseParams,
  WarehouseListResponse,
  DeleteWarehouseResponse,
} from "~/props/warehouseProps";

// depo listesini listeleme ve filtreleme
export function getWH(params: GetWarehouseParams = {}): Promise<WarehouseListResponse> {
  const qs = new URLSearchParams();
  if (params.id !== undefined && params.id !== null && `${params.id}`.trim() !== "") {
    qs.set("id", String(params.id));
  }
  if (params.name !== undefined && params.name !== null && params.name.trim() !== "") {
    qs.set("name", params.name.trim());
  }
  if (params.pageNo !== undefined && params.pageNo !== null) {
    qs.set("pageNo", String(params.pageNo));
  }
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return request(`/getWH${suffix}`);
}

// depo ekleme
export function addWH(payload: AddWarehousePayload): Promise<AddWarehouseResponse> {
  return request("/addWH", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// depo düzenleme
export function editWH(id: number, payload: EditWarehousePayload): Promise<EditWarehouseResponse> {
  return request(`/editWH?id=${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// depo silme
export function deleteWH(id: number): Promise<DeleteWarehouseResponse> {
  return request(`/deleteWH?id=${id}`, {
    method: "DELETE",
  });
}

