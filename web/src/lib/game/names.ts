export const MALE_NAMES = [
	'Ardit', 'Besart', 'Dion', 'Erion', 'Florian', 'Gent', 'Hysen', 'Ilir', 'Jeton', 'Kushtrim',
	'Liridon', 'Mentor', 'Niman', 'Oltion', 'Petrit', 'Qendrim', 'Rinor', 'Shkumbin', 'Trim', 'Valon'
];

export const FEMALE_NAMES = [
	'Adisa', 'Blerta', 'Dafina', 'Elira', 'Flutura', 'Gresa', 'Hana', 'Ira', 'Jeta', 'Kaltrina',
	'Liridona', 'Mimoza', 'Nita', 'Ornela', 'Pranvera', 'Qendresa', 'Rina', 'Sara', 'Teuta', 'Vesa'
];

export function randomName(gender: 'male' | 'female'): string {
	const pool = gender === 'male' ? MALE_NAMES : FEMALE_NAMES;
	return pool[Math.floor(Math.random() * pool.length)];
}
