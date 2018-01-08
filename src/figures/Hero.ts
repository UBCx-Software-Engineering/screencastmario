import {Figure} from './Figure';
import {Level} from '../engine/Level';

export class Hero extends Figure {
    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
    }
}
