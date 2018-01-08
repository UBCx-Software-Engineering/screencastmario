import {Figure} from './Figure';
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

export class Bullet extends Figure {
    parent: Figure;
    life: number;
    speed: number;

    constructor(parent: Figure) {
        super(parent.x + 31, parent.y + 14, parent.level);
        this.parent = parent;
        this.setImage(images.sprites, 191, 366);
        this.setSize(16, 16);
        this.direction = parent.direction;
        this.vy = 0;
        this.life = Math.ceil(2000 / setup.interval);
        this.speed = setup.bullet_v;
        this.vx = this.direction === Direction.right ? this.speed : -this.speed;
    }

    setVelocity(vx: number, vy: number) {
        super.setVelocity(vx, vy);

        if (this.vx === 0) {
            var s = this.speed * Math.sign(this.speed);
            this.vx = this.direction === Direction.right ? -s : s;
        }

        if (this.onground)
            this.vy = setup.bounce;
    }

    move() {
        if (--this.life)
            super.move();
        else
            this.die();
    }

    hit(opponent: Figure) {
        if (opponent !== this.parent) {
            opponent.die();
            this.die();
        }
    }
}
;