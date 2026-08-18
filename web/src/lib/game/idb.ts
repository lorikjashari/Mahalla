const DB_NAME = 'mahalla-db';
const DB_VERSION = 1;
const STORE = 'kv';

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onerror = () => reject(req.error);
		req.onsuccess = () => resolve(req.result);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) {
				db.createObjectStore(STORE);
			}
		};
	});
}

async function idbGet(key: string): Promise<string | null> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, 'readonly');
		const req = tx.objectStore(STORE).get(key);
		req.onerror = () => reject(req.error);
		req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
		tx.oncomplete = () => db.close();
	});
}

async function idbSet(key: string, value: string): Promise<void> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, 'readwrite');
		const req = tx.objectStore(STORE).put(value, key);
		req.onerror = () => reject(req.error);
		tx.oncomplete = () => {
			db.close();
			resolve();
		};
	});
}

async function idbDelete(key: string): Promise<void> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, 'readwrite');
		const req = tx.objectStore(STORE).delete(key);
		req.onerror = () => reject(req.error);
		tx.oncomplete = () => {
			db.close();
			resolve();
		};
	});
}

export async function idbGetItem(key: string): Promise<string | null> {
	if (typeof indexedDB === 'undefined') return null;
	try {
		return await idbGet(key);
	} catch {
		return null;
	}
}

export async function idbSetItem(key: string, value: string): Promise<void> {
	if (typeof indexedDB === 'undefined') return;
	await idbSet(key, value);
}

export async function idbRemoveItem(key: string): Promise<void> {
	if (typeof indexedDB === 'undefined') return;
	await idbDelete(key);
}

/** Migron ruajtjet e vjetra nga localStorage në IndexedDB */
export async function migrateLocalStorageToIdb(keys: string[]): Promise<void> {
	if (typeof localStorage === 'undefined') return;
	for (const key of keys) {
		const legacy = localStorage.getItem(key);
		if (!legacy) continue;
		const existing = await idbGetItem(key);
		if (!existing) await idbSetItem(key, legacy);
		localStorage.removeItem(key);
	}
}
