var PathGenerator = {

    generateElements: function() {
        if (Math.abs(ledges.x) > ledgeWidth * 3 * round) {
            this.firstPart();
            round++;
            console.log(ledges.x);
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
                var appleXCoordinate = generatedX + ledgeWidth * i + appleWidth * j;
                var appleYCoordinate = (canvasHeight - ledgeHeight) * generatedY * game.rnd.frac() - appleHeight;
                if ((canvasHeight - ledgeHeight) * generatedY * appleRand - appleHeight > (canvasHeight * 0.1)) {
                    switch (randBoostApple) {
                        case 4:
                            var yellowApple = apples.create(appleXCoordinate, appleYCoordinate, "yellowApple");
                            yellowApple.color = "yellow";
                            yellowApple.scale.setTo(objectScale, objectScale);
                            break;
                        case 8:
                            var timeApple = apples.create(appleXCoordinate, appleYCoordinate, "timeApple");
                            timeApple.color = "black";
                            timeApple.scale.setTo(objectScale, objectScale);
                            break;
                        case 12:
                            var purpleApple = apples.create(appleXCoordinate, appleYCoordinate, "purpleApple");
                            purpleApple.color = "purple";
                            purpleApple.scale.setTo(objectScale, objectScale);
                            break;
                        case 16:
                            var silverApple = apples.create(appleXCoordinate, appleYCoordinate, "silverApple");
                            silverApple.color = "silver";
                            silverApple.scale.setTo(objectScale, objectScale);
                            break;
                        case 6:
                            var whiteApple = apples.create(appleXCoordinate, appleYCoordinate, "whiteApple");
                            whiteApple.color = "white";
                            whiteApple.scale.setTo(objectScale, objectScale);
                            break;
                        default:
                            var apple = apples.create(appleXCoordinate, appleYCoordinate, "redApple");
                            apple.scale.setTo(objectScale, objectScale);
                            break;
                        case 6:
                            day = "Saturday";
                    }
                } else {
                    var apple = apples.create(generatedX + ledgeWidth * i + appleWidth * j, (canvasHeight - ledgeHeight) * generatedY + (canvasHeight - (canvasHeight - ledgeHeight * generatedY)) * game.rnd.frac() + appleHeight, "redApple");
                    apple.scale.setTo(objectScale, objectScale);
                }
            }
        }
    }
};