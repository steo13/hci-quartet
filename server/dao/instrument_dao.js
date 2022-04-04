'use strict';

const Instrument = require('../model/instrument');
const db = require('../db');

/**
 * Function to create a `Instrument` object from a row of the `instrument` table
 * @param {*} row a row of the `instrument` table
 */
 const createInstrument = (row) => {
    return new Instrument(row.id, row.name, null, row.icon);
}

/**
 * Get all instruments
 */
 exports.getAllInstruments = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Instrument";
        db.all(sql, [], (err, rows) => {
            if(err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            } else if (rows.length === 0) {
                // if you are here there's no instrument
                // hence promise is resolved with no objects
                resolve(undefined);
            } else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                const instruments = rows.map(row => createInstrument(row));
                resolve(instruments);
            }
        });
    });
}