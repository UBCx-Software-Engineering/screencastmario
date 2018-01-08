import {Hero} from './Hero';
import {Bullet} from './Bullet';
import {Figure} from './Figure';
import {Level} from '../engine/Level';
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

export class Mario extends Hero implements DeathAnimation {
    deadly: number;
    cooldown: number;
    blinking: number;
    fast: boolean;
    crouching: boolean;
    deathBeginWait: number;
    deathEndWait: number;
    deathDir: number;
    deathCount: number;
    deathFrames: number;
    deathStepUp: number;
    deathStepDown: number;
    invulnerable: number;
    coins: number;
    lifes: number;
    marioState: MarioState;
    standSprites: Point[][][];
    crouchSprites: Point[][];

    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
        this.standSprites = [
            [[{x: 0, y: 81}, {x: 481, y: 83}], [{x: 81, y: 0}, {x: 561, y: 83}]],
            [[{x: 0, y: 162}, {x: 481, y: 247}], [{x: 81, y: 243}, {x: 561, y: 247}]]
        ];
        this.crouchSprites = [
            [{x: 241, y: 0}, {x: 161, y: 0}],
            [{x: 241, y: 162}, {x: 241, y: 243}]
        ];
        this.deadly = 0;
        this.invulnerable = 0;
        this.width = 80;

