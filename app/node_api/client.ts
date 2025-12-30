// Backend local test ortamında çalışırken kullanılan base URL
//const BASE_URL = "http://localhost:3000";

// Live ortam
const BASE_URL = "http://lasttik.com";

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  // LocalStoragedan tokeni al
  const token = localStorage.getItem("token");

  // fetch isteği
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    body: options.body ?? undefined,
  });

  //  response parse
  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // Hata kontrolü
  if (!response.ok) {
    throw new Error(
      data?.message || 
      data?.error ||
      `API Hatası (status: ${response.status})`
    );
  }

  // Başarılı response
  return data as T;
}
