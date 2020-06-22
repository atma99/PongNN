class Ball{
    constructor(x, y, r, width, height, speed){
        this.x = x
        this.y = y
        this.radius = r
        this.dx = speed
        this.dy = speed
        this.width = width 
        this.height = height
    }
    update(){
        this.x += this.dx
        this.y += this.dy
    
    }
    collisionCheck(){
        if((this.x - this.radius) < 0){
            // if(this.y > paddleY && this.y < (paddleY + paddleH)){
            //     this.x = this.radius
            //     this.dx *= -1
            // }
            // else{
            //     this.x = this.radius
            //     this.dx *= -1
            //     console.log("HIT!")
            // }
            this.x = this.radius
            this.dx *= -1           
        }
        else if((this.x + this.radius) > this.width){
            this.x = this.width - this.radius
            this.dx *= -1
        }

        if((this.y - this.radius) < 0){
            this.y = this.radius
            this.dy *= -1
        }
        else if((this.y + this.radius) > this.height){
            this.y = this.height - this.radius
            this.dy *= -1
        }

    }
}


class Population {
    constructor(maxPop, mutationRate, width, height, numInputs){
        this.numInputs = numInputs
        this.width = width
        this.height = height
        this.maxPop = maxPop
        this.mutationRate = mutationRate
        this.population = []
        for(var i = 0; i < this.maxPop; i++){
            this.population.push(new Paddle(this.width, this.height, this.numInputs))
        }
    }
    calcFitness(){
        for(var i = 0; i < this.maxPop; i++){
            this.population[i].fitnessDNA()
        }
    }
    generate(){
        var totalScore = 0
        for(var i = 0; i < this.maxPop; i++){
            totalScore += this.population[i].fitness
        }
        //console.log(totalScore) 
        var newPop = []
        for(var i = 0; i < this.maxPop; i++){
            if(totalScore == (this.maxPop)){
                var child = new Paddle(this.width, this.height, this.numInputs)
            }
            else{
                var partnerA = this.pickOne(totalScore)
                var partnerB = this.pickOne(totalScore)
                var child = partnerA.crossover(partnerB)
                if(partnerA.fitness <= Math.pow(21, 3)){
                    child.mutate(this.mutationRate)
                }
                
            }
            newPop.push(child)
        }
        this.population = newPop
    
    }
    pickOne(totalScore){
        var r = Math.random()*totalScore
        var index = 0
        while(r > 0){
            r = r - this.population[index].fitness
            index += 1
        }
        index -= 1
        return this.population[index]
    }
   
}

class Paddle{
    constructor(width, height, numInputs){
        this.numInputs = numInputs
        this.canvasW = width
        this.canvasH = height
        this.h = 70
        this.w = 10
        this.x = 5
        this.y = height/2 + (this.h/2)
        this.brain = new NeuralNetwork(this.numInputs, 10, 1, 3)
        this.fitness = 1
        this.ballHits = 0
        this.killed = 0
        this.ignore = 1
    }
    predictAndUpdate(ballX, ballY, balldx, balldy){
        var inputs = [this.y, ballX, ballY, balldx, balldy]
        var result = this.brain.predict(inputs)
        if(result == 1){
            this.y += -7
        }
        if(result == 2){
            this.y += 7
        }

    }
    collisionCheck(){
        if(this.y < 0){
            this.y = 0
        }
        else if(this.y + this.h > this.canvasH ){
            this.y = this.canvasH - this.h
        }

    }
    collisionWithBall(ballX, ballY, ballRad){
        if(this.ignore){
            this.ignore = 0
        }
        else{
            if((ballX-ballRad) <= 0){
                if((ballY > this.y) && (ballY < (this.y + this.h))){
                    this.ballHits += 1
                    console.log("HIT")
                }
                else{
                    this.killed = 1
                }
            }  
        }     
    }
    fitnessDNA() {
        this.fitness = Math.pow(this.ballHits+1, 3) 
    }
    crossover(partnerB){
        var child = new Paddle(this.canvasW, this.canvasH, this.numInputs)
        // var midpoint = Math.floor(Math.random()*this.brain.Inputweights.length)
        
        // for(var i = 0; i < this.brain.Inputweights.length; i++){
        //     var r = Math.floor(Math.random()*this.brain.Inputweights.length)
        //     if(r < midpoint){
        //         child.brain.Inputweights[i] = this.brain.Inputweights[i]
        //     }
        //     else{
        //         child.brain.Inputweights[i] = partnerB.brain.Inputweights[i]
        //     }
        // }
        child.brain.Inputweights = this.brain.Inputweights
        child.brain.Inputbias = this.brain.Inputbias
        child.brain.outputWeights = this.brain.outputWeights
        child.brain.Outputbias = this.brain.Outputbias
    
        return child
    }
    mutate(rate){
        for(var i = 0; i < this.brain.Inputweights.length; i++){
            if(Math.random() < rate){
                this.brain.Inputweights[i] = Math.random()*10
            }
        }
        for(var i = 0; i < this.brain.outputWeights.length; i++){
            if(Math.random() < rate){
                this.brain.outputWeights[i] = Math.random()*10
            }
        }
    }
}