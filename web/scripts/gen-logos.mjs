import fs from 'node:fs';
import path from 'node:path';

const logos = [
	['uniteti', '#1d3557', 'U'],
	['drenica', '#003049', 'D'],
	['feronikeli', '#004b23', 'F'],
	['malisheva', '#2b9348', 'M'],
	['dukagjini', '#003566', 'D'],
	['vushtrria', '#14213d', 'V'],
	['pogradeci', '#003049', 'P'],
	['burreli', '#6a040f', 'B'],
	['teuta', '#003566', 'T'],
	['egnatia', '#004b23', 'E'],
	['partizani', '#6a040f', 'P'],
	['tirana', '#003049', 'T'],
	['vllaznia', '#003049', 'V'],
	['horizonti', '#003049', 'H'],
	['shkupi', '#003049', 'S'],
	['buducnost', '#003049', 'B'],
	['zrinjski', '#6a040f', 'Z'],
	['sarajevo', '#6a040f', 'S'],
	['delemont', '#003049', 'D'],
	['xamax', '#000000', 'X'],
	['wil', '#004b23', 'W'],
	['petrolul', '#004b23', 'P'],
	['uta-arad', '#6a040f', 'U'],
	['arges', '#6a040f', 'A'],
	['rijeka', '#6a040f', 'R'],
	['lokomotiva', '#004b23', 'L'],
	['slaven', '#003049', 'S'],
	['istra', '#ffd60a', 'I'],
	['klagenfurt', '#6a040f', 'K'],
	['puskas', '#004b23', 'P'],
	['cska-sofia', '#6a040f', 'C'],
	['spartak-trnava', '#6a040f', 'S'],
	['rapid-buc', '#7f0019', 'R'],
	['dinamo-zg', '#003049', 'D'],
	['brondby', '#004b23', 'B'],
	['gent', '#004b23', 'G'],
	['lech', '#003049', 'L'],
	['lecce', '#ffd60a', 'L'],
	['augsburg', '#6a040f', 'A'],
	['getafe', '#003049', 'G'],
	['napoli', '#0077b6', 'N'],
	['leverkusen', '#6a040f', 'B'],
	['sevilla', '#ffffff', 'S'],
	['inter', '#003049', 'I'],
	['milan', '#6a040f', 'M'],
	['dortmund', '#ffd60a', 'D']
];

const dir = path.join(import.meta.dirname, '..', 'static', 'logos');

for (const [id, fill, letter] of logos) {
	const textFill = fill === '#ffffff' || fill === '#ffd60a' ? '#003049' : '#fff';
	const svg = [
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
		`  <circle cx="32" cy="32" r="30" fill="${fill}"/>`,
		`  <text x="32" y="38" text-anchor="middle" fill="${textFill}" font-size="16" font-weight="bold" font-family="sans-serif">${letter}</text>`,
		'</svg>'
	].join('\n');
	fs.writeFileSync(path.join(dir, `${id}.svg`), svg);
}

console.log(`Created ${logos.length} logos in ${dir}`);
