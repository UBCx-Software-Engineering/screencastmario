import {Level} from '../engine/Level'
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
import {Figure} from "../figures/Figure";

export class Base implements Point, Size {
    frameCount: number;
    x: number;
    y: number;
    image: Picture;
    width: number;
    height: number;
    currentFrame: number;
    frameID: string;
    rewindFrames: boolean;
    frameTick: number;
    frames: number;
    view: JQuery;
    level: Level;

    constructor(x: number = 0, y: number = 0, setup = (f : any = null) => {}) {
        setup(this);
        this.x = x;
        this.y = y;
    }

    init() {
        this.setPosition(this.x, this.y);
        this.clearFrames();
        this.frameCount = 0;
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getPosition(): Point {
        return {x: this.x, y: this.y};
    }

    setImage(img: string, x: number, y: number) {
        this.image = {
            path: img,
            x:    x,
            y:    y
        };
    }

    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getSize(): Size {
        return {width: this.width, height: this.height};
    }

    setupFrames(fps: number, frames: number, rewind: boolean, id?: string) {
        if (id) {
            if (this.frameID === id)
                return true;

            this.frameID = id;
        }

        this.currentFrame = 0;
        this.frameTick = frames ? (1000 / fps / setup.interval) : 0;
        this.frames = frames;
        this.rewindFrames = rewind;
        return false;
    }

    clearFrames() {
        this.frameID = undefined;
        this.frames = 0;
        this.currentFrame = 0;
        this.frameTick = 0;
    }

    playFrame() {
        if (this.frameTick && this.view) {
            this.frameCount++;

            if (this.frameCount >= this.frameTick) {
                this.frameCount = 0;

                if (this.currentFrame === this.frames)
                    this.currentFrame = 0;

                var $el = this.view;
                $el.css('background-position', '-' + (this.image.x + this.width * ((this.rewindFrames ? this.frames - 1 : 0) - this.currentFrame)) + 'px -' + this.image.y + 'px');
                this.currentFrame++;
            }
        }
    }
}
;