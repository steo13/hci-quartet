'use strict';

const User = require('../model/user');
const Feedback = require('../model/feedback');
const Instrument = require('../model/instrument');
const Platform = require('../model/platform');
const Video = require('../model/video');
const Genre = require('../model/genre');
const Request = require('../model/request');
const Collaboration = require('../model/collaboration');
const db = require('../db');


/**
 * Function to create a `User` object from a row of the `user` table
 * @param {*} row a row of the `user` table
 */
const createUser = (row, instruments, genres, videos, link) => {
    const user_city = {'city': row.city_name, 'lat': row.latitude, 'lng': row.longitude}
    return new User(row.id, row.username, row.password, row.name, row.surname, row.email, user_city, !!row.availability,
        !!row.single_time, !!row.long_time, !!row.morning_available, !!row.afternoon_available, !!row.evening_available,
        row.profile_picture, row.description, instruments, genres, videos, link);
}

/**
 * Function to create a `Feedback` object from a row of the `feedback` table
 * @param {*} row a row of the `feedback` table
 */
 const createFeedback = (row) => {
    return new Feedback(row.id, row.comment, row.date, row.profile_picture, row.username);
}

/**
 * Function to create a `Instrument` object from a row of the `user_instrument` table
 * @param {*} row a row of the `instrument` table
 */
 const createInstrument = (row) => {
    return new Instrument(row.id, row.name, row.rating, null);
}

/**
 * Function to create a `Video` object from a row of the `video` table
 * @param {*} row a row of the `video` table
 */
 const createVideo = (row) => {
    return new Video(row.id, null, row.link);
}

/**
 * Function to create a `Platform` object from a row of the `platform` table
 * @param {*} row a row of the `platform` table
 */
 const createPlatform = (row) => {
    return new Platform(row.id, row.name, row.link, null);
}

/**
 * Function to create a `Genre` object from a row of the `genre` table
 * @param {*} row a row of the `genre` table
 */
 const createGenre = (row) => {
    return new Genre(row.id, row.name, null);
}

/**
 * Function to create a `Request` object from a row of the `request` table
 * @param {*} row a row of the `request` table
 * @param {*} my_username username of the current user
 */
 const createRequest = (row) => {
    return new Request(row.id, row.source, row.destination);
}

/**
 * Function to create a `Collaboration` object from a row of the `collaboration` table
 * @param {*} row a row of the `collaboration` table
 * @param {*} my_username username of the current user
 */
 const createCollaboration = (row, my_username) => {
    return new Collaboration(row.id, row.username, my_username);
}


