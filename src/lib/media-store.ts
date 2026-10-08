/**
 * Durable storage for user recordings.
 *
 * A `blob:` URL from `URL.createObjectURL` is scoped to the document that made
 * it — it is dead the moment the page reloads. Writing one into localStorage
 * (which is what this app used to do) produces a post that survives but whose
 * audio silently 404s forever after.
 *
 * So the blob itself goes into IndexedDB, keyed by post id, and only the key is
 * written to localStorage. Object URLs are minted per session and revoked when
 * the provider unmounts.
 */

const DB_NAME = "roots-sa-media";
const DB_VERSION = 1;
const STORE = "recordings";

function supported() {
  return typeof indexedDB !== "undefined";
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T | null> {
  if (!supported()) return null;
  try {
    const db = await open();
    return await new Promise<T | null>((resolve) => {
      const t = db.transaction(STORE, mode);
      const req = fn(t.objectStore(STORE));
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
      t.oncomplete = () => db.close();
    });
  } catch {
    return null;
  }
}

export async function putMedia(key: string, blob: Blob): Promise<boolean> {
  const res = await tx("readwrite", (s) => s.put(blob, key) as IDBRequest<IDBValidKey>);
  return res !== null;
}

export async function getMedia(key: string): Promise<Blob | null> {
  return (await tx<Blob>("readonly", (s) => s.get(key) as IDBRequest<Blob>)) ?? null;
}

export async function deleteMedia(key: string): Promise<void> {
  await tx("readwrite", (s) => s.delete(key) as unknown as IDBRequest<undefined>);
}

export async function clearMedia(): Promise<void> {
  await tx("readwrite", (s) => s.clear() as unknown as IDBRequest<undefined>);
}

export async function listMediaKeys(): Promise<string[]> {
  const keys = await tx<IDBValidKey[]>("readonly", (s) => s.getAllKeys() as IDBRequest<IDBValidKey[]>);
  return (keys ?? []).map(String);
}

/** Total bytes held in the media store, for the storage readout on /saved. */
export async function mediaBytes(): Promise<number> {
  if (!supported()) return 0;
  const keys = await listMediaKeys();
  let total = 0;
  for (const k of keys) {
    const b = await getMedia(k);
    if (b) total += b.size;
  }
  return total;
}

export const mediaSupported = supported;
