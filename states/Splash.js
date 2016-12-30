var Splash = function () {}; 
 
Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', '../js/lib/style.js');
    game.load.script('mixins', '../js/lib/mixins.js');
    game.load.script('WebFont', '../js/vendor/webfontloader.js');
    game.load.script('gamemenu','../js/states/GameMenu.js');
    game.load.script('game', '../js/states/Game.js');
    game.load.script('gameover','../js/states/GameOver.js');
    game.load.script('credits', '../js/states/Credits.js');
    game.load.script('options', '../js/states/Options.js');      
  },

  loadBgm: function () {
    // thanks Kevin Macleod at http://incompetech.com/
    game.load.audio('credit', '../bgm/credit.mp3');
    game.load.audio('dangerous', '../bgm/Dangerous.mp3');
    game.load.audio('exit', '../bgm/Exit_the_Premises.mp3');
  },
  // various freebies found from google image search
  loadImages: function () {
    game.load.image('menu-bg', '../img/assets/menu-bg.jpg');
    game.load.image('options-bg', '../img/assets/options-bg.jpg');
    game.load.image('gameover-bg', '../img/assets/gameover-bg.jpg');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['TheMinion'],
        urls: ['../css/theminion.css']
      }
    }
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.logo       = game.make.sprite(game.world.centerX, 200, 'brand');
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.logo, this.status]);
  },

  preload: function () {
   // game.add.sprite(0, 0, 'stars');
    game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {

    game.state.add("GameMenu",GameMenu);
    game.state.add("Game",Game);
    game.state.add("GameOver",GameOver);
    game.state.add("Credits",Credits);
    game.state.add("Options",Options);
  },

  addGameMusic: function () {
    music = game.add.audio('exit');
    music.loop = true;
    music.play();
  },

  create: function() {
   
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};
