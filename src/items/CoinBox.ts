import {Level} from '../engine/Level';
import {Mario} from '../figures/Mario';
import {Item} from './Item';
import {CoinBoxCoin} from './CoinBoxCoin';
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

export class CoinBox extends Item {
    items: CoinBoxCoin[];
    actors: CoinBoxCoin[];

    constructor(x: number, y: number, level: Level, amount: number = 1) {
        super(x, y, true, level);
        this.setImage(images.objects, 346, 328);
        this.setAmount(amount);
    }

    setAmount(amount: number) {
        this.items = [];
        this.actors = [];

        for (var i = 0; i < amount; i++)
            this.items.push(new CoinBoxCoin(this.x, this.y, this.level));
    }

    activate(from: Mario) {
        if (!this.isBouncing) {
            if (this.items.length) {
                this.bounce();
                var coin = this.items.pop();
                coin.activate(from);
                this.actors.push(coin);

                if (!this.items.length)
                    this.setImage(images.objects, 514, 194);
            }
        }

        super.activate(from);
    }

    playFrame() {
        for (var i = this.actors.length; i--;) {
            if (this.actors[i].act()) {
                this.actors[i].view.remove();
                this.actors.splice(i, 1);
            }
        }

        super.playFrame();
    }
}
;