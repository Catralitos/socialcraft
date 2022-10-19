const Location = require("./location");

class WorkPlace extends Location{

    _canDigAndStack;

    constructor(name, vertex1, vertex2, height, canDigAndStack) {
        super(name, vertex1, vertex2, height);
        this._canDigAndStack = canDigAndStack;
    }

    print() {
        let string = this._canDigAndStack ? "can" : "cannot"
        console.log(this._name + " extends from " + this._baseVertices[0].toString() + " to " + this._baseVertices[1].toString()
            + " with a height of " + this._height + " and the player " + string + " dig and stack blocks to move.");
    }
}

module.exports = WorkPlace