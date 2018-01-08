import {Decoration} from './Decoration';
import {Level} from '../engine/Level';
import {
    GroundBlocking,
    images
} from '../engine/constants'

export class TopLeftGrassSoil extends Decoration {
    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
        this.setImage(images.objects, 956, 506);
    }
}