import {Level} from "../engine/Level";
import {Turtle} from "./Turtle";
import {Figure} from "./Figure";
import {TurtleShell} from "./TurtleShell";
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

export class GreenTurtle extends Turtle {
    wait: number;
    walkSprites: Point[][];

    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
        this.walkSprites = [
            [{x: 34, y: 382}, {x: 0, y: 437}],
            [{x: 34, y: 266}, {x: 0, y: 325}]
        ];
        this.wait = 0;
        this.deathMode = DeathMode.normal;
        this.deathFrames = Math.floor(250 / setup.interval);
        this.deathStepUp = Math.ceil(150 / this.deathFrames);
        this.deathStepDown = Math.ceil(182 / this.deathFrames);
        this.deathDir = 1;
        this.deathCount = 0;
        this.setSize(34, 54);
        this.setShell(new TurtleShell(x, y, level));
    }

    setShell(shell: TurtleShell) {
        if (this.shell || this.wait)
            return false;

        this.shell = shell;
        shell.hide();
        this.setState(SizeState.big);
        return true;
    }

    setState(state: SizeState) {
        super.setState(state);

        if (state === SizeState.big)
            this.setSpeed(setup.big_turtle_v);
        else
            this.setSpeed(setup.small_turtle_v);
    }

    setVelocity(vx: number, vy: number) {
        super.setVelocity(vx, vy);
        var rewind = this.direction === Direction.right;
        var coords = this.walkSprites[this.state - 1][rewind ? 1 : 0];
        var label = Math.sign(vx) + '-' + this.state;

        if (!this.setupFrames(6, 2, rewind, label))
            this.setImage(images.enemies, coords.x, coords.y);
    }

    die() {
        super.die();
        this.clearFrames();

        if (this.deathMode === DeathMode.normal) {
            this.deathFrames = Math.floor(600 / setup.interval);
            this.setImage(images.enemies, 102, 437);
        } else if (this.deathMode === DeathMode.shell) {
            this.level.playSound('shell');
            this.setImage(images.enemies, 68, (this.state === SizeState.small ? (this.direction === Direction.right ? 437 : 382) : 325));
        }
    }

    death() {
        if (this.deathMode === DeathMode.normal)
            return !!(--this.deathFrames);

        this.view.css({'bottom': (this.deathDir > 0 ? '+' : '-') + '=' + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + 'px'});
        this.deathCount += this.deathDir;

        if (this.deathCount === this.deathFrames)
            this.deathDir = -1;
        else if (this.deathCount === 0)
            return false;

        return true;
    }

    move() {
        if (this.wait)
            this.wait--;

        super.move();
    }

    hurt(opponent: Figure) {
        this.level.playSound('enemy_die');

        if (this.state === SizeState.small)
            return this.die();

        this.wait = setup.shell_wait
        this.setState(SizeState.small);
        this.shell.activate(this.x, this.y);
        this.shell = undefined;
    }
}
;