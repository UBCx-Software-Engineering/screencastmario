import {Turtle} from './Turtle';
import {Mario} from './Mario';
import {Figure} from './Figure';
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

export class SpikedTurtle extends Turtle {
    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
        this.setSize(34, 32);
        this.setSpeed(setup.spiked_turtle_v);
        this.deathFrames = Math.floor(250 / setup.interval);
        this.deathStepUp = Math.ceil(150 / this.deathFrames);
        this.deathStepDown = Math.ceil(182 / this.deathFrames);
        this.deathDir = 1;
        this.deathCount = 0;
    }

    setVelocity(vx: number, vy: number) {
        super.setVelocity(vx, vy);

        if (this.direction === Direction.left) {
            if (!this.setupFrames(4, 2, true, 'LeftWalk'))
                this.setImage(images.enemies, 0, 106);
        } else {
            if (!this.setupFrames(6, 2, false, 'RightWalk'))
                this.setImage(images.enemies, 34, 147);
        }
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

    die() {
        this.level.playSound('shell');
        this.clearFrames();
        super.die();
        this.setImage(images.enemies, 68, this.direction === Direction.left ? 106 : 147);
    }

    hit(opponent: Figure) {
        if (this.invisible)
            return;

        if (opponent instanceof Mario)
            (<Mario>opponent).hurt(this);
    }
}
