import {Matter} from './Matter';
import {Level} from '../engine/Level';
import {
    basepath,
    Direction,
    MarioState,
    SizeState,
    GroundBlocking,
    CollisionType,
    DeathMode,
    MushroomMode,
    images,
    setup
} from '../engine/constants'

export class Ground extends Matter {
    constructor(x: number, y: number, blocking: GroundBlocking, level: Level) {
        super(x, y, blocking, level);
    }
}
;