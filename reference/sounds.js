/*
 * *****
 * WRITTEN BY FLORIAN RAPPL, 2012.
 * florian-rappl.de
 * mail@florian-rappl.de
 * *****
 */

var SoundManager = Class.extend({
	// Constructor for sound Manager class
	init: function(settings, callback) {
		var n = 0;
		var test = document.createElement('audio');
		this.onload = callback;
		this.soundNames = [ 'jump' , 'coin' , 'enemy_die' , 'grow' , 'hurt' , 'mushroom' , 'shell' , 'shoot' , 'lifeupgrade' ];
		this.musicNames = [ 'game', 'invincible', 'die', 'success', 'gameover', 'peach', 'ending', 'menu', 'editor' ];
		this.musicLoops = [ true, false, false, false, false, true, false, true, true ];
		this.count = this.soundNames.length + this.musicNames.length;
		this.sounds = [];
		this.tracks = [];
		this.settings = settings || { musicOn : true };
		this.currentMusic = null;
		this.support = (typeof test.canPlayType === 'function' && (test.canPlayType('audio/mpeg') !== '' || test.canPlayType('audio/ogg') !== ''));
		this.toLoad = 0;
		this.sides = 0;
		
		if(this.support) {
			var ext = test.canPlayType('audio/ogg').match(/maybe|probably/i) ? '.ogg' : '.mp3';
			var me = this;
			
			var start = function() {
				if(n++ < 25 && me.toLoad > 0)
					setTimeout(function() { start(); }, 100);
				else
					me.loaded();
			};
			
			for(var i = 0, n = this.soundNames.length; i < n; i++)  {
				me.increment();
				var t = document.createElement('audio');
				t.addEventListener('error', function() { me.decrement(); }, false);
				t.addEventListener('loadeddata', function() { me.decrement(); }, false);
				t.src = AUDIOPATH + me.soundNames[i] + ext;
				t.preload = 'auto';
				me.sounds.push([t]);
			}
			
			for(var i = 0, n = this.musicNames.length; i < n; i++)  {
				me.increment();
				var t = document.createElement('audio');
				t.addEventListener('error', function() { me.decrement(); }, false);
				t.addEventListener('loadeddata', function() { me.decrement(); }, false);
				t.src = AUDIOPATH + me.musicNames[i] + ext;

				if(me.musicLoops[i]) {
					if (typeof t.loop == 'boolean') {
						t.loop = true;
					} else {
						t.addEventListener('ended', function() {
							this.currentTime = 0;
							this.play();
						}, false);
					}
				} else {
					t.addEventListener('ended', function() {
						me.sideMusicEnded();
					}, false);
				}

				t.preload = 'auto';
				me.tracks.push(t);
			}
			
			if(callback)
				start();
		} else
			this.loaded();
	},
	// Callback if everything loaded correctly
	loaded: function() {
		if(this.onload) {
			var me = this;
			setTimeout(function() { 
				me.onload();
			}, 10);
		}
	},
	// Decrements the toLoad property of the soundManager instance
	increment: function() {
		++this.toLoad;
	},
	// Decrements the toLoad property of the soundManager instance
	decrement: function() {
		--this.toLoad;
	},
	//Plays a certain sound effect
	play: function(name) {
		if(!this.settings || !this.settings.musicOn || !this.support)
			return;
			
		for(var i = this.soundNames.length; i--;) {  
			if(this.soundNames[i] === name) {
				var t = this.sounds[i];
				
				for(var j = t.length; j--; ) {
					if(t[j].duration === 0)
						return;
					
					if(t[j].ended)
						t[j].currentTime = 0;
					else if(t[j].currentTime > 0)
						continue;
						
					t[j].play();
					return;
				}
				
				var s = document.createElement('audio');
				s.src = t[0].src;
				t.push(s);
				s.play();
				return;
			}
		}
	},
	//Pauses the current music
	pauseMusic: function() {
		if(this.support && this.currentMusic)
			this.currentMusic.pause();
	},
	//Plays the current music
	playMusic: function() {
		if(this.support && this.currentMusic && this.settings.musicOn)
			this.currentMusic.play();
	},
	//When the Side music ended
	sideMusicEnded: function() {
		this.sides--;

		if(this.sides === 0) {
			this.currentMusic = this.previous;
			this.playMusic();
		}
	},
	//Plays some side music
	sideMusic: function(id) {
		var me = this;

		if(!me.support)
			return;

		if(me.sides === 0) {
			me.previous = me.currentMusic;
			me.pauseMusic();
		}

		for(var i = me.musicNames.length; i--; ) {
			if(me.musicNames[i] === id) {
				if(me.currentMusic !== me.tracks[i]) {
					me.sides++;
					me.currentMusic = me.tracks[i];
				}

				try {
					me.currentMusic.currentTime = 0;
					me.playMusic();
				} catch(e) { 
					me.sideMusicEnded();
				}
			}
		}		
	},
	//Changes the current music
	music: function(id, noRewind) {
		if(!this.support)
			return;

		for(var i = this.musicNames.length; i--; ) {
			if(this.musicNames[i] === id) {
				var m = this.tracks[i];

				if(m === this.currentMusic)
					return;

				this.pauseMusic();
				this.currentMusic = m;
		
				if(!this.support)
					return;
		
				try {
					if(!noRewind)
						this.currentMusic.currentTime = 0;
				
					this.playMusic();
				} catch(e) { }
			}
		}	
	},
});