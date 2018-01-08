import {Level} from '../engine/Level';
import {Ground} from './Ground';
import {
    GroundBlocking,
    images
} from '../engine/constants'

export class TopRightGrass extends Ground {
    constructor(x: number, y: number, level: Level) {
        var blocking = GroundBlocking.top + GroundBlocking.right;
        super(x, y, blocking, level);
        this.setImage(images.objects, 922, 404);
    }
}