const Location = require("./location.js")

class SocialPlace extends Location {

    _social_appropriateness;

    constructor(name, vertex1, vertex2, height, social_appropriateness) {
        super(name, vertex1, vertex2, height)
        this._social_appropriateness = social_appropriateness
    }

    print() {
        console.log(this._name + " extends from " + this._baseVertices[0].toString() + " to " + this._baseVertices[1].toString()
            + " with a height of " + this._height + " and social appropriatness of " + this._social_appropriateness);
    }
}

module.exports = SocialPlace