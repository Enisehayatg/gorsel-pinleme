import { API } from "@/constants/api";
import { Storage } from "@/helpers";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = await Storage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Hatası: ${response.status} - ${errorText}`);
    }
    return response.json();
  }

  public get<T>(endpoint: string): Promise<T> {
    return this.request(endpoint);
  }

  public post<T>(endpoint: string, data: any): Promise<T> {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public put<T>(endpoint: string, data: any): Promise<T> {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: "DELETE" });
  }
}
export default new ApiClient(API.BASE_URL);
