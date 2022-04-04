/**
 * Model of the marker
 * 
 * @constructor
 * @requires city,latitude,longitude,number_of_musicians
 */

 class Marker {    
    constructor(city, latitude, longitude, number_of_musicians) {
        this.city = city;
        this.lat = latitude;
        this.lng = longitude;
        this.musicians = number_of_musicians;
    }
}

module.exports = Marker;