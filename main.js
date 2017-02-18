 var objectScale = 1.0;
 var canvasWidth = document.documentElement.clientWidth;
 var canvasHeight = document.documentElement.clientHeight;

 console.log(canvasWidth + '+' + canvasHeight);

 if (canvasHeight <= 720) {
     objectScale = 0.8;
 } else if (canvasHeight <= 400) {
     objectScale = 0.5;
 }

 var music;

 var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, 'game'),

     Main = function() {},

     musicPlayer;

 Main.prototype = {

     preload: function() {

         game.load.image('loading', '../img/assets/loading.png');
         game.load.image('brand', '../img/assets/logo.jpg');
         game.load.image('nightBackground', '../img/assets/night_background.jpg');
         game.load.image('skyYellow', '../img/assets/sky_yellow.png');
         game.load.image('ground', '../img/assets/platform.png');
         game.load.image('star', '../img/assets/star.png');
         game.load.image('redApple', '../img/assets/red_apple.png');
         game.load.image('yellowApple', '../img/assets/yellow_apple.png');
         game.load.image('purpleApple', '../img/assets/purple_apple.png');
         game.load.image('timeApple', '../img/assets/time_apple.png');
         game.load.image('silverApple', '../img/assets/silver_apple.png');
         game.load.image('whiteApple', '../img/assets/white_apple.png');
         game.load.image('diamond', '../img/assets/diamond.png');
         game.load.image('heart', '../img/assets/heart.png');
         game.load.image('buttonPause', '../img/assets/button-pause.png');
         game.load.image('buttonExit', '../img/assets/button-exit.png');
         game.load.image('buttonFullscreen', '../img/assets/button-fullscreen.png');
         game.load.image('soundOn', '../img/assets/sound_on.png');
         game.load.image('soundOff', '../img/assets/sound_off.png');

         game.load.spritesheet('dude', '../img/assets/dude.png', 256, 192);

         game.load.script('utils', '../js/lib/utils.js');
         game.load.script('splash', '../js/states/Splash.js');
         // game.load.script('PathGenerator', '../js/lib/PathGenerator.js');

         // Add the loadingbar to the scene:
         var loadingBar = game.add.sprite(game.world.centerX, 400, "loading");
         // Tell phaser to use laodingBar as our preload progess bar
         this.load.setPreloadSprite(loadingBar);
     },

     create: function() {
         game.state.add('Splash', Splash);
         game.state.start('Splash');
     }
 };

 game.state.add('Main', Main);
 game.state.start('Main');