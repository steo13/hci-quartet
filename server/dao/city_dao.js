'use strict';

const City = require('../model/city');
const Marker = require('../model/marker');
const db = require('../db');

/**
 * Function to create a `City` object from a row of the `city` table
 * @param {*} row a row of the `city` table
 */
 const createCity = (row) => {
    return new City(row.id, row.city, row.latitude, row.longitude);
}

/**
 * Function to create a `Marker` object from a row of the `marker` table
 * @param {*} row a row of the `marker` table
 */
 const createMarker = (row) => {
    return new Marker(row.city, row.lat, row.lng, row.musicians);
}

/**
 * Get all cities from the database
 */
 exports.getAllCities = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM City";
        db.all(sql, [], (err, rows) => {
            if(err) {
                // - if you are here an sql error occurs
                // - hence promise is rejected
                reject(err);
            } else {
                // - if you are here the sql query produced a result
                // - hence promise is fulfilled successfully
                const cities = rows.map(row => createCity(row));
                resolve(cities);
            }
        });
    });
}


/**
 * Get all markers from the database
*/
exports.getAllMarkers = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT City.city, City.latitude as 'lat', City.longitude as 'lng', COUNT(City.city) as 'musicians' FROM User, City WHERE User.city = City.id GROUP BY City.city";
        db.all(sql, [], (err, rows) => {
            if(err) {
                // - if you are here an sql error occurs
                // - hence promise is rejected
                reject(err);
            } else {
                // - if you are here the sql query produced a result
                // - hence promise is fulfilled successfully
                const markers = rows.map(row => createMarker(row));
                resolve(markers);
            }
        });
    });
}

/**
 * Get the city of a given musician by username
 * @param {*} username the musican username whose city should be returned
 */
 exports.getCityByUsername = function (username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT City.* FROM City, User WHERE City.id = User.city AND User.username = ?";
        db.all(sql, [username], (err, rows) => {
            if (err) {
                // - if you are here an sql error occurs
                // - hence promise is rejected
                reject(err);
            }
            else if (rows.length === 0) {
                // - if you are here there's no city
                // - with the username indicated
                // - hence promise is resolved with no objects ({})
                resolve(undefined);
            }
            else {
                // - if you are here the sql query produced a result
                // - hence promise is fulfilled successfully
                const city = createCity(rows[0]);
                resolve(city);
            }
        });
    });
  };

  
/**
 * Get a city information given its username
 * @param {*} city the city whose info should be returned using the name
 */
 exports.getCityByName = async function (city) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT City.* FROM City WHERE City.city = ?";
        db.all(sql, [city.city], (err, rows) => {
            if (err) {
                // - if you are here an sql error occurs
                // - hence promise is rejected
                reject(err);
            }
            else if (rows.length === 0) {
                // - if you are here there's no city
                // - hence promise is resolved with no objects ({})
                resolve(null);
            }
            else {
                // - if you are here the sql query produced a result
                // - hence promise is fulfilled successfully
                const city = createCity(rows[0]);
                resolve(city);
            }
        });
    });
};

/**
 * Insert a new city inside the db never
 * @param {*} city the new city
*/
exports.AddCity = (city) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO City(city, latitude, longitude) VALUES(?,?,?)";
        db.run(sql, [city.city, city.lat, city.lng], (err) => {
            if(err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            }
            else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                resolve(null);
            }
        });
    });
}

