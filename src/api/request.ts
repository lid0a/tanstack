export async function request<T>(
  endpoint: string,
  params: Record<
    string,
    | string
    | number
    | boolean
    | undefined
    | null
    | Array<string | number | boolean | undefined | null>
  > = {},
  config: Omit<RequestInit, "body"> & { body?: object } = {},
) {
  const url = new URL(endpoint, "https://dummyjson.com");
  const searchParams = new URLSearchParams();
  searchParams.set("timestamp", String(Date.now()));
  const headers = new Headers(config.headers);
  headers.append("content-type", "application/json");
  for (const name in params) {
    const value = params[name];
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) {
          searchParams.append(name, item.toString());
        }
      }
    } else if (value !== undefined && value !== null) {
      searchParams.set(name, value.toString());
    }
  }
  url.search = searchParams.toString();
  const response = await fetch(url, {
    ...config,
    headers,
    body: JSON.stringify(config.body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    if ("message" in errorData) {
      throw new Error(errorData.message);
    }
    throw new Error(String(errorData));
  }
  return (await response.json()) as T;
}
