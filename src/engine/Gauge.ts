import {Base} from './Base';

export class Gauge extends Base {
    constructor(id: string, startImgX: number, startImgY: number, fps: number, frames: number, rewind: boolean) {
        super(0, 0);
        this.view = $('#' + id);
        this.setSize(this.view.width(), this.view.height());
        this.setImage(this.view.css('background-image'), startImgX, startImgY);
        this.setupFrames(fps, frames, rewind);
    }
}
