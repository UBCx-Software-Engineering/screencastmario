import {Decoration} from './Decoration';
import {Level} from '../engine/Level';
import {
    GroundBlocking,
    images
} from '../engine/constants'

export class RightPlantedSoil extends Decoration {
    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
        this.setImage(images.objects, 782, 832);
    }
}