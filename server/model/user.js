/**
 * Model of the user
 * 
 * @constructor
 * @requires id,username,password,name,surname,email,city,availability,single_time,long_time,morning_available,afternoon_available,evening_available,profile_picture,description,instruments,videos,link
 */

 class User {    
    constructor(id, username, password, name, surname, email, city, availability, single_time, long_time, morning_available, afternoon_available, evening_available, profile_picture, description, instruments, genres, videos, link) {
        if(id)
            this.id = id;
        this.username = username;
        if(password)
            this.password = password;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.city = city;
        this.availability = availability;
        this.collaboration = {single: single_time , long: long_time}
        this.hours = {morning: morning_available, afternoon: afternoon_available, evening: evening_available};
        this.picture = profile_picture || 'images/logo.png';
        this.description = description || 'none';
        this.instruments = instruments;
        this.genres = genres;
        this.videos = videos;
        this.link = link;
    }
}

module.exports = User;