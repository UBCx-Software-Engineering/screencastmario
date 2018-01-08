import {Enemy} from './Enemy';
import {Level} from '../engine/Level';
import {TurtleShell} from './TurtleShell'

export class Turtle extends Enemy {
    shell: TurtleShell;

    constructor(x: number, y: number, level: Level) {
        super(x, y, level);
    }

    setShell(shell: TurtleShell) {
        return false;
    }
}
;