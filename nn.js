class NeuralNetwork{
    constructor(inputs, hidden, numLayers , outputs){
        this.inputs = inputs
        this.hidden = hidden
        this.numLayers = numLayers
        this.outputs = outputs
        this.Inputweights  = this.initializeWeights(this.inputs, this.hidden)
        this.Inputbias = new Array(this.hidden)
        this.Inputbias.fill(Math.random()*10)
        this.outputWeights = this.initializeWeights(this.hidden, this.outputs)
        this.Outputbias = new Array(this.outputs)
        this.Outputbias.fill(Math.random()*10)
    }
    initializeWeights(inputs, outputs){
        var arr = []
        for(var i = 0; i < (inputs*outputs); i++){
            var rand = Math.random()
            if(rand < 0.5){
                arr.push(Math.random()*10)
            }
            else{
                arr.push(-1*Math.random()*10)
            }
        }
        return arr
    }

    predict(inputs){
        var hiddenOutputs = this.applyWeights(inputs, this.hidden, this.Inputweights, this.Inputbias)
        hiddenOutputs = this.sigmoid(hiddenOutputs)
        var finalOutputs = this.applyWeights(hiddenOutputs, this.outputs, this.outputWeights, this.Outputbias)
        finalOutputs = this.sigmoid(finalOutputs)
        if((finalOutputs[0] > finalOutputs[1]) && (finalOutputs[0] > finalOutputs[2])){
            return 1 //move up
        }
        else if((finalOutputs[1] > finalOutputs[0]) && (finalOutputs[1] > finalOutputs[2])){
            return 2 //move down
        }
        else{
            return 0 //don't move
        }
    }
    sigmoid(inputs){
        var arr = []
        for(var i = 0; i < inputs.length; i++){
            arr[i] = 1/(1 + Math.pow(Math.E, -inputs[i]))
        }

        return arr
    }
    applyWeights(inputs, nextLayer, weights, bias){
        var arr = new Array(nextLayer)
        arr.fill(0)
        var counter = 0
        for(var i = 0; i < arr.length; i++){
            for(var j = 0; j < inputs.length; j++){

                arr[i] += weights[counter]*inputs[j]
                counter++  
            }
            
            //add bias after population each output node
            arr[i] += bias[i]
            
        }
        return arr
    }
}

