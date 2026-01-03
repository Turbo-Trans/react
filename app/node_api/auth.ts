import { request } from "./client";

export interface LoginResponse {
  message: string;
  token: string;
  user: any; 
}

export function login(username: string, password: string): Promise<LoginResponse> {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logout(): Promise<{message: string}>{
  return request("/logout", {
    method: "POST",
  });
}


