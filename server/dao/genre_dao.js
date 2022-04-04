'use strict';

const Genre = require('../model/genre');
const db = require('../db');

/**
 * Function to create a `genre` object from a row of the `genre` table
 * @param {*} row a row of the `genre` table
 */
 const createGenre = (row) => {
    return new Genre(row.id, row.name, row.icon);
}

/**
 * Get all genres
 */
 exports.getAllGenres = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Genre";
        db.all(sql, [], (err, rows) => {
            if(err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            } else if (rows.length === 0) {
                // if you are here there's no genre
                // hence promise is resolved with no objects
                resolve(undefined);
            } else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                const genres = rows.map(row => createGenre(row));
                resolve(genres);
            }
        });
    });
}