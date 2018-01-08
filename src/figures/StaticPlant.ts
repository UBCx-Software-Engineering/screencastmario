import {Plant} from './Plant';
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

export class StaticPlant extends Plant {
    constructor(x: number, y: number, level: any) {
        super(x, y, level);
        this.deathFrames = Math.floor(250 / setup.interval);
        this.deathStepUp = Math.ceil(100 / this.deathFrames);
        this.deathStepDown = Math.ceil(132 / this.deathFrames);
        this.deathDir = 1;
        this.deathCount = 0;
    }

    die() {
        super.die();
        this.setImage(images.enemies, 68, 3);
    }

    death() {
        this.view.css({'bottom': (this.deathDir > 0 ? '+' : '-') + '=' + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + 'px'});
        this.deathCount += this.deathDir;

        if (this.deathCount === this.deathFrames)
            this.deathDir = -1;
        else if (this.deathCount === 0)
            return false;

        return true;
    }
}
;