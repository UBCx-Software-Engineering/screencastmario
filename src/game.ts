/// <reference path="def/jquery.d.ts"/>


import {Item} from './items/Item';
import {TurtleShell} from './figures/TurtleShell';
import {run} from './engine/main';
import {HtmlAudioManager} from './audio';
import {keys} from "./keys";
import {definedLevels} from './testlevels';

$(document).ready(function () {
    startGame();
});

function startGame() {
    var sounds = new HtmlAudioManager();

    try {
        run(definedLevels[0], keys, sounds);
    } catch (err) {
        console.log(err);
    }
}

