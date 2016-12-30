var Credits = function(game) {};

Credits.prototype = {

  preload: function () {
    this.optionCount = 1;
    this.creditCount = 0;

  },

  addCredit: function(task, author) {
    var authorStyle = { font: '30pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var taskStyle = { font: '25pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var authorText = game.add.text(game.world.centerX, canvasHeight+200, author, authorStyle);
    var taskText = game.add.text(game.world.centerX, canvasHeight+250, task, taskStyle);
    authorText.anchor.setTo(0.5);
    authorText.stroke = "rgba(0,0,0,0)";
    authorText.strokeThickness = 4;
    taskText.anchor.setTo(0.5);
    taskText.stroke = "rgba(0,0,0,0)";
    taskText.strokeThickness = 4;
    game.add.tween(authorText).to( { y: -300 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 5000);
    game.add.tween(taskText).to( { y: -200 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 5000);
    this.creditCount ++;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(10, (this.optionCount * 80) + 450, text, optionStyle);

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
    this.stage.disableVisibilityChange = true;

    if (music.name !== "credit" && music.volume) {    
      music.stop();   
      music = game.add.audio('credit');      
      music.play();
    }
 
  
   // var bg = game.add.sprite(0, 0, 'gameover-bg');
    this.addCredit('Fejlesztő', 'Domaföldi Ádám');
    this.addCredit('Vezető grafikus és csacsiidomár', 'Domaföldi Gerda');
    this.addCredit('2017 - domafarm.eu', 'Készült a törökbálinti Almáskert kampányához'); 
    this.addCredit('Phaser.io', 'Játékmotor');
    this.addCredit('Bercinek hívják', 'A főszereplő fehércsacsi a Domafarmon lakik'); 
    this.addCredit('', 'Köszönjük, hogy játszottál!'); 
 
    this.addMenuOption('<- Vissza', function (e) {
      game.state.start("GameMenu");
    });
  //  game.add.tween(bg).to({alpha: 0}, 20000, Phaser.Easing.Cubic.Out, true, 40000);
  }

};
