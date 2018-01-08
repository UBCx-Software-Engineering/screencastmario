import {Level} from '../engine/Level';
import {Ground} from './Ground';
import {
    GroundBlocking,
    images
} from '../engine/constants'

export class TopGrass extends Ground {
    constructor(x: number, y: number, level: Level) {
        var blocking = GroundBlocking.top;
        super(x, y, blocking, level);
        this.setImage(images.objects, 888, 404);
    }
}