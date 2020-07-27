var canvas;
var ctx;
var FPS = 50;

var widthF = 50;
var heightF = 50;

var wall = '#044f14';
var door = '#3a1700';
var ground = '#c6892f';
var keyAward = '#c6bc00';

var protagonist;
var tilemap;
var enemy=[];

var widthStage = 15;
var heightStage = 10; 

var soundWin;
var soundDead;
var music; 
var lvl;
music= new Howl({
	src:['music/snitch.wav'],
	loop: true
});
soundWin = new Howl({
	src:['sound/orchestra.wav'],
	loop: false
});
soundDead= new Howl({
	src:['sound/gameOver.wav'],
	loop: false
});

var iniPositionX=2;
var iniPositionY=1;

var stages = [
[1,[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,2,2,0,0,0,2,2,2,2,0,0,2,2,0],
[0,0,2,2,2,2,2,2,0,2,0,0,2,2,0],
[0,0,2,0,0,2,2,2,0,2,2,2,2,2,0],
[0,0,2,2,2,0,2,2,0,0,2,2,2,0,0],
[0,2,2,0,0,0,0,2,0,0,0,2,0,0,0],
[0,0,2,0,0,0,2,2,2,0,0,2,2,2,0],
[0,2,2,2,0,0,2,0,0,2,2,2,2,2,0],
[0,2,2,3,0,0,2,0,0,1,2,2,2,2,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

]], 
[2,[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,3,0,0,0,0,2,2,2,2,0,0,2,1,0],
[0,2,2,2,2,2,2,2,0,2,0,0,2,2,0],
[0,2,2,0,0,2,2,2,0,2,2,2,2,2,0],
[0,0,2,2,2,0,2,2,0,0,2,2,2,0,0],
[0,2,2,0,0,0,0,2,0,0,0,2,0,0,0],
[0,2,0,2,2,2,2,0,2,0,2,2,2,2,0],
[0,2,0,2,0,0,2,0,2,0,2,2,2,2,0],
[0,2,2,2,0,0,2,2,2,2,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

]],
[3,[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,2,2,2,0,2,2,2,2,2,0],
[0,0,1,0,0,2,0,2,0,2,0,0,0,0,0],
[0,0,2,0,0,2,0,2,0,2,2,2,0,0,0],
[0,2,2,0,0,2,0,2,0,0,0,2,2,0,0],
[0,2,0,0,0,2,0,2,2,2,2,0,2,0,0],
[0,2,0,2,2,2,0,0,0,0,2,0,2,2,0],
[0,2,0,2,0,0,0,0,0,0,2,0,0,2,0],
[0,2,2,2,0,0,0,0,0,0,2,2,2,3,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

]],
[4,[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,2,2,2,2,0,0,2,1,0],
[0,2,2,2,2,2,2,2,0,2,0,0,2,2,0],
[0,2,2,0,0,2,2,2,0,2,2,2,2,2,0],
[0,0,2,2,2,0,2,2,0,0,2,2,2,0,0],
[0,2,2,0,0,0,0,2,0,0,0,2,0,0,0],
[0,2,0,2,2,2,2,0,2,0,0,2,2,2,0],
[0,2,0,2,0,0,2,0,2,0,2,2,2,2,0],
[0,2,2,2,0,0,2,2,2,2,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

]]
];

var map = new Map(stages);

var stage;

var newDiv;
var buttonNext;

var newDiv;

var principalTime;

function startGame(){

	
	document.getElementById('ini').remove();
	music.play();
	lvl=1;
	canvas = document.getElementById('canvas');
	document.getElementById('canvas').style.display = 'block';
	ctx = canvas.getContext('2d');

	tilemap=new Image();
	tilemap.src='img/tilemap2.png';
	
	initialization();
	document.getElementById('star').style.visibility = 'visible';
}



function initialization(){


	
	
	document.addEventListener('keydown',function(keyb){
	    //console.log(keyb.keyCode); know the Code of keys

	    if(keyb.keyCode == 87){
	    	protagonist.up();

	    }
	    if(keyb.keyCode == 83){
	    	protagonist.down();
	    }
	    if(keyb.keyCode == 65){
	    	protagonist.left();
	    }
	    if(keyb.keyCode == 68){
	    	protagonist.rigth();
	    }
	})

	newLvl();
	
}

function newLvl(){
	protagonist = new player(iniPositionX,iniPositionY);
	createEnemy();
	deleteKeyOnInventory();
	setKey();
	principalTime= setInterval(principal,1000/FPS);
	

}



function createEnemy(){
	console.log("debo crear"+(lvl+2)+" enemigos para nivel"+ lvl);
	var i=0;
	for ( i = 0; i < (lvl+2); i++) {
		y=Math.floor(Math.random() * 8)+2;
		x=Math.floor(Math.random() * 13)+2;
		enemyB=new bad(x,y);
		var valorMapa=stage[y][x];

		if(stage[y][x]==2){
			enemy.push(enemyB);
		}else {
			i--;
		}

	}
	

}


function killEnemy(){
	enemy=[];
}


function setKey(){
	switch(lvl){
		case 1:
		stage[8][3]=3;
		break;
		case 2:
		stage[1][1]=3;
		break;
		case 3:
		stage[8][13]=3;
		break;
		case 4:
		stage[1][1]=3;
		break;

	}
}


function principal(){
	deleteCanvas();
	drawStage();
	
	protagonist.draw();

	for(c=0; c<enemy.length; c++){
		enemy[c].move();
		enemy[c].draw();
	}
	document.getElementById("txtLvl2").innerHTML=lvl;
}





