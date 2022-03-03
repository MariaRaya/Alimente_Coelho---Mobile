const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var corda, corda_1, corda_2;
var fruta_con,fruta_con_1,fruta_con_2;
var fruta, frutaOptions;
var food, backgroundImg;
var rabbit, rabbitImg;
var button,button_1,button_2;
var blink, eat, sad;
var soundAir, soundCut, soundEat, soundSad, soundBk;
var blower, mute_btn;


function preload(){
  food = loadImage("melon.png");
  rabbitImg = loadImage("Rabbit-01.png");
  backgroundImg = loadImage("background.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;

  eat.looping = false;
  sad.looping = false;

  soundCut = loadSound("rope_cut.mp3");
  soundBk = loadSound("sound1.mp3");
  soundEat = loadSound("eating_sound.mp3");
  soundSad = loadSound("sad.wav");
}

function setup() 
{

  // Tamanho dinâmico da tela 

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth; 
    canH = displayHeight; 
    createCanvas(displayWidth+80, displayHeight);
  } 
  else {
    canW = windowWidth; 
    canH = windowHeight; 
    createCanvas(windowWidth, windowHeight);
  }

  frameRate(80);
  soundBk.play();
  soundBk.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200,canH,600,20);

  //Cordas

  corda = new Rope(8,{x: 40,y: 30});
  corda_1 = new Rope(7,{x: 370,y: 40});
  corda_2 = new Rope(4,{x: 400,y: 225});

  frutaOptions = {
    density: 0.001
  };

  fruta = Bodies.circle(300,300,15,frutaOptions);
  

  Matter.Composite.add(corda.body,fruta);

  fruta_con = new Link(corda,fruta);
  fruta_con_1 = new Link(corda_1,fruta);
  fruta_con_2 = new Link(corda_2,fruta);

  rabbit = createSprite(250,canH - 80,100,100);
  rabbit.addImage(rabbitImg);
  rabbit.scale = 0.25;

  // Botões de Corte
  button = createImg("cut_btn.png");
  button.position(20,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button_1 = createImg("cut_btn.png");
  button_1.position(330,35);
  button_1.size(50,50);
  button_1.mouseClicked(drop_1);

  button_2 = createImg("cut_btn.png");
  button_2.position(360,200);
  button_2.size(50,50);
  button_2.mouseClicked(drop_2);


//Animação do Coelho

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  rabbit.addAnimation("piscando", blink);
  rabbit.addAnimation("comendo", eat);
  rabbit.addAnimation("chorando", sad);

  rabbit.changeAnimation("piscando");

  // Vento

  /*blower = createImg("blower.png");
  blower.position(10,250);
  blower.size(150,100);
  blower.mouseClicked(air);*/

  mute_btn = createImg("mute.png");
  mute_btn.position(450,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  imageMode(CENTER);
}

function draw() 
{
  background(51);

  image(backgroundImg,0,0, displayWidth + 80, displayHeight);

  ground.show();
  corda.show();
  corda_1.show();
  corda_2.show();

  // Condição para a fruta aparecer

  if(fruta != null){
  image(food,fruta.position.x,fruta.position.y,60,60);
  }

  if(collided(fruta,rabbit) == true){
    rabbit.changeAnimation("comendo");
    soundEat.play();
  }

  if(fruta != null && fruta.position.y >= 660){
    rabbit.changeAnimation("chorando");
    soundBk.stop();
    soundSad.play();
    fruta = null;
  }

  Engine.update(engine);
  drawSprites();
}

function drop(){
  corda.break();
  fruta_con.separar();
  soundCut.play();
}

function drop_1(){
  corda_1.break();
  fruta_con_1.separar();
  soundCut.play();
}

function drop_2(){
  corda_2.break();
  fruta_con_2.separar();
  soundCut.play();
}

function collided(body,sprite){
  if(body != null){
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);

        if(d <= 80){
          World.remove(engine.world,fruta);
          fruta = null;
          return true;
        } else{
          return false;
        }

  }
}

function air(){
  Matter.Body.applyForce(fruta,{x:0,y:0},{x:0.01,y:0});
}

function mute(){
  if(soundBk.isPlaying()){
    soundBk.stop();
  } else{
    soundBk.play();
  }
}