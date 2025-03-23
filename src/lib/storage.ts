export function hasItem(item: string): boolean {
  return sessionStorage.getItem(item) !== null;
}

export function getItem<T>(id: string): T | null {
  const sessionItem = sessionStorage.getItem(id);

  return sessionItem === null ? null : JSON.parse(sessionItem);
}

export function setItem<T>(id: string, item: T): void {
  sessionStorage.setItem(id, JSON.stringify(item));
}
