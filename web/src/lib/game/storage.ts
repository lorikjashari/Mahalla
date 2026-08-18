import { idbGetItem, idbRemoveItem, idbSetItem, migrateLocalStorageToIdb } from '$lib/game/idb';

const SAVE_KEY = 'mahalla.save.v1';
const META_KEY = 'mahalla.meta.v1';
const LEGACY_KEYS = [SAVE_KEY, META_KEY];

let migrated = false;

async function ensureMigrated(): Promise<void> {
	if (migrated || typeof window === 'undefined') return;
	await migrateLocalStorageToIdb(LEGACY_KEYS);
	migrated = true;
}

export async function loadSave(): Promise<string | null> {
	await ensureMigrated();
	return idbGetItem(SAVE_KEY);
}

export async function persistSave(json: string): Promise<void> {
	await idbSetItem(SAVE_KEY, json);
}

export async function clearSave(): Promise<void> {
	await idbRemoveItem(SAVE_KEY);
}

export async function loadMeta(): Promise<string | null> {
	await ensureMigrated();
	return idbGetItem(META_KEY);
}

export async function persistMeta(json: string): Promise<void> {
	await idbSetItem(META_KEY, json);
}

export function exportSave(json: string): void {
	downloadJson(json, `mahalla-${Date.now()}.json`);
}

export function importSaveFromFile(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsText(file);
	});
}

function downloadJson(json: string, filename: string): void {
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
