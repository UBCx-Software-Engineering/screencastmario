interface Keys {
	bind(): void;
	reset(): void;
	unbind(): void;
	handler(event: KeyboardEvent, status: boolean): void;
	accelerate: boolean;
	left: boolean;
	up: boolean;
	right: boolean;
	down: boolean;
}