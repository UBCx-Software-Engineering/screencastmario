import {Level} from '../engine/Level';
import {Figure} from '../figures/Figure';

export class ItemFigure extends Figure {
    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
    }
}
