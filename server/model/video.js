/**
 * Model of the video
 * 
 * @constructor
 * @requires id,id_user,link
 */

 class Video {    
    constructor(id, id_user, link) {
        if(id)
            this.id = id;
        if(id_user)
            this.id_user = id_user;
        this.link = link;
    }
}

module.exports = Video;