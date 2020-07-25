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



var stages = [[1,[
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

]], [2,[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,2,0,0,0,2,2,2,2,0,0,2,2,0],
[0,0,2,2,2,2,2,2,0,2,0,0,2,2,0],
[0,0,2,0,0,2,2,2,0,2,2,2,2,2,0],
[0,0,2,2,2,0,2,2,0,0,2,2,2,0,0],
[0,2,2,0,0,0,0,2,0,0,0,2,0,0,0],
[0,0,2,0,0,0,2,2,2,0,0,2,2,2,0],
[0,2,2,2,0,0,2,0,0,2,2,2,2,2,0],
[0,2,2,2,0,0,3,0,0,2,2,2,2,2,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

]
]];

var map = new Map(stages);

var stage;

var newDiv;
var buttonNext;


function drawStage(){

	if(lvl==1){
		stage=map.get(1);

	}if(lvl==2){
		stage=map.get(2);

	}
	for(y=0; y<heightStage; y++){
		for(x=0; x<widthStage; x++){
			
			var tile= stage[y][x];
			/*ctx.fillStyle = color;
			ctx.fillRect(x*widthF, y*heightF, widthF,heightF);

			*/
			ctx.drawImage(tilemap,tile*101,0,101,118,widthF*x,heightF*y,widthF,heightF);
		}

	}
}

function startGame(){
	var divIni = document.getElementById('ini');
	divIni.remove();
	music.play();
	lvl=1;
	document.getElementById('canvas').style.display = 'block';
	initialization();
}



var bad=function(x,y){
	this.x=x;
	this.y=y;
	this.direction=Math.floor(Math.random()*4);
	this.delayEnemy=50;
	this.counter=0;
	
	console.log("enemigo creado");
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

var player = function(){

	this.x=2;
	this.y=1;
	this.color='#57007FFF';
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
		console.log("Has ganado!!");
		document.getElementById('canvas').style.display = 'none';
		newDiv = document.createElement("div"); 
		buttonNext = document.createElement("button");
		
		buttonNext.innerText = 'Haz Click';
		buttonNext.onclick = function(){
			newDiv.remove();
			alert("hola");
			document.getElementById('canvas').style.display = 'block';
			initialization();
		};

		var newContent = document.createTextNode("Has ganado!!"); 
		newDiv.appendChild(newContent); 
		newDiv.appendChild(buttonNext);  
		document.body.appendChild(newDiv);  

		lvl++;
		
	}

	this.dead= function(){
		soundDead.play();
		console.log("Has perdido!!");
		this.x=1;
		this.y=1;
		this.key=false;
		stage[8][3]=3;
	}

	this.objectsLogic = function(){
		var object = stage[this.y][this.x];
		if(object==3){
			this.key=true;
			stage[this.y][this.x]=2;
			console.log("Has obtenido la llave!!!!");

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




function initialization(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');


	tilemap=new Image();
	tilemap.src='img/tilemap2.png';


	protagonist = new player();

	enemy.push(new bad(Math.floor(Math.random() * 8)+2,Math.floor(Math.random() * 13)+2));
	enemy.push(new bad(Math.floor(Math.random() * 8)+2,Math.floor(Math.random() * 13)+2));
	enemy.push(new bad(Math.floor(Math.random() * 8)+2,Math.floor(Math.random() * 13)+2));

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


	setInterval(function(){
		principal();
	},1000/FPS);
}




function deleteCanvas(){
	canvas.width=750;
	canvas.height=500;
}

function principal(){
	deleteCanvas();
	drawStage();
	protagonist.draw();

	for(c=0; c<enemy.length; c++){
		enemy[c].move();
		enemy[c].draw();
	}


}