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

export class RightPipe extends Ground {
    constructor(x: number, y: number, level: Level) {
        var blocking = GroundBlocking.right + GroundBlocking.bottom;
        super(x, y, blocking, level);
        this.setImage(images.objects, 36, 390);
    }
}