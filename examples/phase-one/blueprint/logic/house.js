const Location = require("./location.js")

class House extends Location {

    _beds;

    constructor(name, vertex1, vertex2, height, beds) {
        super(name, vertex1, vertex2, height);
        this._beds = beds;
    }

    print() {
        console.log(this._name + " extends from " + this._baseVertices[0].toString() + " to " + this._baseVertices[1].toString()
            + " with a height of " + this._height);
        for (let i = 0; i < this._beds.length; i++){
            let b = this._beds[i]
            console.log("It has " + b.name + " at " + b.position)
        }
    }
}

module.exports = House