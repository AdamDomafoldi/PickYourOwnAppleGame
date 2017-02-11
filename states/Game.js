var Game = function(game) {};

var player, cursors, buttonFullscreen, nightBackground, trap, heart;
// score, your place, score text 
var score = 0,
    yourPlace = 0,
    scoreText, applePoint = 10;

var formSent = false;

//time and stuff
var timer, cycle, timeStep = 0,
    gameClock = 0,
    timeLimit = 52,
    step, countGeneration = 0,
    timer1, gameDuration, pauseDuration;

// ledge
var ledgeWidth, ledgeHeight;

// apples
var appleWidth, appleHeight, yellowAppleON = false,
    yellowAppleStatusBar, purpleAppleON = false,
    purpleAppleStatusBar, yellowAppleEffectStart = 0,
    purpleAppleEffectStart = 0;

// Buttons
var pauseButton;
// obejcts
var startTimeBox, pickedAppleBox, heartStack;

debugMode = false;

Game.prototype = {

    preload: function() {
        this.optionCount = 1;
    },

    create: function() {
        startTimeBox = { purple: 0, yellow: 0, generateStep: 70 };
        pickedAppleBox = { purple: 0, yellow: 0, silver: 0, apple: 0, black: 0, white: 0 };
        heartStack = [];

        if (music.name !== "dangerous" && music.volume) {
            music.stop();
            music = game.add.audio('dangerous');
            music.loop = true;
            music.play();
        }
        // Game timer
        game.time.events.start();
        game.time.events.add(Phaser.Timer.SECOND * 60, this.shutdown, this);
        score = 0, timer = 0, cycle = 2000, step = 7, timeStep = 0;
        formSent = false;
        gameDuration = new Date().getTime();
        pauseDuration = 0;
        //  We"re going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //  A simple background for our game
        nightBackground = game.add.sprite(0, 0, "nightBackground");
        // sky.scale.setTo(objectScale * 2, objectScale * 2);

        // Enables all kind of input actions on this image (click, etc)
        game.inputEnabled = true;

        // Apples
        apples = game.add.group();

        apples.enableBody = true;

        var apple = apples.create(500, 500, "redApple");

        appleWidth = apple.width;
        appleHeight = apple.height;

        //  ledges
        ledges = game.add.group();

        //  We will enable physics for any ledges that is created in this group
        ledges.enableBody = true;

        generatedY = this.randomXY(canvasHeight, canvasHeight * 0.1);

        // Create the first ledge 
        var ledge = ledges.create(canvasWidth / 2, generatedY, "ground");
        ledge.body.immovable = true;
        ledge.scale.setTo(objectScale, objectScale);

        ledgeWidth = ledge.width;
        ledgeHeight = ledge.height;

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
        player.animations.add("right", [1, 2, 3, 4, 5], 10, true);

        player.frame = 0;

        player.scale.setTo(objectScale * 0.6, objectScale * 0.6);

        //  The score

        var optionStyle = { font: "30pt TheMinion", fill: "white", align: "left", stroke: "rgba(0,0,0,0)", srokeThickness: 4 };
        scoreText = game.add.text(game.world.centerX, canvasHeight * 0.01, "PONT: 0", optionStyle);

        gameClock = game.add.text(canvasWidth * 0.01, canvasHeight * 0.01, "60", optionStyle);

        // Maintain aspect ratio
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        // Add player life hearts group
        hearts = game.add.group();

        for (var i = 3; i > 0; i--) {
            heart = hearts.create(gameClock.x + canvasWidth * 0.04 + i * 40, canvasHeight * 0.01, "heart");
            heart.id = 3 - i;
            heart.scale.setTo(objectScale, objectScale);
        }
        // Add pause button
        buttonPause = game.add.sprite(canvasWidth * 0.95, canvasHeight * 0.01, "buttonPause");
        buttonPause.scale.setTo(objectScale * 0.6, objectScale * 0.6);
        buttonPause.inputEnabled = true;
        buttonPause.events.onInputDown.add(this.managePause, this);
        // Add fullscreen button
        buttonExit = game.add.sprite(buttonPause.x - buttonPause.width, buttonPause.y, "buttonExit");
        buttonExit.scale.setTo(objectScale * 0.6, objectScale * 0.6);
        buttonExit.inputEnabled = true;
        buttonExit.events.onInputDown.add(function() { game.state.start("GameOver"); }, this);
        // Add fullscreen button
        buttonFullscreen = game.add.sprite(buttonExit.x - buttonExit.width, buttonExit.y, "buttonFullscreen");
        buttonFullscreen.scale.setTo(objectScale * 0.6, objectScale * 0.6);
        buttonFullscreen.inputEnabled = true;
        buttonFullscreen.events.onInputDown.add(this.gofull, this);
    },

    update: function() {

        game.physics.arcade.collide(player, ledges);

        // if player is on ledge or floor then walk instead of fly
        if (player.body.touching.down || player.body.onFloor()) {
            player.animations.play("right");
        } else {
            player.frame = 0;
        }

        //  Checks to see if the player overlaps with any of the apples, if he does call the collectapple function   
        game.physics.arcade.overlap(player, apples, this.collectapple, null, this);
        game.physics.arcade.overlap(player, ledges, this.collideLedge, null, this);

        if (game.input.activePointer.isDown) {
            player.body.velocity.y -= 30;
        }

        ledges.x -= 2.5;
        apples.x -= 2.5;

        gameClock.text = Math.round(game.time.events.duration / 1000);

        if (startTimeBox.generateStep - parseInt(gameClock.text) > step) {
            startTimeBox.generateStep = parseInt(gameClock.text);
            this.firstPart();
            this.consoleLogWrapper("Generate elements: " + Math.round(game.time.events.duration / 1000));
        }

        // garbage collector for apples and ledges
        ledges.forEach(function(ledge) {
            if (ledge.x - Math.abs(ledges.x) < -800) {
                ledge.destroy();
            }
        });

        apples.forEach(function(apple) {
            if (apple.x - Math.abs(apples.x) < -100) {
                apple.destroy();
            }
        });

        if (yellowAppleON) {
            this.yellowAppleEffect();
        }
        if (purpleAppleON) {
            this.purpleAppleEffect();
        }
    },

    firstPart: function(ledgeX = ledges.x, ledgeY = 400) {

        var generatedX = Math.abs(ledgeX) + canvasWidth;

        for (i = 0; i < 3; i++) {
            var generatedY = game.rnd.frac();
            var ledge = ledges.create(generatedX + ledgeWidth * i, (canvasHeight - ledgeHeight) * generatedY, "ground");
            ledge.body.immovable = true;
            ledge.scale.setTo(objectScale, objectScale);
            var appleNumber = game.rnd.integerInRange(1, 5);
            for (var j = 0; j < appleNumber; j++) {
                var randBoostApple = game.rnd.integerInRange(1, 20);
                var appleRand = game.rnd.frac();
                if ((canvasHeight - ledgeHeight) * generatedY * appleRand - appleHeight > (canvasHeight * 0.1)) {
                    if (randBoostApple == 4) {
                        var yellowApple = apples.create(generatedX + ledgeWidth * i + appleWidth * j, (canvasHeight - ledgeHeight) * generatedY * game.rnd.frac() - appleHeight, "yellowApple");
                        yellowApple.color = "yellow";
                        yellowApple.scale.setTo(objectScale, objectScale);
                    } else if (randBoostApple == 8) {
                        var timeApple = apples.create(generatedX + ledgeWidth * i + appleWidth * j, (canvasHeight - ledgeHeight) * generatedY * game.rnd.frac() - appleHeight, "timeApple");
                        timeApple.color = "black";
                        timeApple.scale.setTo(objectScale, objectScale);
                    } else if (randBoostApple == 12) {
                        var purpleApple = apples.create(generatedX + ledgeWidth * i + appleWidth * j, (canvasHeight - ledgeHeight) * generatedY * game.rnd.frac() - appleHeight, "purpleApple");
                        purpleApple.color = "purple";
                        purpleApple.scale.setTo(objectScale, objectScale);
                    } else if (randBoostApple == 16) {
                        var silverApple = apples.create(generatedX + ledgeWidth * i + appleWidth * j, (canvasHeight - ledgeHeight) * generatedY * game.rnd.frac() - appleHeight, "silverApple");
                        silverApple.color = "silver";
                        silverApple.scale.setTo(objectScale, objectScale);
                    } else if (randBoostApple == 6) {
                        var whiteApple = apples.create(generatedX + ledgeWidth * i + appleWidth * j, (canvasHeight - ledgeHeight) * generatedY * game.rnd.frac() - appleHeight, "whiteApple");
                        whiteApple.color = "white";
                        whiteApple.scale.setTo(objectScale, objectScale);
                    } else {
                        var apple = apples.create(generatedX + ledgeWidth * i + appleWidth * j, (canvasHeight - ledgeHeight) * generatedY * game.rnd.frac() - appleHeight, "redApple");
                        apple.scale.setTo(objectScale, objectScale);
                    }
                } else {
                    var apple = apples.create(generatedX + ledgeWidth * i + appleWidth * j, (canvasHeight - ledgeHeight) * generatedY + (canvasHeight - (canvasHeight - ledgeHeight * generatedY)) * game.rnd.frac() + appleHeight, "redApple");
                    apple.scale.setTo(objectScale, objectScale);
                }
            }
        }
    },

    collectapple: function(player, apple) {

        if (apple.color == "yellow") {
            if (!yellowAppleON) {
                yellowAppleStatusBar = game.add.sprite(canvasWidth * 0.8, canvasHeight * 0.01, "yellowApple");
                yellowAppleStatusBar.enableBody = true;
            }
            yellowAppleON = true;
            startTimeBox.yellow = parseInt(gameClock.text);
            this.consoleLogWrapper("yellow apple effect on:" + yellowAppleEffectStart);
            step = 5;
            this.consoleLogWrapper("speed: " + step);
            pickedAppleBox.yellow++;
        } else if (apple.color == "black") {
            currentTimer = parseInt(gameClock.text) + 10;
            gameDuration += 10;
            this.manageStartTime(10);
            game.time.events.stop();
            game.time.events.add(Phaser.Timer.SECOND * currentTimer, this.shutdown, this);
            game.time.events.start();
            pickedAppleBox.black++;
        } else if (apple.color == "purple") {
            if (!purpleAppleON) {
                purpleAppleStatusBar = game.add.sprite(canvasWidth * 0.8 - appleWidth, canvasHeight * 0.01, "purpleApple");
                purpleAppleStatusBar.enableBody = true;
            }
            purpleAppleON = true;
            applePoint = 20;
            this.consoleLogWrapper("purple apple effect on");
            startTimeBox.purple = parseInt(gameClock.text);
            pickedAppleBox.purple++;
        } else if (apple.color == "silver") {
            score += 90;
            this.consoleLogWrapper("consumed a silver apple");
            pickedAppleBox.silver++;
        } else if (apple.color == "white") {
            this.consoleLogWrapper("consumed a white apple");
            pickedAppleBox.white++;
            hearts.forEach(function(heart) {
                if (!heart.alive) {
                    heart.reset(heartStack[heart.id].x, heartStack[heart.id].y);
                }
            });
        }
        // Removes the apple from the screen
        apple.destroy();
        //  Add and update the score
        score += applePoint;
        scoreText.text = "PONT: " + score;
        pickedAppleBox.apple++;
    },

    heartStack: function(x, y) {
        var element = {};
        element.x = x;
        element.y = y;
        if (heartStack.length < 3) {
            heartStack.push(element);
        }
    },

    collideLedge: function() {
        if (game.time.now > timer && !yellowAppleON && !player.body.touching.down) {
            // Update timer.
            timer = game.time.now + cycle;
            // Get the first alive item and kill it.
            var item = hearts.getFirstAlive();
            if (item) {
                this.heartStack(item.x, item.y);
                this.consoleLogWrapper(item.id);
                item.kill();
                item = hearts.getFirstAlive();

            }
            if (!item) {
                this.shutdown();
            }
        }
    },

    yellowAppleEffect: function() {
        var dateDiff = startTimeBox.yellow - parseInt(gameClock.text);
        if (dateDiff > 10) {
            yellowAppleON = false;
            yellowAppleStatusBar.destroy();
            this.consoleLogWrapper("yellow apple effect off:" + dateDiff);
            step = 7;
            this.consoleLogWrapper("speed: " + step);
        }
        // increasing the velocity of coming elements
        ledges.x -= 2.5;
        apples.x -= 2.5;
    },

    purpleAppleEffect: function() {
        var dateDiff = Math.abs(startTimeBox.purple - parseInt(gameClock.text));
        if (dateDiff > 10) {
            purpleAppleON = false;
            applePoint = 10;
            purpleAppleStatusBar.destroy();
            this.consoleLogWrapper("purple apple effect off:" + dateDiff);
        }
    },

    managePause: function(gameapplet = false) {
        pauseStartTime = new Date().getTime();
        this.game.paused = true;
        var optionStyle = { font: "30pt TheMinion", fill: "white", align: "left", stroke: "rgba(0,0,0,0)", srokeThickness: 4 };
        var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, "Folytatáshoz koppints bárhova!", optionStyle);
        this.input.onDown.add(function() {
            this.game.paused = false;
            var calculatedDuration = new Date().getTime() - pauseStartTime;
            this.manageStartTime(calculatedDuration);
            this.consoleLogWrapper(calculatedDuration);
            pauseDuration += calculatedDuration;
            txt.destroy();
            // need this to remove the previously added listener
            game.input.onDown.removeAll();
        }, this);
    },

    manageStartTime: function(duration) {
        for (var key in startTimeBox) {
            if (startTimeBox.hasOwnProperty(key)) {
                startTimeBox[key] += duration;
            }
        }
        this.consoleLogWrapper("pause time added to startTimeBox: " + duration);
    },

    shutdown: function() {
        this.consoleLogWrapper(pickedAppleBox.yellow + " " + pickedAppleBox.black + " " + pickedAppleBox.purple + " " + pickedAppleBox.silver + " " + pickedAppleBox.apple);
        document.getElementById("scoreInput").value = score;
        document.getElementById("durationInput").value = (new Date().getTime() - gameDuration - pauseDuration) / 1000;
        document.getElementById("appleInput").value = pickedAppleBox.apple;
        document.getElementById("yellowInput").value = pickedAppleBox.yellow;
        document.getElementById("blackInput").value = pickedAppleBox.black;
        document.getElementById("purpleInput").value = pickedAppleBox.purple;
        document.getElementById("silverInput").value = pickedAppleBox.silver;
        document.getElementById("whiteInput").value = pickedAppleBox.white;
        this.consoleLogWrapper(document.getElementById("yellowInput").value + " " + document.getElementById("appleInput").value + " " + document.getElementById("purpleInput").value + " " + document.getElementById("silverInput").value + " " + document.getElementById("blackInput").value);

        if (!formSent) {
            $("#scoreForm").ajaxSubmit({
                success: function(response) {
                    //this.consoleLogWrapper(response);
                    yourPlace = response;
                    game.time.events.stop();

                    formSent = true;
                    yellowAppleON = false, purpleAppleON = false;
                    music.stop();
                    game.state.start("GameOver");

                }
            });
        }

    },

    consoleLogWrapper: function(message) {
        if (debugMode) {
            console.log(message);
        }
    },

    randomXY: function(max = 50, min = 10) {
        return Math.floor((Math.random() * max) + min);
    },

    clearGameCache: function() {
        game.cache = new Phaser.Cache(game);
        game.load.reset();
        game.load.removeAll();
    },

    // Fullscreen function
    gofull: function() {

        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        } else {
            game.scale.startFullScreen(false);
        }

    },

    addMenuOption: function(text, callback) {
        var optionStyle = { font: "30pt TheMinion", fill: "white", align: "left", stroke: "rgba(0,0,0,0)", srokeThickness: 4 };
        var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, text, optionStyle);
        txt.anchor.setTo(0.5);
        txt.stroke = "rgba(0,0,0,0";
        txt.strokeThickness = 4;
        var onOver = function(target) {
            target.fill = "#FEFFD5";
            target.stroke = "rgba(200,200,200,0.5)";
            txt.useHandCursor = true;
        };
        var onOut = function(target) {
            target.fill = "white";
            target.stroke = "rgba(0,0,0,0)";
            txt.useHandCursor = false;
        };
        txt.useHandCursor = true;
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback, this);
        txt.events.onInputOver.add(onOver, this);
        txt.events.onInputOut.add(onOut, this);

        this.optionCount++;

    },
};