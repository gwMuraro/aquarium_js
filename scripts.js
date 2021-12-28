var CLOCK_TIME = 35
var MOVING_TIME = 1000
var VELOCITY = 1
var LAYOUT_MAX_WIDTH  = 600
var LAYOUT_MAX_HEIGHT = 400
var LAYOUT_MIN_WIDTH  = 0
var LAYOUT_MIN_HEIGHT = 0
var LAYOUT_POSITION_LEFT = 50
var LAYOUT_POSITION_TOP  = 50

var interv ; 
var ctx ;
var fishes = []
var grasses = []

var DIRECTIONS = {
    "0": {"id":"left", "coef_x":-1, "coef_y": 0}, 
    "1": {"id":"right", "coef_x": 1, "coef_y": 0},
    "2": {"id":"top", "coef_x": 0, "coef_y":-1},
    "3": {"id":"bottom", "coef_x": 0, "coef_y": 1},
    "4": {"id":"top-left", "coef_x":-1, "coef_y":-1},
    "5": {"id":"top-right", "coef_x": 1, "coef_y":-1},
    "6": {"id":"bottom-left", "coef_x":-1, "coef_y": 1},
    "7": {"id":"bottom-right", "coef_x": 1, "coef_y": 1}
}

function getRandomDirection(){

    return random(0,7); 

}

function getDirectionVector(forceDirection=null) {
    
    var pile = []
    if(forceDirection != null) {
        var direct = forceDirection[random(0,forceDirection.length-1)]
        for (var i = 0 ; i < random(50,100) ; i++) {
            pile.push(direct)
        }
    }
    else {
        for (var i = 0 ; i < MOVING_TIME ; i++) {
            current_direction = ""+getRandomDirection() ;
            for (var j = 0 ; j < random(100,400) ; j++) {
                pile.push(current_direction); 
            }
            i += j ; 
        }
    }
    return pile ;

}

function deplacement(pixel) {
    return pixel * VELOCITY 
}

function move(x, y, vector) {
    
    if (vector.length == 0 ) {
        vector = getDirectionVector() ; 
    } 
    var direction = vector.pop() ;  ; 
    var new_x ; 
    var new_y ; 
    
    // Defining direction where the fish should go and correct if it's OOB 
    if ( x + deplacement(DIRECTIONS[""+direction]["coef_x"]) < LAYOUT_MIN_WIDTH ) {
        vector = getDirectionVector(forceDirection=["1", "5", "7"]) 
        direction = vector.pop() ; 
    } 
    if ( x + deplacement(DIRECTIONS[""+direction]["coef_x"]) > LAYOUT_MAX_WIDTH ) {
        vector = getDirectionVector(forceDirection=["0", "4", "6"]) 
        direction = vector.pop() ; 
    }  
    if ( y + deplacement(DIRECTIONS[""+direction]["coef_y"]) < LAYOUT_MIN_HEIGHT ) {
        vector = getDirectionVector(forceDirection=["3", "6", "7"]) 
        direction = vector.pop() ; 
    } 
    if ( y + deplacement(DIRECTIONS[""+direction]["coef_y"]) > LAYOUT_MAX_HEIGHT ) {
        vector = getDirectionVector(forceDirection=["2", "4", "5"]) 
        direction = vector.pop() ; 
    } 

    new_x = x + deplacement(DIRECTIONS[""+direction]["coef_x"]) 
    new_y = y + deplacement(DIRECTIONS[""+direction]["coef_y"]) 
    
    // setting new X and Y positions 
    return [new_x, new_y, direction, vector]

}


