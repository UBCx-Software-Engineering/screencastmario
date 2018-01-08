import {Plant} from './Plant';
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

export class PipePlant extends Plant {
    deathFramesExtended: number;
    deathFramesExtendedActive: boolean;
    minimum: number;
    bottom: number;
    top: number;

    constructor(x: number, y: number, level: any) {
        super(x + 16, y - 6, level);
        this.bottom = y - 48;
        this.top = y - 6;
        this.setDirection(Direction.down);
        this.setImage(images.enemies, 0, 56);
        this.deathFrames = Math.floor(250 / setup.interval);
        this.deathFramesExtended = 6;
        this.deathFramesExtendedActive = false;
        this.deathStep = Math.ceil(100 / this.deathFrames);
        this.deathDir = 1;
        this.deathCount = 0;
        this.view.css('z-index', 95);
    }

    setDirection(dir: Direction) {
        this.direction = dir;
    }

    setPosition(x: number, y: number) {
        if (y === this.bottom || y === this.top) {
            this.minimum = setup.pipeplant_count;
            this.setDirection(this.direction === Direction.up ? Direction.down : Direction.up);
        }

        super.setPosition(x, y);
    }

    blocked() {
        if (this.y === this.bottom) {
            var state = false;
            this.y += 48;

            for (var i = this.level.figures.length; i--;) {
                if (this.level.figures[i] != this && this.q2q(this.level.figures[i])) {
                    state = true;
                    break;
                }
            }

            this.y -= 48;
            return state;
        }

        return false;
    }

    move() {
        if (this.minimum === 0) {
            if (!this.blocked())
                this.setPosition(this.x, this.y - (this.direction - 3) * setup.pipeplant_v);
        } else
            this.minimum--;
    }

    die() {
        super.die();
        this.setImage(images.enemies, 68, 56);
    }

    death() {
        if (this.deathFramesExtendedActive) {
            this.setPosition(this.x, this.y - 8);
            return !!(--this.deathFramesExtended);
        }

        this.view.css({'bottom': (this.deathDir > 0 ? '+' : '-') + '=' + this.deathStep + 'px'});
        this.deathCount += this.deathDir;

        if (this.deathCount === this.deathFrames)
            this.deathDir = -1;
        else if (this.deathCount === 0)
            this.deathFramesExtendedActive = true;

        return true;
    }
}
;