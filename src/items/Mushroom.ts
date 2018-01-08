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

export class Mushroom extends ItemFigure {
    mode: MushroomMode;
    active: boolean;
    released: number;

    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
        this.active = false;
        this.setSize(32, 32);
        this.setImage(images.objects, 582, 60);
        this.released = 0;
        this.view.css('z-index', 94).hide();
    }

    release(mode: MushroomMode) {
        this.released = 4;
        this.level.playSound('mushroom');

        if (mode === MushroomMode.plant)
            this.setImage(images.objects, 548, 60);

        this.mode = mode;
        this.view.show();
    }

    move() {
        if (this.active) {
            super.move();

            if (this.mode === MushroomMode.mushroom && this.vx === 0)
                this.setVelocity(this.direction === Direction.right ? -setup.mushroom_v : setup.mushroom_v, this.vy);
        } else if (this.released) {
            this.released--;
            this.setPosition(this.x, this.y + 8);

            if (!this.released) {
                this.active = true;
                this.view.css('z-index', 99);

                if (this.mode === MushroomMode.mushroom)
                    this.setVelocity(setup.mushroom_v, setup.gravity);
            }
        }
    }

    hit(opponent: Figure) {
        if (this.active && opponent instanceof Mario) {
            if (this.mode === MushroomMode.mushroom)
                (<Mario>opponent).grow();
            else if (this.mode === MushroomMode.plant)
                (<Mario>opponent).shooter();

            this.die();
        }
    }
}
