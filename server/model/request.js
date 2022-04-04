/**
 * Model of the request of collaboration
 * 
 * @constructor
 * @requires id,source,destination
 */

 class Request {    
    constructor(id, source_username, dest_username) {
        if(id)
            this.id = id;
        this.source = source_username;
        this.destination = dest_username;
    }
}

module.exports = Request;