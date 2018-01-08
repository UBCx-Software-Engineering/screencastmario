import {CoinBox} from './CoinBox';
import {Level} from '../engine/Level';

export class MultipleCoinBox extends CoinBox {
    constructor(x: number, y: number, level: Level) {
        super(x, y, level, 8);
    }
}