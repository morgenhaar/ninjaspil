/**
 * Created by markusobelitzsoe on 18/05/16.
 */


var stage;
var hero;
var gameIsRunning = true;
var level = 1;
var lives = 3;
var score = 0;
var stars = [];
var enemies = [];
var keys = {
    rkd: false,
    lkd: false,
    ukd: false,
    dkd: false
};
var scoreText;
var levelText;

var queue;
var preloadText;
var zombieSpriteSheet;
var starsMissed = 0;

function preload(){
    stage = new createjs.Stage("boks");
    preloadText = new createjs.Text("0%", "30px Courier", "#FFF");
    stage.addChild(preloadText);
    queue = new createjs.LoadQueue(true);
    queue.on("progress", progress);
    queue.on("complete", init);

    queue.loadManifest([
        "../img/viola.png",
        "../img/zombieWalk.gif",
        "../img/dropken.png",
        {id:"zombieSS", src:"zombiesheet.json"},
        "../img/zombieSheet.png"
    ]);
}

function progress(evt){
    preloadText.text = Math.round(evt.progress*100) + "%";
    stage.update();

}

function init(){
    stage.removeChild(preloadText);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tickHappened);

    //"../img/ninja.png"

    hero = new createjs.Bitmap(queue.getResult("../img/viola.png"));
    
    stage.addChild(hero);

    scoreText = new createjs.Text("Score: " + score, "30px Courier", "#FFF");
    stage.addChild(scoreText);
    levelText = new createjs.Text("Level: " + level, "30px Courier", "#FFF");
    levelText.y = 30;
    stage.addChild(levelText);

    //stage.addChild(midt);
    /*blomsten = new createjs.Container();
    blomsten.addChild(blad1, blad2, stilk, kronen);
    stage.addChild(blomsten);*/

    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);

    hero.speed = 4;
    hero.height = 102;
    hero.width = 108;
    hero.x = stage.canvas.width/2 - (hero.width/2);
    hero.y = 0;




    addEnemies();
}

function addEnemies(){
    var i;
    for(i=0; i<level; i++) {
        zombieSpriteSheet = new createjs.SpriteSheet(queue.getResult("zombieSS"));
        var temp = new createjs.Sprite(zombieSpriteSheet, "walk");
        temp.width = 64;
        temp.height = 64;
        stage.addChild(temp);
        temp.y = stage.canvas.height;
        temp.x = Math.floor(Math.random()*(stage.canvas.width-temp.width));
        enemies.push(temp);
    }
}

function fingerUp(e){
    if(e.keyCode===37){
        keys.lkd=false;
    }
    /*if(e.keyCode===38){
        keys.ukd=false;
    }*/
    if(e.keyCode===39){
        keys.rkd=false;
    }
    if(e.keyCode===40 || e.keyCode===32){
        fire();
    }

}

function fingerDown(e){
    if(e.keyCode===37){
        keys.lkd=true;
    }
    /*if(e.keyCode===38){
        keys.ukd=true;
    }*/
    if(e.keyCode===39){
        keys.rkd=true;
    }
    /*if(e.keyCode===40){
        keys.dkd=true;
    }*/

}

function moveHero(){
    if(keys.lkd){
        hero.x-=hero.speed;
        if(hero.x < -hero.width){
            hero.x = stage.canvas.width + hero.width/2;
        }
    }
    /*if(keys.ukd){
        hero.y-=hero.speed;
    }*/
    if(keys.rkd){
        hero.x+=hero.speed;
        if(hero.x > stage.canvas.width + hero.width/2){
            hero.x = -hero.width;
        }
    }
    /*if(keys.dkd){
        hero.y+=hero.speed;
    }*/



}

function fire(){
    var temp = new createjs.Bitmap(queue.getResult("../img/dropken.png"));
    temp.x = hero.x+hero.width-15;
    temp.y = hero.y+hero.height*0.8;
    temp.height = 27;
    temp.width = 29;
    temp.regX = temp.width/2;
    temp.regY = temp.height/2;
    temp.height = 5;
    temp.width = 5;

    stage.addChild(temp);
    stars.push(temp);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function(){
        if(gameIsRunning){temp.rotation+=5;}
    });



}

function moveStars(){
    var i;
    var length = stars.length-1;
    for (i = length; i >= 0; i--){
        stars[i].y+=4;
        if(stars[i].y > stage.canvas.height+stars[i].height){
            stage.removeChild(stars[i]);
            stars.splice(i, 1);
            starsMissed++;
        }
    }
}

function moveEnemies(){
    var i;
    var length = enemies.length-1;
    for (i = length; i >= 0; i--){
        enemies[i].y-=3;
        if(enemies[i].y < -enemies[i].height){
            enemies[i].y = stage.canvas.height;
        }
    }
}


function hitTest(obj1, obj2) {
    if( obj1.x >= obj2.x + obj2.width ||
        obj2.x >= obj1.x + obj1.width ||
        obj1.y >= obj2.y + obj2.height||
        obj2.y >= obj1.y + obj1.height  )
    {
        return false;
    }
    return true;
}

function checkCollision(){
    var e;
    var b;
    var eLength = enemies.length-1;
    var bLength = stars.length-1;

    for(e=eLength; e>=0; e--){

        for(b=bLength; b>=0; b--){
            if(hitTest(enemies[e], stars[b])){
                console.log("hit");
                stage.removeChild(stars[b], enemies[e]);
                stars.splice(b, 1);
                enemies.splice(e, 1);
                score++;

                if(enemies.length===0){
                    level++;
                    addEnemies();
                }

            }
        }

        if(hitTest(enemies[e], hero)){
            stage.removeChild(hero, enemies[e]);
            gameIsRunning = false;
            var endText = new createjs.Text("You have dishonored your family >_< \nYour score is " + score +"\nand you missed "+ starsMissed +" stars!" +"\nRefresh to restart", "30px Courier", "#FFF");
            endText.lineHeight = "30";
            endText.textAlign = "center";
            endText.textBaseline = "middle";
            endText.y = stage.canvas.height/2;
            endText.x = stage.canvas.width/2;
            stage.addChild(endText);
        }
    }

}



function tickHappened(e){
    if(gameIsRunning) {
        moveEnemies();
        moveHero();
        moveStars();
        checkCollision();

        scoreText.text = "Score: "+score;
        levelText.text = "Level: "+level;
    }

    stage.update(e);
}