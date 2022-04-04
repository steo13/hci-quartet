/**
 * Model of the genre
 * 
 * @constructor
 * @requires id,name,icon
 */

 class Genre {    
    constructor(id,name,icon) {
        if(id)
            this.id = id;
        this.name = name;
        if(icon)
            this.icon = icon;
    }
}

module.exports = Genre;