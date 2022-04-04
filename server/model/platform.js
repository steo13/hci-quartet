/**
 * Model of the platform
 * 
 * @constructor
 * @requires id,name,link,icon
 */

 class Platform {    
    constructor(id, name, link, icon) {
        if(id)
            this.id = id;
        this.name = name;
        if(link)
            this.link = link
        if(icon)
            this.icon = icon;
    }
}

module.exports = Platform;