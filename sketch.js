var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudGroup, obstacleGroup;
var PLAY = 1
var END = 0
var gameState = PLAY;
var gameOver;
var restart
var die,checkpoint,jump;


var score = 0;
var highScore;
localStorage[highScore];

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOver = loadImage("gameOver-1.png");
  restart = loadImage("restart.png");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  jump = loadSound("jump.mp3");
  
  
}

function setup() {
      

  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //generate random numbers
  var rand =  Math.round(random(1,100));
 // console.log(rand)

  cloudGroup = new Group();
  obstacleGroup = new Group();
  
  trex.setCollider("circle",0,0,27);
  trex.debug = true;

    
  
  gameOver1 = createSprite(300,75);
  gameOver1.addImage(gameOver);
  gameOver1.scale = .75;
  restart1 = createSprite(300,105,5,5);
  restart1.addImage(restart);
  restart1.scale = 0.5;
}

function draw() {
  
  //set background color
  background("green");
  
  if(gameState === PLAY){
    
    ground.velocityX = -(3 + score/300);
    
    if(score % 500 === 0 && score > 0){
      checkpoint.play();
    }
    
    gameOver1.visible = false;
    restart1.visible = false;
    
  
    
    // if(obstacleGroup.isTouching(trex)){
    //   trex.velocityY = -15;
    //   jump.play();
    // }
    
    if(obstacleGroup.isTouching(trex)){
      gameState = END;
      die.play();
  }
      
    
      score = score + Math.round(getFrameRate()/60);
  
 // jump when the space key is pressed
  if(keyDown("space")&& trex.y >= 150) {
    trex.velocityY = -17;
    jump.play();
  }
  
  trex.velocityY = trex.velocityY + 0.9
  
     if (ground.x < 0){
    ground.x = ground.width/2;
  }
     obstacles();
  spawnClouds();
  } else if(gameState === END){
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
       gameOver1.visible = true;
       restart1.visible = true;
       trex.changeAnimation("collided",trex_collided);
       if(mousePressedOver(restart1)){
         reset();
       }
       
  }
  //console.log(trex.y)
  
  stroke("black");
  textSize(15);
  text("SCORE:"+ score,350,50);
  text("HIGH SCORE:"+ localStorage[highScore],460,50);
  
  //stop trex from falling down
  trex.collide(invisibleGround);
 
  // console.log(frameCount);
  drawSprites();
}

//function to spawn the clouds
function spawnClouds(){
  if(frameCount % 60 === 0){
  var clouds = createSprite(650,50,20,10);
    clouds.addImage(cloudImage)
  clouds.velocityX = -3;
    clouds.y = Math.round(random(10,60));
   clouds.depth = trex.depth;
    trex.depth = trex.depth + 1;
     clouds.lifetime = 200;
    cloudGroup.add(clouds);
  }
}

function obstacles(){
  
  if(frameCount % 100 === 0){
    var obstacle = createSprite(600,160,10,10);
    obstacle.velocityX = -3 -(score/300);
    var obs = Math.round(random(1,6));
   switch(obs){
     case 1: obstacle.addImage(obstacle1)
       break;
       case 2: obstacle.addImage(obstacle2)
       break;
       case 3: obstacle.addImage(obstacle3)
       break;
       case 4: obstacle.addImage(obstacle4)
       break;
       case 5: obstacle.addImage(obstacle5)
       break;
       case 6: obstacle.addImage(obstacle6)
       break;
       default: break
       }
       obstacle.scale = 0.55;
       obstacle.lifetime = 200;
       obstacleGroup.add(obstacle)
       //console.log("obstacle velocity",obstacle.velocityX);
       //console.log("ground velocity",ground.velocityX); 
       //obstacle.debug = true;
  } 
}

  function reset(){
    
    gameState = PLAY;
    obstacleGroup.destroyEach();
    cloudGroup.destroyEach();
    trex.changeAnimation("running", trex_running);
    if(score > localStorage[highScore]){
      localStorage[highScore] = score;
    }
    score = 0;
    
  }