        super.init();
        this.blinking = 0;
        this.setOffset(-24, 0);
        this.setSize(80, 80);
        this.cooldown = 0;
        this.setMarioState(MarioState.normal);
        this.setLifes(setup.start_lives);
        this.setCoins(0);
        this.deathCount = 0;
        this.deathBeginWait = Math.floor(700 / setup.interval);
        this.deathEndWait = 0;
        this.deathFrames = Math.floor(600 / setup.interval);
        this.deathStepUp = Math.ceil(200 / this.deathFrames);
        this.deathDir = 1;
        this.direction = Direction.right;
        this.setImage(images.sprites, 81, 0);
        this.crouching = false;
        this.fast = false;
    }

    setMarioState(state: MarioState) {
        this.marioState = state;
    }

    store(settings: Settings) {
        settings.lifes = this.lifes;
        settings.coins = this.coins;
        settings.state = this.state;
        settings.marioState = this.marioState;
    }

    restore(settings: Settings) {
        this.setLifes(settings.lifes || 0);
        this.setCoins(settings.coins || 0);
        this.setState(settings.state || SizeState.small);
        this.setMarioState(settings.marioState || MarioState.normal);
    }

    setState(state: SizeState) {
        if (state !== this.state) {
            this.setMarioState(MarioState.normal);
            super.setState(state);
        }
    }

    setPosition(x: number, y: number) {
        super.setPosition(x, y);
        var r = this.level.width - 640;
        var w = (this.x <= 210) ? 0 : ((this.x >= this.level.width - 230) ? r : r / (this.level.width - 440) * (this.x - 210));
        this.level.setParallax(w);

        if (this.onground && this.x >= this.level.width - 128)
            this.victory();
    }

    trigger(obj: Item) {
        obj.activate(this);
    }

    input(keys: Keys) {
        this.fast = keys.accelerate;
        this.crouching = keys.down;

        if (!this.crouching) {
            if (this.onground && keys.up)
                this.jump();

            if (keys.accelerate && this.marioState === MarioState.fire)
                this.shoot();

            if (keys.right || keys.left)
                this.walk(keys.left, keys.accelerate);
            else
                this.vx = 0;
        }
    }

    victory() {
        this.level.playMusic('success');
        this.clearFrames();
        this.view.show();
        this.setImage(images.sprites, this.state === SizeState.small ? 241 : 161, 81);
        this.level.next();
    }

    shoot() {
        if (!this.cooldown) {
            this.cooldown = setup.cooldown;
            this.level.playSound('shoot');
            new Bullet(this);
        }
    }

    setVelocity(vx: number, vy: number) {
        if (this.crouching) {
            vx = 0;
            this.crouch();
        } else {
            if (this.onground && vx > 0)
                this.walkRight();
            else if (this.onground && vx < 0)
                this.walkLeft();
            else
                this.stand();
        }

        super.setVelocity(vx, vy);
    }

    blink(times: number) {
        this.blinking = Math.max(2 * times * setup.blinkfactor, this.blinking);
    }

    invincible() {
        this.level.playMusic('invincibility');
        this.deadly = Math.floor(setup.invincible / setup.interval);
        this.invulnerable = this.deadly;
        this.blink(Math.ceil(this.deadly / (2 * setup.blinkfactor)));
    }

    grow() {
        if (this.state === SizeState.small) {
            this.level.playSound('grow');
            this.setState(SizeState.big);
            this.blink(3);
        }
    }

    shooter() {
        if (this.state === SizeState.small)
            this.grow();
        else
            this.level.playSound('grow');

        this.setMarioState(MarioState.fire);
    }

    walk(reverse: boolean, fast: boolean) {
        this.vx = setup.walking_v * (fast ? 2 : 1) * (reverse ? -1 : 1);
    }

    walkRight() {
        if (this.state === SizeState.small) {
            if (!this.setupFrames(8, 2, true, 'WalkRightSmall'))
                this.setImage(images.sprites, 0, 0);
        } else {
            if (!this.setupFrames(9, 2, true, 'WalkRightBig'))
                this.setImage(images.sprites, 0, 243);
        }
    }

    walkLeft() {
        if (this.state === SizeState.small) {
            if (!this.setupFrames(8, 2, false, 'WalkLeftSmall'))
                this.setImage(images.sprites, 80, 81);
        } else {
            if (!this.setupFrames(9, 2, false, 'WalkLeftBig'))
                this.setImage(images.sprites, 81, 162);
        }
    }

    stand() {
        var coords = this.standSprites[this.state - 1][this.direction === Direction.left ? 0 : 1][this.onground ? 0 : 1];
        this.setImage(images.sprites, coords.x, coords.y);
        this.clearFrames();
    }

    crouch() {
        var coords = this.crouchSprites[this.state - 1][this.direction === Direction.left ? 0 : 1];
        this.setImage(images.sprites, coords.x, coords.y);
        this.clearFrames();
    }

    jump() {
        this.level.playSound('jump');
        this.vy = setup.jumping_v;
    }

    move() {
        this.input(this.level.controls);
        super.move();
    }

    addCoin() {
        this.setCoins(this.coins + 1);
    }

    playFrame() {
        if (this.blinking) {
            if (this.blinking % setup.blinkfactor === 0)
                this.view.toggle();

            this.blinking--;
        }

        if (this.cooldown)
            this.cooldown--;

        if (this.deadly)
            this.deadly--;

        if (this.invulnerable)
            this.invulnerable--;

        super.playFrame();
    }

    setCoins(coins: number) {
        this.coins = coins;

        if (this.coins >= setup.max_coins) {
            this.addLife()
            this.coins -= setup.max_coins;
        }

        this.level.world.parent().children('#coinNumber').text(this.coins);
    }

    addLife() {
        this.level.playSound('liveupgrade');
        this.setLifes(this.lifes + 1);
    }

    setLifes(lifes: number) {
        this.lifes = lifes;
        this.level.world.parent().children('#liveNumber').text(this.lifes);
    }

    death() {
        if (this.deathBeginWait) {
            this.deathBeginWait--;
            return true;
        }

        if (this.deathEndWait)
            return !!(--this.deathEndWait);

        this.view.css({'bottom': (this.deathDir > 0 ? '+' : '-') + '=' + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + 'px'});
        this.deathCount += this.deathDir;

        if (this.deathCount === this.deathFrames)
            this.deathDir = -1;
        else if (this.deathCount === 0)
            this.deathEndWait = Math.floor(1800 / setup.interval);

        return true;
    }

    die() {
        console.trace();
        this.setMarioState(MarioState.normal);
        this.deathStepDown = Math.ceil(240 / this.deathFrames);
        this.setupFrames(9, 2, false);
        this.setImage(images.sprites, 81, 324);
        this.level.playMusic('die');
        super.die();
    }

    hurt(from: Figure) {
        console.log("Mario is hurt, i:" + this.i + "j:" + this.j);
        if (this.deadly)
            from.die();
        else if (this.invulnerable)
            return;
        else if (this.state === SizeState.small) {
            this.die();
        } else {
            this.invulnerable = Math.floor(setup.invulnerable / setup.interval);
            this.blink(Math.ceil(this.invulnerable / (2 * setup.blinkfactor)));
            this.setState(SizeState.small);
            this.level.playSound('hurt');
        }
    }
}
;