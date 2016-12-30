var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 200,
    startX: "center"
  }, 

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Szedd magad játék", {
      font: 'bold 60pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);    

    this.optionCount = 1;    
  },

  create: function () {

     

    if (music.name !== "exit" && music.volume) {
      music.stop();
      music = game.add.audio('exit');
      music.loop = true;
      music.play();
    }
    game.stage.disableVisibilityChange = true;
    //game.add.sprite(0, 0, 'menu-bg');

    game.stage.backgroundColor = "#222222";
    game.add.existing(this.titleText);

    this.addMenuOption('Játék indítás', function () {
      game.state.start("Game");
    });
    this.addMenuOption('Beállítások', function () {
      game.state.start("Options");
    });
    this.addMenuOption('Kredit', function () {
      game.state.start("Credits");
    });
    this.addMenuOption('Kilépés', function () {
      window.location = "https://domafarm.eu/almaskert-torokbalint";    
    });
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