function selectStage(){
	switch(lvl){
		case 1:
		stage=map.get(1);
		break;
		case 2:
		stage=map.get(2);
		break;
		case 3:
		stage=map.get(3);
		break;
		case 4:
		stage=map.get(4);
		break;

	}
	return stage;
}

function drawStage(){
	stage=selectStage();
	for(y=0; y<heightStage; y++){
		for(x=0; x<widthStage; x++){
			
			var tile= stage[y][x];
			ctx.drawImage(tilemap,tile*101,0,101,118,widthF*x,heightF*y,widthF,heightF);
		}

	}
}




var bad=function(x,y){
	stage=selectStage();
	this.x=x;
	this.y=y;
	this.direction=Math.floor(Math.random()*4);
	this.delayEnemy=50;
	this.counter=0;
	
	this.draw=function(){
		//ctx.fillStyle = this.color;
		ctx.drawImage(tilemap,199,127,101,118,this.x*widthF, this.y*heightF, widthF,heightF);
	}

	this.checkColision = function(x,y){
		var collisionOk=false;
		if(stage[y][x]==0){
			collisionOk=true;
		}
		return collisionOk
	}

	this.move = function(){

		protagonist.enemyCollision(this.x, this.y);

		if(this.counter < this.delayEnemy){

			this.counter++;

		}else{

			this.counter=0;

			if(this.direction==0){
				if(this.checkColision(this.x,this.y-1)==false){
					this.y--;
				}else{
					this.direction = Math.floor(Math.random()*4);
				}
			}
			if(this.direction==1){
				if(this.checkColision(this.x,this.y+1)==false){
					this.y++;
				}else{
					this.direction = Math.floor(Math.random()*4);
				}
			}
			if(this.direction==2){
				if(this.checkColision(this.x-1,this.y)==false){
					this.x--;
				}else{
					this.direction = Math.floor(Math.random()*4);
				}
			}
			if(this.direction==3){
				if(this.checkColision(this.x+1,this.y)==false){
					this.x++;
				}else{
					this.direction = Math.floor(Math.random()*4);
				}
			}
		}
	}
}

var player = function(x,y){
	stage=selectStage();
	this.x=x;
	this.y=y;
	this.key=false;

	this.draw=function(){
		//ctx.fillStyle = this.color;
		ctx.drawImage(tilemap,0,127,101,118,this.x*widthF, this.y*heightF, widthF,heightF);


	}
	this.margin = function(x,y){
		var collision=false;
		if(stage[y][x] == 0){
			collision=true;
		}
		return collision;
	}

	this.up = function(){
		if(this.margin(this.x,this.y-1)==false){
			this.y --;
			this.objectsLogic();
		}
	}
	this.down = function(){
		if(this.margin(this.x,this.y+1)==false){
			this.y ++;
			this.objectsLogic();
		}
		
	}
	this.left = function(){
		if(this.margin(this.x-1,this.y)==false){
			this.x --;
			this.objectsLogic();
		}
		
	}
	this.rigth = function(){
		if(this.margin(this.x+1,this.y)==false){
			this.x ++;
			this.objectsLogic();
		}
		
	}
	this.victory= function(){
		soundWin.play();
		forcePauseGame();
		setNewLvl();
		
	}

	this.dead= function(){
		soundDead.play();
		forcePauseGame();
		createDivDead();
		
	}

	this.objectsLogic = function(){
		stage=selectStage();
		var object = stage[this.y][this.x];
		if(object==3){
			this.key=true;
			stage[this.y][this.x]=2;
			console.log("Has obtenido la llave!!!!");
			putKeyOnInventory();

		}
		if(object==1){
			if(this.key==true){
				this.victory();
			}else{
				console.log("Te falta la llave, no puedes pasar....");
			}
		}
	}

	this.enemyCollision = function(x,y){

		if(this.x == x && this.y == y){

			this.dead();

		}
	}
	

}

function putKeyOnInventory(){
	document.getElementById('inventory').innerHTML='<img src="img/key.png" id="imgKey" style="width:50px; height:50px;" />';
}
function deleteKeyOnInventory(){
	if(document.getElementById('imgKey')) {
  document.getElementById('imgKey').style.display='none';
}
}
	

function forcePauseGame(){
	clearInterval(principalTime);
	console.log("intervalo parado");
	killEnemy();
	protagonist.key=false;
	document.getElementById('canvas').style.display = 'none';
}

function setNewLvl(){
	lvl++;
	iniPositionX=protagonist.x;
	iniPositionY=protagonist.y;
	createDivNextLvl();
}

function createDivNextLvl(){
	var result=createNewDiv("Has ganado!!!!!");
	buttonNext.onclick = function(){
		newDiv.remove();
		newLvl();
		document.getElementById('canvas').style.display = 'block';
	};
	
}
function createDivDead(){
var result=createNewDiv("Has muerto!!!");

	buttonNext.onclick = function(){
		newDiv.remove();
		newLvl();
		document.getElementById('canvas').style.display = 'block';
	};
	
}

function createNewDiv(state){
	newDiv=document.createElement("div"); 
	newDiv.setAttribute("class", "divNew");
	buttonNext = document.createElement("button");
	buttonNext.innerText = 'Haz Click';
	newDiv.appendChild(buttonNext);  
	var newH2= document.createElement("H2");
	var newText = document.createTextNode(state);
	newH2.appendChild(newText);
	newDiv.appendChild(newH2);
	document.body.appendChild(newDiv); 
	return newDiv;
}


function deleteCanvas(){
	canvas.width=750;
	canvas.height=500;
}

