import {Matter} from './Matter';
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

export class Decoration extends Matter {
    constructor(x: number, y: number, level: Level) {
        super(x, y, GroundBlocking.none, level);
        level.decorations.push(this);
    }

    setImage(img: string, x: number = 0, y: number = 0) {
        if (typeof this.view !== 'undefined') {
            this.view.css({
                backgroundImage:    img ? img.toUrl() : 'none',
                backgroundPosition: '-' + x + 'px -' + y + 'px',
            });
        } else {
            console.log('Decoration::setImage - this.view not defined yet');
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
            console.log('Decoration::setImage - this.view not defined yet');
        }
        super.setPosition(x, y);
    }
}