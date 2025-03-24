export function sessionHasItem(item: string): boolean {
  return sessionStorage.getItem(item) !== null;
}

export function sessionGetItem<T>(id: string): T | null {
  const sessionItem = sessionStorage.getItem(id);

  return sessionItem === null ? null : JSON.parse(sessionItem);
}

export function sessionSetItem<T>(id: string, item: T): void {
  sessionStorage.setItem(id, JSON.stringify(item));
}

export function localHasItem(item: string): boolean {
  return onClient() ? localStorage.getItem(item) !== null : false;
}

export function localGetItem<T>(id: string): T | null {
  if (onClient()) {
    const sessionItem = localStorage.getItem(id);

    return sessionItem === null ? null : JSON.parse(sessionItem);
  } else {
    return null;
  }
}

export function localSetItem<T>(id: string, item: T): void {
  if (onClient()) {
    localStorage.setItem(id, JSON.stringify(item));
  }
}

function onClient(): boolean {
  return typeof window !== "undefined";
}
