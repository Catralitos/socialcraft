const {Vec3} = require("vec3");

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

    getArea() {
        let x = Math.abs(this._baseVertices[0].x - this._baseVertices[1].x)
        let z = Math.abs(this._baseVertices[0].z - this._baseVertices[1].z)
        return x * z
    }

    getVolume() {
        let x = Math.abs(this._baseVertices[0].x - this._baseVertices[1].x)
        let z = Math.abs(this._baseVertices[0].z - this._baseVertices[1].z)
        return x * z * this._height
    }

    isInLocation(position) {
        return position && ((this._baseVertices[0].x <= position.x && position.x <= this._baseVertices[1].x) || (this._baseVertices[1].x <= position.x && position.x <= this._baseVertices[0].x)) &&
            ((this._baseVertices[0].z <= position.z && position.z <= this._baseVertices[1].z) || (this._baseVertices[1].z <= position.z && position.z <= this._baseVertices[0].z)) &&
            (this._baseVertices[0].y <= position.y && position.y <= this._baseVertices[0].y + this._height)
    }

    getClockwiseVertices() {
        let list = []
        list.push(this._baseVertices[0])
        let secondVertex = new Vec3(this._baseVertices[1].x, this._baseVertices[1].y, this._baseVertices[0].z)
        list.push(secondVertex)
        list.push(this._baseVertices[1])
        let forthVertex = new Vec3(this._baseVertices[0].x, this._baseVertices[1].y, this._baseVertices[1].z)
        list.push(forthVertex)
        return list
    }

    getRadius() {
        let xValue = Math.abs(this._baseVertices[1].x - this._baseVertices[0].x) / 2
        //if (xValue <= 0.01) xValue = Number.POSITIVE_INFINITY
        let zValue = Math.abs(this._baseVertices[1].z - this._baseVertices[0].z) / 2
        //if (zValue <= 0.01) zValue = Number.POSITIVE_INFINITY
        return Math.max(xValue, zValue)
    }

    getCentralPoint() {
        let xValue = (this._baseVertices[0].x + this._baseVertices[1].x) / 2
        let yValue = (this._baseVertices[0].y + this._baseVertices[1].y) / 2
        let zValue = (this._baseVertices[0].z + this._baseVertices[1].z) / 2
        return new Vec3(xValue, yValue, zValue)
    }

    getCentralPointFlat() {
        let xValue = (this._baseVertices[0].x + this._baseVertices[1].x) / 2
        let yValue = this._baseVertices[0].y
        let zValue = (this._baseVertices[0].z + this._baseVertices[1].z) / 2
        return new Vec3(xValue, yValue, zValue)
    }
}

module.exports = Location;