function initiateGame(){
    
    // Loading the models : 
    var nbFish =  [null, "", , "0", 0].includes(document.getElementById('numberOfFish').value) ? 1 : document.getElementById('numberOfFish').value
    console.log(document.getElementById('numberOfFish').value)
    for (var ct = 0 ; ct < nbFish ; ct++){
        addFish()
    }

    // Getting canvas and doing the macro parameters 
    const canvas = document.querySelector("canvas") ; 
    canvas.style.position = "absolute" ;
    canvas.style.left  = ""+LAYOUT_POSITION_LEFT  + "px";
    canvas.style.top   = ""+LAYOUT_POSITION_TOP + "px"; 
    canvas.width = LAYOUT_MAX_WIDTH ; 
    canvas.height = LAYOUT_MAX_HEIGHT ;     
    canvas.style.border = "1px solid #55ADAB"

    ctx = canvas.getContext("2d") ; 

    // Generate grasses 
    for (var i = 0 ; i < 75 ; i++){
        var origin = i*random(5, 10)
        
        grass = {
            "origin":origin,
            "current_origin":origin+random(1,5),
            "x_end1":origin,
            "x_end2":origin+2,
            "increment":0.5 + Math.random()
        }
        grasses.push(grass) ;
    }

    // setting the buttons attribute 
    document.getElementById("play").hidden = true 
    document.getElementById("stop").hidden = true 
    document.getElementById("add").hidden =  true
    
}

function drawFish(x, y, direction) {
    
    ctx.fillStyle = "orange" ; 
   
    if (["1", "5", "7"].includes(direction)) {
        ctx.fillText("><°>", x, y);
    } if (["0", "4", "6"].includes(direction)) {
        ctx.fillText("<°><", x, y);
    } if (["2", "3"].includes(direction)) {
        ctx.fillText("<°><", x, y)
    }
    
} ;

function drawGrass(origin, x1, x2) {

    ctx.beginPath();
    ctx.fillStyle = "#00AA00"   
    ctx.moveTo(origin, LAYOUT_MAX_HEIGHT-150);
    ctx.lineTo(x1, LAYOUT_MAX_HEIGHT);
    ctx.lineTo(x2, LAYOUT_MAX_HEIGHT);
    ctx.fill();

}

function drawBackground(){
    
    var gradient = ctx.createLinearGradient(0,0,0,LAYOUT_MAX_HEIGHT-10)
    gradient.addColorStop(0,"blue")
    gradient.addColorStop(1,"darkblue")
    ctx.fillStyle = gradient
    ctx.fillRect(LAYOUT_MIN_WIDTH, LAYOUT_MIN_HEIGHT, LAYOUT_MAX_WIDTH, LAYOUT_MAX_HEIGHT)
    
}

function clockTime(){
    // clear 
    ctx.clearRect(LAYOUT_MIN_WIDTH,LAYOUT_MIN_HEIGHT,LAYOUT_MAX_WIDTH, LAYOUT_MAX_HEIGHT)
    
    // Draw background 
    drawBackground() ;
    
    // draw grass 
    for (const grass of grasses){
        drawGrass(Math.floor(grass["current_origin"]), grass["x_end1"], grass["x_end2"] )    
    }

    // draw each fishes
    for (const fish of fishes){
        // set the next move of the fish 
        const osef = move(fish["x"], fish["y"], fish["vector"]) ;      
        
        fish["x"] = osef[0] 
        fish["y"] = osef[1]
        fish["vector"] = osef[3]
        var direction = osef[2]

        // draw the fish 
        drawFish(fish["x"], fish["y"], direction) ;
    }
    // ctx.closePath() ;
}

function random(min, max){return Math.floor(Math.random() * (max - min + 1) + min)}

function stop() {clearInterval(interv)}

function addFish(){
    fishes.push({
        "x":250 ,
        "y":250 ,
        "vector":getDirectionVector()
    })
    document.getElementById("numberOfFish").value = fishes.length
}

function updateFishNumber() {
    var nbCurrentFishes = fishes.length
    var nbWantedFishes  = document.getElementById("numberOfFish").value

    if (nbCurrentFishes > nbWantedFishes) {
        for (var i = nbCurrentFishes ; i > nbWantedFishes ; i--) {
            fishes.pop() ;
        }
    } else if (nbCurrentFishes < nbWantedFishes) {
        for (var i = nbCurrentFishes ; i < nbWantedFishes ; i++) {
            addFish() ;
        }
    }
}

function beginGame(debug=0){
 
    initiateGame() ;

    if (debug==0){
        var i = 0 ; 
        interv = setInterval(function () {
            
            clockTime() ; 
            i+= 1 ;

        }, CLOCK_TIME)
    } 
}