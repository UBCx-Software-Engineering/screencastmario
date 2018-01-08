import {Level} from '../engine/Level';
import {Base} from '../engine/Base';
import {Item} from '../items/Item';
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

export class Figure extends Base implements GridPoint {
    dx: number = 0;
    dy: number = 0;
    onground: boolean = true;
    dead: boolean = false;
    vx: number;
    vy: number;
    level: Level;
    state: SizeState;
    direction: Direction;
    i: number;
    j: number;
    cw: number;
    ch: number;

    constructor(x: number, y: number, level: Level) {
        super(x, y, function(f = <Figure>this){
            f.state = SizeState.small;
            f.cw = 32;
            f.ch = f.state * 32;});
        this.view = $('<div />').addClass('figure').appendTo(level.world);

        this.level = level;
        super.init();
        level.figures.push(this);
    }


    init() {
        this.dx = 0;
        this.dy = 0;
        this.dead = false;
        this.onground = true;
        this.setState(SizeState.small);
        this.setVelocity(0, 0);
        this.direction = Direction.none;
    }

    q2q(opponent: Figure) {
        if (this.x > opponent.x + opponent.cw)
            return false;
        else if (this.x < opponent.x - this.cw)
            return false;
        else if (this.y - 4 < opponent.y - this.ch)
            return false;
        else if (this.y + 4 > opponent.y + opponent.ch)
            return false;

        return true;
    }

    setState(state: SizeState) {
        this.state = state;
        this.cw = 32;
        this.ch = this.state * 32;
    }

    hurt(opponent: Figure) {
    }

    store(settings: Settings) {
    }

    restore(settings: Settings) {
    }

    setImage(img: string, x: number = 0, y: number = 0) {
        this.view.css({
            backgroundImage:    img ? img.toUrl() : 'none',
            backgroundPosition: '-' + x + 'px -' + y + 'px',
        });
        super.setImage(img, x, y);
    }

    setOffset(dx: number, dy: number) {
        this.dx = dx;
        this.dy = dy;
        this.setPosition(this.x, this.y);
    }

    setPosition(x: number, y: number) {
        if (typeof this.view !== 'undefined') {
            this.view.css({
                left:         x,
                bottom:       y,
                marginLeft:   this.dx,
                marginBottom: this.dy,
            });
        } else {
            console.log('Figure::setPosition - this.view not defined yet');
        }
        super.setPosition(x, y);
        this.setGridPosition(x, y);


    }

    setSize(width: number, height: number) {

        if (typeof this.view !== 'undefined') {
            this.view.css({
                width:  width,
                height: height
            });

        } else {
            console.log('Figure::setSize - this.view not defined yet');
        }
        super.setSize(width, height);
    }

    setGridPosition(x: number, y: number) {
        this.i = Math.floor((x + 16) / 32);
        this.j = Math.ceil(this.level.getGridHeight() - 1 - y / 32);

        if (this.j > this.level.getGridHeight())
            this.die();
    }

    getGridPosition(x: number, y: number): GridPoint {
        return {i: this.i, j: this.j};
    }

    setVelocity(vx: number, vy: number) {
        this.vx = vx;
        this.vy = vy;

        if (vx > 0)
            this.direction = Direction.right;
        else if (vx < 0)
            this.direction = Direction.left;
    }

    getVelocity() {
        return {vx: this.vx, vy: this.vy};
    }

    hit(opponent: Figure) {
    }

    trigger(obj: Item) {
    }

    collides(is: number, ie: number, js: number, je: number, blocking: GroundBlocking) {
        if (is < 0 || ie >= this.level.obstacles.length)
            return true;

        if (js < 0 || je >= this.level.getGridHeight())
            return false;

        for (var i = is; i <= ie; i++) {
            for (var j = je; j >= js; j--) {
                var obj = this.level.obstacles[i][j];

                if (obj) {
                    if (obj instanceof Item && (blocking === GroundBlocking.bottom || obj.blocking === GroundBlocking.none))
                        this.trigger(<Item>obj);

                    if ((obj.blocking & blocking) === blocking)
                        return true;
                }
            }
        }

        return false;
    }

    move() {
        var vx = this.vx;
        var vy = this.vy - setup.gravity;

        var s = this.state;

        var x = this.x;
        var y = this.y;

        var dx = Math.sign(vx);
        var dy = Math.sign(vy);

        var is = this.i;
        var ie = is;

        var js = Math.ceil(this.level.getGridHeight() - s - (y + 31) / 32);
        var je = this.j;

        var d = 0, b = GroundBlocking.none;
        var onground = false;
        var t = Math.floor((x + 16 + vx) / 32);

        if (dx > 0) {
            d = t - ie;
            t = ie;
            b = GroundBlocking.left;
        } else if (dx < 0) {
            d = is - t;
            t = is;
            b = GroundBlocking.right;
        }

        x += vx;

        for (var i = 0; i < d; i++) {
            if (this.collides(t + dx, t + dx, js, je, b)) {
                vx = 0;
                x = t * 32 + 15 * dx;
                break;
            }

            t += dx;
            is += dx;
            ie += dx;
        }

        if (dy > 0) {
            t = Math.ceil(this.level.getGridHeight() - s - (y + 31 + vy) / 32);
            d = js - t;
            t = js;
            b = GroundBlocking.bottom;
        } else if (dy < 0) {
            t = Math.ceil(this.level.getGridHeight() - 1 - (y + vy) / 32);
            d = t - je;
            t = je;
            b = GroundBlocking.top;
        } else
            d = 0;

        y += vy;

        for (var i = 0; i < d; i++) {
            if (this.collides(is, ie, t - dy, t - dy, b)) {
                onground = dy < 0;
                vy = 0;
                y = this.level.height - (t + 1) * 32 - (dy > 0 ? (s - 1) * 32 : 0);
                break;
            }

            t -= dy;
        }

        this.onground = onground;
        this.setVelocity(vx, vy);
        this.setPosition(x, y);
    }

    death() {
        return false;
    }

    die() {
        this.dead = true;
    }
}
;
