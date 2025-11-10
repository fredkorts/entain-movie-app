const BASE = import.meta.env.VITE_API_BASE_URL as string;

export async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const msg = `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}
