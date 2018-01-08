interface Math {
	sign(x: number): number;
}

interface String {
	toUrl(): string;
}

interface Settings {
	state?: number;
	marioState?: number;
	lifes?: number;
	coins?: number;
	musicOn?: boolean;
}

interface LevelFormat {
	width: number;
	height: number;
	id: number;
	background: number;
	data: string[][];
}

interface Point {
	x: number;
	y: number;
}

interface GridPoint {
	i: number;
	j: number;
}

interface Size {
	width: number;
	height: number;
}

interface Picture extends Point {
	path: string;
}

interface SoundManager {
	play(label: string): void;
	sideMusic(label: string): void;
}

interface DeathAnimation {
	deathDir: number;
	deathFrames: number;
	deathStepUp: number;
	deathStepDown: number;
	deathCount: number;
}