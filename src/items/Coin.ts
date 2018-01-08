import {Level} from '../engine/Level';
import {Item} from './Item';
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

export class Coin extends Item {
    constructor(x: number, y: number, level: Level) {
        super(x, y, false, level);
        this.setImage(images.objects, 0, 0);
        this.setupFrames(10, 4, true);
    }

    activate(from: Mario) {
        if (!this.activated) {
            this.level.playSound('coin');
            from.addCoin();
            this.remove();
        }
        super.activate(from);
    }

    remove() {
        this.view.remove();
    }
}
;