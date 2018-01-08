import {Figure} from '../figures/Figure';
import {Mario} from '../figures/Mario';
import {Base} from './Base';
import {Matter} from '../matter/Matter';
import {Item} from '../items/Item';
import {Gauge} from './Gauge';

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
} from './constants'

export class Level extends Base {
    world: JQuery;
    figures: Figure[];
    obstacles: Matter[][];
    decorations: Matter[];
    items: Item[];
    lifes: number;
    liveGauge: Gauge;
    coinGauge: Gauge;
    active: boolean;
    nextCycles: number;
    loop: number;
    sounds: SoundManager;
    raw: LevelFormat;
    id: number;
    controls: Keys;
    assets: any;

    constructor(id: string, controls: Keys) {
        super(0, 0);
        this.world = $('#' + id);
        this.controls = controls;
        this.nextCycles = 0;
        // super was here
        super.init();
        this.active = false;
        this.figures = [];
        this.obstacles = [];
        this.decorations = [];
        this.items = [];
        this.coinGauge = new Gauge('coin', 0, 0, 10, 4, true);
        this.liveGauge = new Gauge('live', 0, 430, 6, 6, true);
    }

    reload() {
        var settings: Settings = {};
        this.pause();

        for (var i = this.figures.length; i--;) {
            this.figures[i].store(settings);
        }

        settings.lifes--;
        this.reset();

        if (settings.lifes < 0) {
            this.load(this.firstLevel(), this.assets);
        } else {
            this.load(this.raw, this.assets);

            for (var i = this.figures.length; i--;) {
                this.figures[i].restore(settings);
            }
        }

        this.start();
    }

    nextLevel() {
        return this.raw;
    }

    firstLevel() {
        return this.raw;
    }

    load(level: LevelFormat, assets: any) {
        this.assets = assets;
        if (this.active) {
            if (this.loop)
                this.pause();

            this.reset();
        }

        this.setPosition(0, 0);
        this.setSize(level.width * 32, level.height * 32);
        this.setBackground(level.background);
        this.raw = level;
        this.id = level.id;
        this.active = true;
        var data = level.data;

        for (var i = 0; i < level.width; i++) {
            var t: Matter[] = [];

            for (var j = 0; j < level.height; j++)
                t.push(undefined);

            this.obstacles.push(t);
        }

        for (var i = 0, width = data.length; i < width; i++) {
            var col = data[i];

            for (var j = 0, height = col.length; j < height; j++) {
                if (assets[col[j]])
                    new (assets[col[j]])(i * 32, (height - j - 1) * 32, this);
            }
        }
    }

    next() {
        this.nextCycles = Math.floor(7000 / setup.interval);
    }

    nextLoad() {
        if (this.nextCycles)
            return;

        var settings: Settings = {};
        this.pause();

        for (var i = this.figures.length; i--;) {
            this.figures[i].store(settings);
        }

        this.reset();
        this.load(this.nextLevel(), this.assets);

        for (var i = this.figures.length; i--;) {
            this.figures[i].restore(settings);
        }

        this.start();
    }

    getGridWidth() {
        return this.raw.width;
    }

    getGridHeight() {
        return this.raw.height;
    }

    setSounds(manager: SoundManager) {
        this.sounds = manager;
    }

    playSound(label: string) {
        if (this.sounds)
            this.sounds.play(label);
    }

    playMusic(label: string) {
        if (this.sounds)
            this.sounds.sideMusic(label);
    }

    reset() {
        this.active = false;
        this.world.empty();
        this.figures = [];
        this.obstacles = [];
        this.items = [];
        this.decorations = [];
    }

    tick() {
        if (this.nextCycles) {
            this.nextCycles--;
            this.nextLoad();
            return;
        }

        for (var i = this.figures.length; i--;) {
            var figure = this.figures[i];

            if (figure.dead) {
                if (!figure.death()) {
                    if (figure instanceof Mario)
                        return this.reload();

                    figure.view.remove();
                    this.figures.splice(i, 1);
                } else
                    figure.playFrame();
            } else {
                if (i) {
                    for (var j = i; j--;) {
                        if (figure.dead)
                            break;

                        var opponent = this.figures[j];

                        if (!opponent.dead && figure.q2q(opponent)) {
                            figure.hit(opponent);
                            opponent.hit(figure);
                        }
                    }
                }
            }

            if (!figure.dead) {
                figure.move();
                figure.playFrame();
            }
        }

        for (var i = this.items.length; i--;)
            this.items[i].playFrame();

        this.coinGauge.playFrame();
        this.liveGauge.playFrame();
    }

    start() {
        this.controls.bind();
        this.loop = setInterval(() => this.tick(), setup.interval);
    }

    pause() {
        this.controls.unbind();
        clearInterval(this.loop);
        this.loop = undefined;
    }

    setPosition(x: number, y: number) {
        super.setPosition(x, y);
        if (typeof this.world !== 'undefined') {
            this.world.css('left', -x);
        } else {
            console.log("Level::setPosition() called before world set");
        }
    }

    setBackground(index: number) {
        var img = basepath + 'backgrounds/' + ((index < 10 ? '0' : '') + index) + '.png';
        this.world.parent().css({
            backgroundImage:    img.toUrl(),
            backgroundPosition: '0 -380px'
        });
        this.setImage(img, 0, 0);
    }

    setSize(width: number, height: number) {
        super.setSize(width, height);
    }

    setParallax(x: number) {
        this.setPosition(x, this.y);
        this.world.parent().css('background-position', '-' + Math.floor(x / 3) + 'px -380px');
    }
}