/**
 * Get user info from his username
 * @param {*} username the musican username
 */
 exports.getUserByUsername = function (username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT User.*, City.city as 'city_name', City.latitude, City.longitude FROM User, City WHERE City.id = User.city AND username = ?";

        db.all(sql, [username], (err, rows) => {
            if (err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            }
            else if (rows.length === 0) {
                // if you are here there's no user with the username indicated
                // hence promise is resolved with no objects
                resolve(undefined);
            }
            else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                // get the user id for collecting data related to the user (link, instrument, video, genre)
                const user_basic = rows[0]
                const user_id = rows[0].id
                // instruments
                const sql_instruments = "SELECT Instrument.id, name, rating FROM Instrument, User_Instrument WHERE User_Instrument.instrument = Instrument.id AND User_Instrument.id_user = ?"
                db.all(sql_instruments, [user_id], (err, rows) => {
                    if (err) {
                        // if you are here an sql error occurs
                        // hence promise is rejected
                        reject(err);
                    } else {
                        // if you are here the sql query produced a result
                        // hence promise is fulfilled successfully
                        // get the user instruments object
                        const user_instruments = rows.map(row => createInstrument(row));
                        // platform links
                        const sql_links = "SELECT Platform.id,name,link FROM Platform, User_Platform WHERE User_Platform.id_platform = Platform.id AND User_Platform.id_user = ?"
                        db.all(sql_links, [user_id], (err, rows) => {
                            if (err) {
                                // if you are here an sql error occurs
                                // hence promise is rejected
                                reject(err);
                            } else {
                                // if you are here the sql query produced a result
                                // hence promise is fulfilled successfully
                                // get the user platforms object
                                const user_links = rows.map(row => createPlatform(row));
                                // video links
                                const sql_videos = "SELECT id,link FROM Video WHERE id_user = ?"
                                db.all(sql_videos, [user_id], (err, rows) => {
                                    if (err) {
                                        // if you are here an sql error occurs
                                        // hence promise is rejected
                                        reject(err);
                                    } else {
                                        // if you are here the sql query produced a result
                                        // hence promise is fulfilled successfully
                                        // get the user video object
                                        const user_videos = rows.map(row => createVideo(row));
                                        // user musical genres
                                        const sql_genres = "SELECT Genre.name, Genre.id FROM Genre, User_Genre WHERE Genre.id = User_Genre.id_genre AND User_Genre.id_user = ?"
                                        db.all(sql_genres, [user_id], (err, rows) => {
                                            if (err) {
                                                // if you are here an sql error occurs
                                                // hence promise is rejected
                                                reject(err);
                                            } else {
                                                // if you are here the sql query produced a result
                                                // hence promise is fulfilled successfully
                                                // get the user genres object
                                                const user_genres = rows.map(row => createGenre(row));
                                                // finally, create the user
                                                const user = createUser(user_basic, user_instruments, user_genres, user_videos, user_links);
                                                resolve(user);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}


/**
 * Get all users
 */
 exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT User.*, City.city as 'city_name', City.latitude, City.longitude FROM User, City WHERE City.id = User.city";
        db.all(sql, [], async (err, rows) => {
            let cont = rows.length
            if (err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            }
            else if (rows.length === 0) {
                // if you are here there's no user with the username indicated
                // hence promise is resolved with no objects
                resolve(undefined);
            }
            else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                // complete all the user with the related data (link, instrument, video, genre)
                let users = []
                
                rows.forEach((row, index) => {
                    //get current row user id
                    const user_id = row.id
                    //obscure password
                    row.password = null
                    const user_basic = row
                    // instruments
                    const sql_instruments = "SELECT Instrument.id, name, rating FROM Instrument, User_Instrument WHERE User_Instrument.instrument = Instrument.id AND User_Instrument.id_user = ?"
                    db.all(sql_instruments, [user_id], (err, rows) => {
                        if (err) {
                            // if you are here an sql error occurs
                            // hence promise is rejected
                            reject(err);
                        } else {
                            // if you are here the sql query produced a result
                            // hence promise is fulfilled successfully
                            // get the user instruments object
                            const user_instruments = rows.map(row => createInstrument(row));
                            // platform links
                            const sql_links = "SELECT Platform.id,name,link FROM Platform, User_Platform WHERE User_Platform.id_platform = Platform.id AND User_Platform.id_user = ?"
                            db.all(sql_links, [user_id], (err, rows) => {
                                if (err) {
                                    //  if you are here an sql error occurs
                                    //  hence promise is rejected
                                    reject(err);
                                } else {
                                    // if you are here the sql query produced a result
                                    // hence promise is fulfilled successfully
                                    // get the user platforms object
                                    const user_links = rows.map(row => createPlatform(row));
                                    // video links
                                    const sql_videos = "SELECT id,link FROM Video WHERE id_user = ?"
                                    db.all(sql_videos, [user_id], (err, rows) => {
                                        if (err) {
                                            // if you are here an sql error occurs
                                            // hence promise is rejected
                                            reject(err);
                                        } else {
                                            // if you are here the sql query produced a result
                                            // hence promise is fulfilled successfully
                                            // get the user video object
                                            const user_videos = rows.map(row => createVideo(row));
                                            // user musical genres
                                            const sql_genres = "SELECT Genre.name, Genre.id FROM Genre, User_Genre WHERE Genre.id = User_Genre.id_genre AND User_Genre.id_user = ?"
                                            db.all(sql_genres, [user_id], (err, rows) => {
                                                if (err) {
                                                    // if you are here an sql error occurs
                                                    // hence promise is rejected
                                                    reject(err);
                                                } else {
                                                    // if you are here the sql query produced a result
                                                    // hence promise is fulfilled successfully
                                                    // get the user genres object
                                                    const user_genres = rows.map(row => createGenre(row));
                                                    // finally, create the user
                                                    const user = createUser(user_basic, user_instruments, user_genres, user_videos, user_links);
                                                    users.push(user)
                                                    //resolve promise only when all the users are processed
                                                    if(users.length === cont){
                                                        resolve(users);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                });//FOREACH_END
            }
        });
    });
}


/**
 * Get all the feedbacks about a certain user
 * @param {*} _username the musican username whose feedbacks should be returned
 */
 exports.getFeedbacksByUsername = (_username) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT Feedback.id, Feedback.comment, Feedback.date, User.profile_picture, User.username FROM Feedback, User WHERE Feedback.id_reviewer_user = User.id AND Feedback.id_reviewed_user = (SELECT User.id from User WHERE username = ?)";
        db.all(sql, [_username], (err, rows) => {
            if(err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            } else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                const feedbacks = rows.map(row => createFeedback(row));
                resolve(feedbacks);
            }
        });
    });
}


/**
 * Get userid starting from the username
 * @param {*} username of the user want to take the id
 */
 exports.getUserIdByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT User.id FROM User WHERE username = ?";
        db.all(sql, [username], (err, rows) => {
            if(err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            } else if (rows.length === 0) {
                // if you are here there's no user with the username indicated
                // hence promise is resolved with no objects
                resolve(undefined);
            } else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                resolve(rows[0].id);
            }
        });
    });
}

/**
 * Add a new feedbacks about a certain user
 * @param {*} feedback to store inside the database
 * @param {*} id_reviewed_user
 * @param {*} id_reviewer_user
 */
 exports.addFeedback = (feedback, id_reviewed_user, id_reviewer_user) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Feedback(id_reviewed_user, id_reviewer_user, comment, date) VALUES(?,?,?,?)';
        db.run(sql, [id_reviewed_user, id_reviewer_user, feedback.comment, feedback.date], (err) => {
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

/**
 * Remove feedbacks about a certain user
 * @param {*} feedback_id to be deleted
 */
 exports.removeFeedbackbyId = (feedback_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Feedback WHERE id = ?';
        db.run(sql, [feedback_id], (err) => {
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



/**
 * Update baisc user information with the new personal data
 * @param {*} to_update new user information
 * @param {*} user_id id of the musician from params
 */
 exports.updateUser = (to_update, user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE User SET name=?, surname=?, username=?, email=?, password=?, description=?, profile_picture=?, " +
        "availability=?, single_time=?, long_time=?, morning_available=?, afternoon_available=?, evening_available=?, city=? " +
        "WHERE id=?";
        db.run(sql, [to_update.name, to_update.surname, to_update.username, to_update.email,
            to_update.password, to_update.description, to_update.picture,
            to_update.availability, to_update.collaboration.single, to_update.collaboration.long,
            to_update.hours.morning, to_update.hours.afternoon, to_update.hours.evening, to_update.city,
            user_id
        ], (err) => {
            if(err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            }
            else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                resolve(to_update.username);
            }
        });
    });
}


/**
 * Update a user rating on playing an instrument
 * @param {*} instrument the instrument for which the rating should be updated
 * @param {*} user_id musician id
 */
 exports.updateUserInstrument = (instrument, user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE User_Instrument SET rating = ? WHERE id_user = ? AND instrument = ?";
        db.run(sql, [instrument.rating, user_id, instrument.id], (err) => {
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

/**
 * Insert a new instrument played by a certain user
 * @param {*} instrument the new instrument played
 * @param {*} user_id musician id
 */
 exports.addUserInstrument = (instrument, user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO User_Instrument(id_user, rating, instrument) VALUES(?,?,?)";
        db.run(sql, [user_id, instrument.rating, instrument.id], (err) => {
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


/**
 * Remove a user instrument played in the past
 * @param {*} instrument the old instrument played
 * @param {*} user_id musician id
 */
 exports.removeUserInstrument = (instrument, user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM User_Instrument WHERE id_user = ? AND instrument = ?";
        db.run(sql, [user_id, instrument.id], (err) => {
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


/**
 * Remove all user instrument played by a certain user
 * @param {*} user_id musician id
 */
 exports.removeAllUserInstruments = (user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM User_Instrument WHERE id_user = ?";
        db.run(sql, [user_id], (err) => {
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


/**
 * Update a user platform editing the link
 * @param {*} platform the platform for which the link should be updated
 * @param {*} user_id musician id
 */
 exports.updateUserPlatform = (platform, user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE User_Platform SET link = ? WHERE id_user = ? AND id_platform = ?";
        db.run(sql, [platform.link, user_id, platform.id], (err) => {
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

/**
 * Insert a new platform used by a certain user
 * @param {*} platform the new platform used
 * @param {*} user_id musician id
*/
 exports.addUserPlatform = (platform, user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO User_Platform(id_platform, id_user, link) VALUES(?,?,?)";
        db.run(sql, [platform.id, user_id, platform.link], (err) => {
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

/**
 * Remove a new platform used by a certain user in the past
 * @param {*} platform the old platform used
 * @param {*} user_id musician id
*/
exports.removeUserPlatform = (platform, user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM User_Platform WHERE id_platform = ? AND id_user = ?";
        db.run(sql, [platform.id, user_id], (err) => {
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

/**
 * Remove all platforms used by a certain user
 * @param {*} user_id musician id
*/
exports.removeAllUserPlatforms = (user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM User_Platform WHERE id_user = ?";
        db.run(sql, [user_id], (err) => {
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



/**
 * Insert a new genre liked by a certain user
 * @param {*} genre the new genre
 * @param {*} user_id musician id
*/
exports.addUserGenre = (genre, user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO User_Genre(id_genre, id_user) VALUES(?,?)";
        db.run(sql, [genre.id, user_id], (err) => {
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


/**
 * Remove the user genres
 * @param {*} user_id musician id
*/
exports.removeUserGenres = (user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM User_Genre WHERE id_user = ?";
        db.run(sql, [user_id], (err) => {
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

/**
 * Insert a new video played by a certain user
 * @param {*} video the new video
 * @param {*} user_id musician id
*/
exports.addUserVideo = (video, user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Video(id_user, link) VALUES(?,?)";
        db.run(sql, [user_id, video.link], (err) => {
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

/**
 * Update a user video editing the link
 * @param {*} video the video for which the link should be updated
 * @param {*} user_id musician id
 */
 exports.updateUserVideo = (video, user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Video SET link = ? WHERE id_user = ? AND id = ?";
        db.run(sql, [video.link, user_id, video.id], (err) => {
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

/**
 * Remove a video played by a certain user
 * @param {*} video the video to be removed
*/
exports.removeUserVideo = (video) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Video WHERE id = ?";
        db.run(sql, [video.id], (err) => {
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


/**
 * Remove all videos played by a certain user
 * @param {*} user_id musician id
*/
exports.removeAllUserVideos = (user_id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Video WHERE id_user = ?";
        db.run(sql, [user_id], (err) => {
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







/**
 * Send a request collaboration for feedback
 * @param {*} user_id_1 who sent musician id
 * @param {*} user_id_2 who receive musician id
*/
exports.addUserRequest = (user_id_1, user_id_2) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Request(source, destination) VALUES(?,?)";
        db.run(sql, [user_id_1, user_id_2], (err) => {
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


/**
 * Remove a request collaboration for feedback
 * @param {*} user_id_1 who sent musician id
 * @param {*} user_id_2 who receive musician id
*/
exports.removeUserRequest = (user_id_1, user_id_2) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Request WHERE source = ? AND destination = ?";
        db.run(sql, [user_id_1, user_id_2], (err) => {
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


/**
 * Get all the requests about a certain user
 * @param {*} username the musican username whose requests should be returned
 */
 exports.getRequestsByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT Request.id, User.username as source,  ? as 'destination' FROM Request, User WHERE Request.source = User.id AND Request.destination = (SELECT User.id from User WHERE username = ?) UNION  SELECT Request.id, ? as source, User.username as 'destination' FROM Request, User WHERE Request.destination = User.id AND Request.source = (SELECT User.id from User WHERE username = ?)"
        db.all(sql, [username, username, username, username], (err, rows) => {
            if(err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            } else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                const requests = rows.map(row => createRequest(row));
                resolve(requests);
            }
        });
    });
}


/**
 * Send a request collaboration for feedback
 * @param {*} user_id_1 who sent musician id
 * @param {*} user_id_2 who receive musician id
*/
exports.addUserCollaboration = (user_id_1, user_id_2) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Collaboration(id_user_1, id_user_2) VALUES(?,?)";
        db.run(sql, [user_id_1, user_id_2], (err) => {
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

/**
 * Get all the collabs about a certain user
 * @param {*} username the musican username whose collabs should be returned
 */
 exports.getCollaborationsByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT Collaboration.id, User.username FROM Collaboration, User WHERE Collaboration.id_user_1 = User.id AND Collaboration.id_user_2 = (SELECT User.id from User WHERE username = ?) OR Collaboration.id_user_2 = User.id AND Collaboration.id_user_1 = (SELECT User.id from User WHERE username = ?)";
        db.all(sql, [username, username], (err, rows) => {
            if(err) {
                // if you are here an sql error occurs
                // hence promise is rejected
                reject(err);
            } else {
                // if you are here the sql query produced a result
                // hence promise is fulfilled successfully
                const collabs = rows.map(row => createCollaboration(row, username));
                resolve(collabs);
            }
        });
    });
}

/**
 * Remove a collaboration
 * @param {*} user_id_1 who sent musician id
 * @param {*} user_id_2 who receive musician id (current user)
*/
exports.removeUserCollaboration = (user_id_1, user_id_2) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Collaboration WHERE id_user_1 = ? AND id_user_2 = ? OR id_user_2 = ? AND id_user_1 = ?";
        db.run(sql, [user_id_1, user_id_2, user_id_1, user_id_2], (err) => {
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
