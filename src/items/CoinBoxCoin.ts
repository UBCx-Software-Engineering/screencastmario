import {Coin} from './Coin';
import {Level} from '../engine/Level';
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

export class CoinBoxCoin extends Coin {
    count: number;
    step: number;

    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
        this.setImage(images.objects, 96, 0);
        this.clearFrames();
        this.view.hide();
        this.count = 0;
        this.frames = Math.floor(150 / setup.interval);
        this.step = Math.ceil(30 / this.frames);
    }

    remove() {
    }

    addToGrid() {
    }

    addToany() {
    }

    activate(from: Mario) {
        super.activate(from);
        this.view.show().css({'bottom': '+=8px'});
    }

    act() {
        this.view.css({'bottom': '+=' + this.step + 'px'});
        this.count++;
        return (this.count === this.frames);
    }
}
;