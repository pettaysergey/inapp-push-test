export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("my-sw-db", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("store")) {
        db.createObjectStore("store");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveValue(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("store", "readwrite");
    const store = tx.objectStore("store");

    store.put(value, key);

    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
  });
}

export async function readValue(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("store", "readonly");
    const store = tx.objectStore("store");

    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
