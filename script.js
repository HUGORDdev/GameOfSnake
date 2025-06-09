window.onload = function()
{
    var canvas;
    var canvaswidth = 900;
    var canvasheight = 600;
    var blockSize = 30;
    var ctx;
    var delay=120;
    var snakee;
    var applee;
    var widthinblock= canvaswidth/blockSize;
    var heightinblock = canvasheight/blockSize;
    var score;
    var Timeout ;
    init();

    // creation du canvas
    function init(){
   canvas = document.createElement('canvas');
   canvas.width= canvaswidth;
   canvas.height= canvasheight;
   canvas.style.border="30px solid gray";
   canvas.style.margin ="50px  auto";
   canvas.style.display ="block";
   canvas.style.backgroundColor = "#ddd";

   document.body.appendChild(canvas);
   ctx = canvas.getContext('2d');
   snakee = new snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
   applee = new Apple( [10,10]);
   score = 0;
    refreshcanvas();
    }
//   permet de rafraichir le canvas en le dessinant sur une nouvelle place
    function refreshcanvas()
    {  
        snakee.advance();
        if(snakee.checkCollision()){
           gameOver();
        } else
        {
              if(snakee.isEatingApple(applee))
              {  score++ ;
                snakee.ateApple= true;
                drawscore();
                do{
                    applee.setNewPosition();
                    }while(applee.isOnsnake(snakee))
                  }
            ctx.clearRect(0,0,canvaswidth,canvasheight);
            drawscore();
            snakee.draw(); 
            applee.draw();      
            Timeout = setTimeout(refreshcanvas,delay);              
        }
    }
    // game over
    function gameOver()
    {
        ctx.save();
        ctx.font ="bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle ="white";
        ctx.lineWidth = 5;
        var centerx = canvaswidth /2 ;
        var centery = canvasheight /2 ;
        ctx.strokeText("game over", centerx , centery -180);
        ctx.fillText("game over", centerx , centery -180);
        ctx.font ="bold 30px sans-serif";
        ctx.strokeText("appuyer sur la touche espace pour rejouer", centerx , centery -120);
        ctx.fillText("appuyer sur la touche espace pour rejouer", centerx , centery -120);
        ctx.restore();
    }
//  fonction restart
 function restart()
 {
    snakee = new snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
   applee = new Apple( [10,10]);
   score = 0;
   clearTimeout(Timeout);
    refreshcanvas();
 }
//  dessin du score
function drawscore()
{
ctx.save();
ctx.font ="bold 200px sans-serif";
ctx.fillStyle = "gray";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
var centerx = canvaswidth /2 ;
var centery = canvasheight /2 ;
ctx.fillText(score.toString() , centerx ,centery);
ctx.restore();
}
    // dessin du serpent
    function drawBlock(ctx,position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);

    }
    //  function permetant de creer des serpent ou encore des objets
    function snake(body,direction)
    {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.draw = function()
    {
        ctx.save();
        ctx.fillStyle = "#ff0000";
        for(var i=0 ; i < this.body.length ; i++)
        {
        drawBlock(ctx,this.body[i]);
        }
        // restore le contex
        ctx.restore();   
    };
    this.advance = function()
    {
        // la fonction slice ici nous permets de crer un new elements a partir de this.body
      var nextposition = this.body[0].slice();
      switch (this.direction)
      {
        case "left":
        nextposition[0] -= 1;
         break;
         case "right":
         nextposition[0] += 1;
         break;
         case "down":
         nextposition[1] += 1;
         break;
         case "up":
         nextposition[1] -= 1;
         break;
         default:
            throw("invalid direction");

      }
    //    unshit permet d'ajouter un element a la premiere position dans un tableau
       this.body.unshift(nextposition);
       if(!this.ateApple)
       {
       this.body.pop();
       }else{
        this.ateApple = false;
       }
    };
    this.setDirection = function(newDirection)
    {
        var allowedDirections;
        switch(this.direction){
            case "left":
            case "right":
             allowedDirections =["up","down"];
             break;
            case "down":
            case "up":
                    allowedDirections =["left","right"];
                 break;
                 default:
                    throw("invalid direction");
    }
    if( allowedDirections.indexOf(newDirection) > -1)
        {
            this.direction = newDirection;
        }
    };
    //   pour les collisions
    this.checkCollision = function()
    {
     var wallCollision = false ;
     var snakeCollision = false ;
     var head = this.body[0];
     var rest = this.body.slice(1);
     var snakex = head[0];
     var snakey = head[1];
     var minx = 0;
     var maxx = widthinblock -1;
     var miny = 0 ;
     var maxy = heightinblock -1;
     var isNotBetweenHorizontalWalls = snakex< minx || snakex> maxx ;
     var isNotBetweenVerticalWalls = snakey< miny || snakey> maxy ;
     if (  isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls   )
        {
       wallCollision = true ;
        } 
        for(i=0; i < rest.length ; i++ )
        {
       if(snakex == rest[i][0] && snakey ==  rest[i][1])
        {
        snakeCollision = true;

       }
        }
        return snakeCollision || wallCollision ;
    };
    this.isEatingApple = function (appleToEat)
    {
        var head = this.body[0];
        if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1] )
        {
         return true;
        }else{
         return false;
        }
    };
}
// creation  de la pomme
 function Apple(position)
 {
    this.position = position ;
    this.draw = function()
    {
        ctx.save();
        ctx.fillStyle = "#33cc33";
        ctx.beginPath();
        var radius = blockSize / 2;
        var x = this.position[0]*blockSize + radius;
        var y = this.position[1]*blockSize + radius;
        ctx.arc(x,y,radius,0,Math.PI*2,true);
        ctx.fill();
        ctx.restore();
    };
    this.setNewPosition = function ()
    {
        var newx = Math.round(Math.random() * (widthinblock - 1));
        var newy = Math.round(Math.random() * (heightinblock - 1));
        this.position = [newx , newy];
    };
    this.isOnsnake = function(snakeToCheck)
    {
      var inonsnake = false;
      for ( var i = 0 ;i <snakeToCheck.body.length; i++)
      {
        if(this.position[0]== snakeToCheck.body[i][0] && this.position[1]== snakeToCheck.body[i][1])
        {
        inonsnake = true ;
        }
      }
    };
 }
// permet de recuperer les touches de directions
document.onkeydown= function handlekeydown(e)
{
  var key = e.keyCode;
  var newDirection;
  switch(key)
  {
    case 37:
        newDirection = "left";
        break;
     case 38:
            newDirection = "up";
            break;
    case 39:
                newDirection = "right";
            break;
    case 40:
                newDirection = "down";
            break;
    case 32:
      restart();
      return;
    default:
                return;
  }
  snakee.setDirection(newDirection);
}

}