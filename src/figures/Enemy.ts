import {Figure} from './Figure';
import {TurtleShell} from './TurtleShell';
import {Mario} from './Mario';
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

export class Enemy extends Figure implements DeathAnimation {
    speed: number;
    invisible: boolean;
    deathMode: DeathMode;
    deathStep: number;
    deathCount: number;
    deathDir: number;
    deathFrames: number;
    deathStepUp: number;
    deathStepDown: number;

    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
        this.speed = 0;
        this.deathMode = DeathMode.normal;
        this.deathCount = 0;
    }

    hide() {
        this.invisible = true;
        this.view.hide();
    }

    show() {
        this.invisible = false;
        this.view.show();
    }

    move() {
        if (!this.invisible) {
            super.move();

            if (this.vx === 0) {
                var s = this.speed * Math.sign(this.speed);
                this.setVelocity(this.direction === Direction.right ? -s : s, this.vy);
            }
        }
    }

    collides(is: number, ie: number, js: number, je: number, blocking: GroundBlocking) {
        if (this.j + 1 < this.level.getGridHeight()) {
            for (var i = is; i <= ie; i++) {
                if (i < 0 || i >= this.level.getGridWidth())
                    return true;

                var obj = this.level.obstacles[i][this.j + 1];

                if (!obj || (obj.blocking & GroundBlocking.top) !== GroundBlocking.top)
                    return true;
            }
        }

        return super.collides(is, ie, js, je, blocking);
    }

    setSpeed(v: number) {
        this.speed = v;
        this.setVelocity(-v, 0);
    }

    hurt(from: Figure) {
        if (from instanceof TurtleShell)
            this.deathMode = DeathMode.shell;

        this.die();
    }

    hit(opponent: Figure) {
        if (this.invisible)
            return;

        if (opponent instanceof Mario) {
            if (opponent.vy < 0 && opponent.y - opponent.vy >= this.y + this.state * 32) {
                opponent.setVelocity(opponent.vx, setup.bounce);
                this.hurt(opponent);
            } else {
                opponent.hurt(this);
                console.log(" vy: " + opponent.vy + " y: " + opponent.y + " this.y: " + this.y + " this.state: " + this.state + " height: " + this.getSize()["height"]);
            }
        }
    }
}
;