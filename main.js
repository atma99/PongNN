var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')
var maxPop = 200
var ball = new Ball(15, 15, 7, canvas.width, canvas.height, 7)
var population = new Population(maxPop, 0.03, canvas.width, canvas.height, 5)
var generations = 0
var slider = document.getElementById('myRange')
function drawBall(){
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()
    ball.update()
    ball.collisionCheck()
}
function drawPaddle(object){
    if(object.killed == 0){
        ctx.beginPath()
        ctx.rect(object.x, object.y, object.w, object.h)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.closePath()
        object.predictAndUpdate(ball.x, ball.y, ball.dx, ball.dy)
        object.collisionCheck()
        object.collisionWithBall(ball.x, ball.y, ball.radius)
    }   
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBall()
    document.getElementById('Gen').innerHTML = generations
    for(var i = 0; i < maxPop; i++){
        drawPaddle(population.population[i])
    }
    var counter = 0
    
    for(var j = 0; j < maxPop; j++){
        if(population.population[j].killed == 1){
            counter += 1
        }
    }
    var maxFitness = 0
    var index = 0
    if(counter == maxPop){
        console.log("old pop dead")
        population.calcFitness()
        for(var i = 0; i < maxPop; i++){
            if(population.population[i].fitness > maxFitness){
                maxFitness = population.population[i].fitness
                index = i
            }
        }
        population.generate()
        //population = new Population(maxPop, 0.01, canvas.width, canvas.height)
        generations += 1 
    }
}
setInterval(draw, 20)
