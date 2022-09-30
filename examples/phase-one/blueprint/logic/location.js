class Location {

    _name;
    _baseVertices;
    _height;

    constructor(name, vertex1, vertex2, height) {
        this._name = name;
        this._baseVertices = []
        this._baseVertices.push(vertex1)
        this._baseVertices.push(vertex2)
        this._height = height
    }

    getVolume() {
        let x = Math.abs(this._baseVertices[0].x - this._baseVertices[1].x)
        let z = Math.abs(this._baseVertices[0].z - this._baseVertices[1].z)
        return x * z * this._height
    }

    isInLocation(position) {
        return ((this._baseVertices[0].x <= position.x <= this._baseVertices[1].x) || (this._baseVertices[1].x <= position.x <= this._baseVertices[0].x)) &&
            ((this._baseVertices[0].z <= position.z <= this._baseVertices[1].z) || (this._baseVertices[1].z <= position.z <= this._baseVertices[0].z)) &&
            (this._baseVertices[0].y <= position.y <= this._baseVertices[0].y + this._height)

    }
}

module.exports = Location;
