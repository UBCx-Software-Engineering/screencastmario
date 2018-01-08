import {Ground} from './Ground';
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

export class LeftGrass extends Ground {
    constructor(x: number, y: number, level: Level) {
        var blocking = GroundBlocking.left;
        super(x, y, blocking, level);
        this.setImage(images.objects, 854, 438);
    }
}
