export const searchParamsStorage = {
  getItem(key: string) {
    const { searchParams } = new URL(location.href);
    return searchParams.get(key);
  },
  setItem(key: string, value: string) {
    const { searchParams } = new URL(location.href);
    searchParams.set(key, value);
    history.replaceState({}, "", `${location.pathname}?${searchParams}`);
  },
  removeItem(key: string) {
    const { searchParams } = new URL(location.href);
    searchParams.delete(key);
    history.replaceState({}, "", `${location.pathname}?${searchParams}`);
  },
};
