import {Enemy} from './Enemy';
import {Figure} from './Figure';
import {Mario} from './Mario';
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

export class Plant extends Enemy {
    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
        this.setSize(34, 42);
        this.setupFrames(5, 2, true);
        this.setImage(images.enemies, 0, 3);
    }

    setVelocity(vx: number, vy: number) {
        super.setVelocity(0, 0);
    }

    die() {
        this.level.playSound('shell');
        this.clearFrames();
        super.die();
    }

    hit(opponent: Figure) {
        if (this.invisible)
            return;

        if (opponent instanceof Mario)
            opponent.hurt(this);
    }
}
;