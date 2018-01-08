/// <reference path="def/interfaces.d.ts"/>

import {
    basepath
} from './engine/constants'

var audiopath = basepath + 'audio/';

export class HtmlAudioManager implements SoundManager {
    soundNames: string[];
    musicNames: string[];
    musicLoops: boolean[];
    support: boolean;
    sounds: HTMLAudioElement[][];
    tracks: HTMLAudioElement[];
    settings: Settings;
    previous: HTMLAudioElement;
    currentMusic: HTMLAudioElement;
    sides: number;
    onload: () => void;

    // Constructor for sound Manager class
    constructor(settings: Settings = {musicOn: true}, callback?: () => void) {
        var n = 0;
        var test = <HTMLAudioElement>document.createElement('audio');
        this.support = typeof test.canPlayType === 'function' && (test.canPlayType('audio/mpeg') !== '' || test.canPlayType('audio/ogg') !== '');
        this.onload = callback;
        this.soundNames = ['jump', 'coin', 'enemy_die', 'grow', 'hurt', 'mushroom', 'shell', 'shoot', 'lifeupgrade'];
        this.musicNames = ['game', 'invincible', 'die', 'success', 'gameover', 'peach', 'ending', 'menu', 'editor'];
        this.musicLoops = [true, false, false, false, false, true, false, true, true];
        this.sounds = [];
        this.tracks = [];
        this.settings = settings;
        this.currentMusic = null;
        this.sides = 0;

        if (this.support) {
            var toLoad = 0;
            var ext = test.canPlayType('audio/ogg').match(/maybe|probably/i) ? '.ogg' : '.mp3';

            var start = () => {
                if (n++ < 25 && toLoad > 0)
                    setTimeout(start, 100);
                else
                    this.loaded();
            };

            this.soundNames.forEach(soundName => {
                ++toLoad;
                var t = <HTMLAudioElement>document.createElement('audio');
                t.addEventListener('error', () => --toLoad, false);
                t.addEventListener('loadeddata', () => --toLoad, false);
                t.src = audiopath + soundName + ext;
                t.preload = 'auto';
                this.sounds.push([t]);
            });

            this.musicNames.forEach((musicName, index) => {
                ++toLoad;
                var t = <HTMLAudioElement>document.createElement('audio');
                t.addEventListener('error', () => --toLoad, false);
                t.addEventListener('loadeddata', () => --toLoad, false);
                t.src = audiopath + musicName + ext;

                if (this.musicLoops[index]) {
                    if (typeof t.loop !== 'boolean') {
                        t.addEventListener('ended', function () {
                            this.currentTime = 0;
                            this.play();
                        }, false);
                    } else
                        t.loop = true;
                } else
                    t.addEventListener('ended', () => this.sideMusicEnded(), false);

                t.preload = 'auto';
                this.tracks.push(t);
            });

            if (callback !== undefined)
                start();
        } else
            this.loaded();
    }

    loaded() {
        if (this.onload)
            setTimeout(this.onload, 10);
    }

    play(name: string) {
        if (!this.settings || !this.settings.musicOn || !this.support)
            return;

        for (var i = this.soundNames.length; i--;) {
            if (this.soundNames[i] === name) {
                var t = this.sounds[i];

                for (var j = t.length; j--;) {
                    if (t[j].duration === 0)
                        return;

                    if (t[j].ended)
                        t[j].currentTime = 0;
                    else if (t[j].currentTime > 0)
                        continue;

                    t[j].play();
                    return;
                }

                var s = <HTMLAudioElement>document.createElement('audio');
                s.src = t[0].src;
                t.push(s);
                s.play();
                return;
            }
        }
    }

    pauseMusic() {
        if (this.support && this.currentMusic)
            this.currentMusic.pause();
    }

    playMusic() {
        if (this.support && this.currentMusic && this.settings.musicOn)
            this.currentMusic.play();
    }

    sideMusicEnded() {
        this.sides--;

        if (this.sides === 0) {
            this.currentMusic = this.previous;
            this.playMusic();
        }
    }

    sideMusic(id: string) {
        if (!this.support)
            return;

        if (this.sides === 0) {
            this.previous = this.currentMusic;
            this.pauseMusic();
        }

        for (var i = this.musicNames.length; i--;) {
            if (this.musicNames[i] === id) {
                if (this.currentMusic !== this.tracks[i]) {
                    this.sides++;
                    this.currentMusic = this.tracks[i];
                }

                try {
                    this.currentMusic.currentTime = 0;
                    this.playMusic();
                } catch (e) {
                    this.sideMusicEnded();
                }
            }
        }
    }

    music(id: string, noRewind: boolean) {
        if (!this.support)
            return;

        for (var i = this.musicNames.length; i--;) {
            if (this.musicNames[i] === id) {
                var m = this.tracks[i];

                if (m === this.currentMusic)
                    return;

                this.pauseMusic();
                this.currentMusic = m;

                if (!this.support)
                    return;

                try {
                    if (!noRewind)
                        this.currentMusic.currentTime = 0;

                    this.playMusic();
                } catch (e) {
                }
            }
        }
    }
}
