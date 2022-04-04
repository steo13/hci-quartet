/**
 * Model of the intrument
 * 
 * @constructor
 * @requires id,name,rating,icon
 */

 class Instrument {    
    constructor(id, name, rating, icon) {
        if(id)
            this.id = id;
        this.name = name;
        if(rating)
            this.rating = rating
        if(icon)
            this.icon = icon
    }
}

module.exports = Instrument;