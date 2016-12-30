var Game = function(game) {}; 

var player, cursors, buttonFullscreen, sky, trap, heart;
// score, your place, score text 
var score = 0, yourPlace = 0, scoreText;

var formSent = false;

//time and stuff
var timer, cycle, effectDuration, timeStep = 0, gameClock = 0, timeLimit = 52, timer1;

// ledge
var ledgeWidth, ledgeHeight; 

// apples
var appleWidth, appleHeight, yellowAppleON = false, yellowAppleStatusBar;

// Buttons
var pauseButton;


Game.prototype = {

    preload: function () {
        this.optionCount = 1;
    },      

    create: function () {   

        if (music.name !== "dangerous" && music.volume) {
            music.stop();
            music = game.add.audio('dangerous');
            music.loop = true;
            music.play();
        }      
        // Game timer
        game.time.events.start();
        game.time.events.add(Phaser.Timer.SECOND * 60, this.shutdown, this);

        score = 0;
        //clear cache
        //this.clearGameCache();

        timer = 0;
        cycle = 1000;

        timeStep = 0;

        formSent = false;        

        // game.world.resize(1280, 720);          

        //  We"re going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        sky = game.add.sprite(0, 0,"sky");    
        sky.scale.setTo(objectScale*2, objectScale*2);

        // Enables all kind of input actions on this image (click, etc)
        game.inputEnabled = true;   

        // Apples
        apples = game.add.group(); 

        apples.enableBody = true; 

        var apple = apples.create(500,500, "redApple");  

        appleWidth = apple.width; appleHeight = apple.height;   

        //  ledges
        ledges = game.add.group();        

        //  We will enable physics for any ledges that is created in this group
        ledges.enableBody = true;       
         
        generatedY = this.randomXY(canvasHeight,canvasHeight*0.1);

        // Create the first ledge 
        var ledge = ledges.create(canvasWidth/2, generatedY, "ground");
        ledge.body.immovable = true;
        ledge.scale.setTo(objectScale, objectScale);    

        ledgeWidth = ledge.width; ledgeHeight = ledge.height;

        // load ledges and apples
        this.firstPart();   

        // The player and its settings
        player = game.add.sprite(256, 192, "dude");    

        //game.camera.x = player.x;             

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 450;
        player.body.collideWorldBounds = true;        

        //  Our two animations, walking left and right.
       // player.animations.add("left", [0, 1, 2, 3], 10, true);
        player.animations.add("right", [1,2,3,4,5], 10, true);
        
        player.frame = 0;

        player.scale.setTo(objectScale*0.6, objectScale*0.6);     

        //  The score

        var optionStyle = { font: "30pt TheMinion", fill: "white", align: "left", stroke: "rgba(0,0,0,0)", srokeThickness: 4};
        scoreText = game.add.text(game.world.centerX, canvasHeight * 0.01, "PONT: 0", optionStyle);            
  
        gameClock = game.add.text(canvasWidth * 0.01, canvasHeight * 0.01, "60", optionStyle);     

        // Maintain aspect ratio
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        // Add player life hearts group
        hearts = game.add.group();

        for(var i = 0; i < 3; i++){

            heart = hearts.create(canvasWidth * 0.05 + i*40, canvasHeight * 0.01, "heart");
            heart.scale.setTo(objectScale, objectScale);

        }

        // Add fullscreen button
        buttonExit = game.add.sprite(canvasWidth * 0.895, canvasHeight * 0.01, "buttonExit");
        buttonExit.scale.setTo(objectScale * 0.6, objectScale * 0.6);
        buttonExit.inputEnabled = true;
        buttonExit.events.onInputDown.add(function(){game.state.start("GameOver");}, this);  

        // Add fullscreen button
        buttonFullscreen = game.add.sprite(canvasWidth * 0.93, canvasHeight * 0.01, "buttonFullscreen");
        buttonFullscreen.scale.setTo(objectScale * 0.6, objectScale * 0.6);
        buttonFullscreen.inputEnabled = true;
        buttonFullscreen.events.onInputDown.add(this.gofull, this); 
   
        // Add pause button
        buttonPause = game.add.sprite(canvasWidth * 0.965, canvasHeight * 0.01, "buttonPause");
        buttonPause.scale.setTo(objectScale * 0.6, objectScale * 0.6);
        buttonPause.inputEnabled = true;  
        buttonPause.events.onInputDown.add(this.managePause, this);                       
              
    },

  //|||||||
  //UPDATE|
  //|||||||

  update: function() {    
    
    game.physics.arcade.collide(player, ledges);

    // if player is on ledge or floor then walk instead of fly
    if(player.body.touching.down || player.body.onFloor()){
        player.animations.play("right");
    }
    else{
         player.frame = 0;
    }

    //  Checks to see if the player overlaps with any of the apples, if he does call the collectapple function   
    game.physics.arcade.overlap(player, apples, this.collectapple, null, this);
    game.physics.arcade.overlap(player, ledges, this.collideLedge, null, this);
   
    if (game.input.activePointer.isDown) {
        player.body.velocity.y -= 30;  
    }  

    ledges.x -= 2.5;  
    apples.x -=2.5;    

    if (Math.round(game.time.events.duration/1000) <= timeLimit-timeStep && Math.round(game.time.events.duration/1000) > timeLimit-timeStep-3){
        this.firstPart();
        console.log(Math.round(game.time.events.duration/1000));
        timeStep += 8;
    }

    gameClock.text = Math.round(game.time.events.duration/1000);   
  
    // garbage collector for apples and ledges
    ledges.forEach(function(ledge) {       
       
        if (ledge.x-Math.abs(ledges.x) < -800) {          
            ledge.destroy();
        }       
        
    });

    apples.forEach(function(apple) {
       
        if (apple.x-Math.abs(apples.x) < -100) {        
            apple.destroy();           
        }
        
    });

    if(yellowAppleON){
        this.yellowAppleEffect();
    }    

},

firstPart: function(ledgeX = ledges.x, ledgeY = 400){     

    var generatedX = Math.abs(ledgeX) + canvasWidth;   
     
    for(i=0; i < 3; i++){

        var generatedY = game.rnd.frac();
       
        var ledge = ledges.create(generatedX+ledgeWidth*i, (canvasHeight-ledgeHeight) * generatedY, "ground");
        ledge.body.immovable = true;
        ledge.scale.setTo(objectScale, objectScale);  

        var appleNumber = game.rnd.integerInRange(1, 5);                             

        for(var j = 0; j < appleNumber; j++){

            var randBoostApple = game.rnd.integerInRange(1, 20);   

            var appleRand = game.rnd.frac(); 

            if((canvasHeight-ledgeHeight) * generatedY * appleRand - appleHeight > (canvasHeight * 0.1)){

                if(randBoostApple == 10){

                    var yellowApple = apples.create(generatedX+ledgeWidth*i + appleWidth*j, (canvasHeight-ledgeHeight) * generatedY * game.rnd.frac() - appleHeight, "yellowApple"); 
                    yellowApple.color = "yellow"; 
                    yellowApple.scale.setTo(objectScale, objectScale); 

                }
                else if(randBoostApple == 7){

                    var timeApple = apples.create(generatedX+ledgeWidth*i + appleWidth*j, (canvasHeight-ledgeHeight) * generatedY * game.rnd.frac() - appleHeight, "timeApple"); 
                    timeApple.color = "black"; 
                    timeApple.scale.setTo(objectScale, objectScale); 

                }
                else{

                     var apple = apples.create(generatedX+ledgeWidth*i + appleWidth*j, (canvasHeight-ledgeHeight) * generatedY * game.rnd.frac() - appleHeight, "redApple");
                     apple.scale.setTo(objectScale, objectScale); 

                }                
            }
            else{

                var apple = apples.create(generatedX+ledgeWidth*i + appleWidth*j, (canvasHeight-ledgeHeight) * generatedY + (canvasHeight - (canvasHeight-ledgeHeight * generatedY)) * game.rnd.frac() + appleHeight, "redApple");
                apple.scale.setTo(objectScale, objectScale); 
                  
            }
                     
        }  

    }   

}, 

collectapple: function(player, apple) {   

    if(apple.color == "yellow"){  

        if(!yellowAppleON){

            yellowAppleStatusBar = game.add.sprite(800, canvasHeight*0.01, "yellowApple"); 
            yellowAppleStatusBar.enableBody = true; 

        }       

        yellowAppleON = true; 

        effectDuration = gameClock.text;  

    }
    else if(apple.color == "black"){         

         currentTimer = parseInt(gameClock.text) + 10; 

         // this is neccesary to the yellow apple effect
         effectDuration + 10;
         // this to the apple end ledge generation
         timeStep -= 8;
         game.time.events.stop();
         game.time.events.add(Phaser.Timer.SECOND * currentTimer, this.shutdown, this);
         game.time.events.start();        
        
    }
    // Removes the apple from the screen
    apple.destroy();

    //  Add and update the score
    score += 10;
    scoreText.text = "PONT: " + score;
},

collideLedge: function(){      

    if (game.time.now > timer && !yellowAppleON && !player.body.touching.down) {
       
        // Update timer.
        timer = game.time.now + cycle;
            
        // Get the first alive item and kill it.
        var item = hearts.getFirstAlive(); 

        if(item){
            item.kill();
            item = hearts.getFirstAlive();  
        }

        if(!item){
            this.shutdown();     
        }

    }  

},

yellowAppleEffect: function(){

    if(gameClock.text < (effectDuration - 10)){

        yellowAppleON = false;  
        yellowAppleStatusBar.destroy();    
               
    }
   
    // increasing the velocity of coming elements
    ledges.x -= 2.5;  
    apples.x -= 2.5;     
  
},

managePause: function(gameapplet = false) {   

    this.game.paused = true;  

    var optionStyle = { font: "30pt TheMinion", fill: "white", align: "left", stroke: "rgba(0,0,0,0)", srokeThickness: 4};

    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, "Folytatáshoz koppints bárhova!", optionStyle); 
    
    this.input.onDown.add(function(){   

        this.game.paused = false; 
        txt.destroy();       
              
    }, this);

},

shutdown: function () {      

    document.getElementById("scoreInput").value = score;

    if (!formSent){
        $("#scoreForm").ajaxSubmit({success: function( response ) {               
            console.log(response);
            yourPlace = response;
            game.time.events.stop();

            formSent = true;  
            yellowAppleON = false;  
            music.stop();           
            game.state.start("GameOver");
                                  
       }});
    }    
                     
},

randomXY: function (max=50, min=10){
     return Math.floor((Math.random() * max) + min);
},

clearGameCache: function () {
    game.cache = new Phaser.Cache(game);
    game.load.reset();
    game.load.removeAll();
},

// Fullscreen function
gofull: function() {

    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen();      
    }
    else {
        game.scale.startFullScreen(false);      
    }

},

  addMenuOption: function(text, callback) {
    var optionStyle = { font: "30pt TheMinion", fill: "white", align: "left", stroke: "rgba(0,0,0,0)", srokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, text, optionStyle);
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
    txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;  

  },
};