export var basepath = '/';

export enum Direction {
    none = 0,
    left = 1,
    up = 2,
    right = 3,
    down = 4,
}

export enum MarioState {
    normal = 0,
    fire = 1,
}

export enum SizeState {
    small = 1,
    big = 2,
}

export enum GroundBlocking {
    none = 0,
    left = 1,
    top = 2,
    right = 4,
    bottom = 8,
    all = 15,
}

export enum CollisionType {
    none = 0,
    horizontal = 1,
    vertical = 2,
}

export enum DeathMode {
    normal = 0,
    shell = 1,
}

export enum MushroomMode {
    mushroom = 0,
    plant = 1,
}

export var images = {
    enemies: basepath + 'mario-enemies.png',
    sprites: basepath + 'mario-sprites.png',
    objects: basepath + 'mario-objects.png',
    peach:   basepath + 'mario-peach.png',
}

export var setup = {
    interval:        20,
    bounce:          15,
    cooldown:        20,
    gravity:         2,
    start_lives:     3,
    max_width:       400,
    max_height:      15,
    jumping_v:       27,
    walking_v:       5,
    mushroom_v:      3,
    ballmonster_v:   2,
    spiked_turtle_v: 1.5,
    small_turtle_v:  3,
    big_turtle_v:    2,
    shell_v:         10,
    shell_wait:      25,
    star_vx:         4,
    star_vy:         16,
    bullet_v:        12,
    max_coins:       100,
    pipeplant_count: 150,
    pipeplant_v:     1,
    invincible:      11000,
    invulnerable:    1000,
    blinkfactor:     5,
}