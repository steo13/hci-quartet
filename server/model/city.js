/**
 * Model of the city
 * 
 * @constructor
 * @requires id,city,latitude,longitude
 */

 class City {    
    constructor(id, city, latitude, longitude) {
        if(id)
            this.id = id;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude
    }
}

module.exports = City;