export function createSeed(): string {
	return Math.random().toString(36).slice(2, 10);
}

export class SeededRng {
	private state: number;

	constructor(seed: string) {
		this.state = hashString(seed);
	}

	next(): number {
		this.state = (this.state * 1664525 + 1013904223) >>> 0;
		return this.state / 0xffffffff;
	}

	int(min: number, max: number): number {
		return Math.floor(this.next() * (max - min + 1)) + min;
	}

	pick<T>(arr: T[]): T {
		return arr[this.int(0, arr.length - 1)];
	}

	chance(p: number): boolean {
		return this.next() < p;
	}
}

function hashString(str: string): number {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
