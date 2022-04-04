/**
 * Model of collaboration
 * 
 * @constructor
 * @requires id,user1_username,user2_username
 */

 class Collaboration {    
    constructor(id, user1_username, user2_username) {
        if(id)
            this.id = id;
        this.user1 = user1_username;
        this.user2 = user2_username;
    }
}

module.exports = Collaboration;