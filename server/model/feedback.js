const moment = require('moment');
/**
 * Model of the feedback
 * 
 * @constructor
 * @requires id,comment,date,profile_picture,username
 */

 class Feedback {    
    constructor(id, comment, date, profile_picture, username) {
        if(id)
            this.id = id;
        this.comment = comment
        this.date = moment(date).format("YYYY-MM-DD");
        this.picture = profile_picture;
        this.user = username;
    }
}

module.exports = Feedback;