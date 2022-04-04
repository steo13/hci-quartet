'use strict';

const Video = require('../model/video');
const db = require('../db');

/**
 * Function to create a `Video` object from a row of the `video` table
 * @param {*} row a row of the `video` table
 */
 const createVideo = (row) => {
    return new Video(row.id, row.id_user, row.link);
}

/**
 * Get all videos
 */
 exports.getAllVideos = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Video";
        db.all(sql, [], (err, rows) => {
            if(err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            } else if (rows.length === 0) {
                // if you are here there's no video
                // hence promise is resolved with no objects
                resolve(undefined);
            } else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                const videos = rows.map(row => createVideo(row));
                resolve(videos);
            }
        });
    });
}