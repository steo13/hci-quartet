'use strict';

const Platform = require('../model/platform');
const db = require('../db');

/**
 * Function to create a `genre` object from a row of the `genre` table
 * @param {*} row a row of the `genre` table
 */
 const createPlatform = (row) => {
    return new Platform(row.id, row.name, null, row.icon);
}

/**
 * Get all platforms
 */
 exports.getAllPlatforms = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Platform";
        db.all(sql, [], (err, rows) => {
            if(err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            } else if (rows.length === 0) {
                // if you are here there's no platform
                // hence promise is resolved with no objects
                resolve(undefined);
            } else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                const platforms = rows.map(row => createPlatform(row));
                resolve(platforms);
            }
        });
    });
}