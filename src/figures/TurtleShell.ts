import {Figure} from './Figure';
import {Enemy} from './Enemy';
import {Turtle} from './Turtle';
import {GreenTurtle} from './GreenTurtle';
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

export class TurtleShell extends Enemy {
    idle: number;

    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
        this.setSize(34, 32);
        this.speed = 0;
        this.setImage(images.enemies, 0, 494);
    }

    activate(x: number, y: number) {
        this.setupFrames(6, 4, false)
        this.setPosition(x, y);
        this.show();
    }

    takeBack(where: Turtle) {
        if (where.setShell(this))
            this.clearFrames();
    }

    hit(opponent: Figure) {
        if (this.invisible)
            return;

        if (this.vx) {
            if (this.idle)
                this.idle--;
            else
                opponent.hurt(this);
        } else {
            if (opponent instanceof Mario) {
                this.setSpeed(opponent.direction === Direction.right ? -setup.shell_v : setup.shell_v);
                opponent.setVelocity(opponent.vx, setup.bounce);
                this.idle = 2;
            } else if (opponent instanceof GreenTurtle && opponent.state === SizeState.small)
                this.takeBack(<GreenTurtle>opponent);
        }
    }

    collides(is: number, ie: number, js: number, je: number, blocking: GroundBlocking) {
        if (is < 0 || ie >= this.level.obstacles.length)
            return true;

        if (js < 0 || je >= this.level.getGridHeight())
            return false;

        for (var i = is; i <= ie; i++) {
            for (var j = je; j >= js; j--) {
                var obj = this.level.obstacles[i][j];

                if (obj && ((obj.blocking & blocking) === blocking))
                    return true;
            }
        }

        return false;
    }
}
;