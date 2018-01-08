import {Level} from '../engine/Level';
import {Ground} from './Ground';
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

export class LeftTopPipe extends Ground {
    constructor(x: number, y: number, level: Level) {
        var blocking = GroundBlocking.all;
        super(x, y, blocking, level);
        this.setImage(images.objects, 2, 358);
    }
}