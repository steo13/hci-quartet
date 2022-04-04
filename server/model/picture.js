/**
 * Model of the picture
 * 
 * @constructor
 * @requires id,id_user,date
 */

 class Picture {    
    constructor(id, id_user, date) {
        if(id)
            this.id = id;
        this.id_user = id_user;
        this.date = date
    }
}

module.exports = Picture;