import {Level} from '../engine/Level';
import {ItemFigure} from '../items/ItemFigure';
import {Figure} from '../figures/Figure';
import {Mario} from '../figures/Mario';
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

export class Star extends ItemFigure {
    active: boolean;
    taken: number;

    constructor(x: number, y: number, level: Level) {
        super(x, y + 32, level);
        this.active = false;
        this.setSize(32, 32);
        this.setImage(images.objects, 32, 69);
        this.view.hide();
    }

    release() {
        this.taken = 4;
        this.active = true;
        this.level.playSound('mushroom');
        this.view.show();
        this.setVelocity(setup.star_vx, setup.star_vy);
        this.setupFrames(10, 2, false);
    }

    collides(is: number, ie: number, js: number, je: number, blocking: GroundBlocking) {
        return false;
    }

    move() {
        if (this.active) {
            this.vy += this.vy <= -setup.star_vy ? setup.gravity : setup.gravity / 2;
            super.move();
        }

        if (this.taken)
            this.taken--;
    }

    hit(opponent: Figure) {
        if (!this.taken && this.active && opponent instanceof Mario) {
            (<Mario>opponent).invincible();
            this.die();
        }
    }
}