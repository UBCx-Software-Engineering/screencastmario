import {Matter} from '../matter/Matter';
import {Level} from '../engine/Level';
import {ItemFigure} from './ItemFigure';
import {Figure} from '../figures/Figure';
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

export class Item extends Matter {
    isBouncing: boolean;
    bounceFrames: number;
    bounceStep: number;
    bounceDir: number;
    bounceCount: number;
    activated: boolean;
    isBlocking: boolean;

    constructor(x: number, y: number, isBlocking: boolean, level: Level) {
        super(x, y, isBlocking ? GroundBlocking.all : GroundBlocking.none, level);
        this.isBouncing = false;
        this.bounceCount = 0;
        this.bounceFrames = Math.floor(50 / setup.interval);
        this.bounceStep = Math.ceil(10 / this.bounceFrames);
        this.bounceDir = 1;
        this.isBlocking = isBlocking;
        this.activated = false;
        this.addToany(level);
    }

    addToany(level: Level) {
        level.items.push(this);
    }

    activate(from: Figure) {
        this.activated = true;
    }

    bounce() {
        this.isBouncing = true;

        for (var i = this.level.figures.length; i--;) {
            var fig = this.level.figures[i];

            if (fig.y === this.y + 32 && fig.x >= this.x - 16 && fig.x <= this.x + 16) {
                if (fig instanceof ItemFigure)
                    fig.setVelocity(fig.vx, setup.bounce);
                else
                    fig.die();
            }
        }
    }

    playFrame() {
        if (this.isBouncing) {
            this.view.css({'bottom': (this.bounceDir > 0 ? '+' : '-') + '=' + this.bounceStep + 'px'});
            this.bounceCount += this.bounceDir;

            if (this.bounceCount === this.bounceFrames)
                this.bounceDir = -1;
            else if (this.bounceCount === 0) {
                this.bounceDir = 1;
                this.isBouncing = false;
            }
        }

        super.playFrame();
    }
}
