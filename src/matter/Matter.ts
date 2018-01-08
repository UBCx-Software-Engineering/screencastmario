import {Level} from '../engine/Level';
import {Base} from '../engine/Base';
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

export class Matter extends Base {
    blocking: GroundBlocking;
    level: Level;

    constructor(x: number, y: number, blocking: GroundBlocking, level: Level) {
        super(x, y);
        this.blocking = blocking;
        this.view = $('<div />').addClass('matter').appendTo(level.world);
        this.level = level;
        // super was here
        super.init();
        this.setSize(32, 32);
        this.addToGrid(level);
    }

    addToGrid(level: Level) {
        level.obstacles[this.x / 32][this.level.getGridHeight() - 1 - this.y / 32] = this;
    }

    setImage(img: string, x: number = 0, y: number = 0) {
        if (typeof this.view !== 'undefined') {
            this.view.css({
                backgroundImage:    img ? img.toUrl() : 'none',
                backgroundPosition: '-' + x + 'px -' + y + 'px',
            });
        } else {
            console.log('Matter::setImage - this.view not defined yet');
        }
        super.setImage(img, x, y);
    }

    setPosition(x: number, y: number) {
        if (typeof this.view !== 'undefined') {
            this.view.css({
                left:   x,
                bottom: y
            });
        } else {
            console.log('Matter::setPosition - this.view not defined yet');
        }
        super.setPosition(x, y);
    }
}
