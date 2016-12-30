var Options = function(game) {}; 

Options.prototype = {

  preload: function () {
    this.optionCount = 1;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: "30pt TheMinion", fill: "white", align: "left", stroke: "rgba(0,0,0,0)", srokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 160, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;
  },

  create: function () {     

    //game.add.sprite(0, 0, "gameover-bg");
    var titleStyle = { font: "bold 60pt TheMinion", fill: "#FDFFB5", align: "center"};

      
   // game.add.sprite(0, 0, "gameover-bg");
    var titleStyle = { font: "bold 60pt TheMinion", fill: "#FDFFB5", align: "center"};
    var text = game.add.text(game.world.centerX, 100, "Beállítások", titleStyle);    
    
    text.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
    text.anchor.set(0.5);  
 
  //  var playSound = gameOptions.playSound,
   //     playMusic = gameOptions.playMusic;   

    //game.add.sprite(0, 0, "options-bg");
    //game.add.existing(this.titleText);
    this.addMenuOption(music.volume ? "Zene: be" : "Zene: ki", function (target) {
      music.volume = music.volume ? 0 : 1;     
      target.text = music.volume ? "Zene: be" : "Zene: ki";          
    });
 
    // it is not relevant at the moment
    /*this.addMenuOption(playSound ? "Mute Sound" : "Play Sound", function (target) {
      playSound = !playSound;
      target.text = playSound ? "Mute Sound" : "Play Sound";
     // sound.volume = playMusic ? 1 : 0;  
    });*/
    this.addMenuOption("Főmenü", function () {
      game.state.start("GameMenu");
    });
  }

};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);