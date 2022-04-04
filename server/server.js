'use strict';

//middleware and utilities imports
const express = require('express');     // handling server
const morgan = require('morgan');       // logging 

/* TODO LOGIN?
const jwt = require('express-jwt');             // sign verify
const jsonwebtoken = require('jsonwebtoken');   // encode info and sign JWTs
const cookieParser = require('cookie-parser');  // parsing cookie (jwt)*/
const {check, validationResult} = require('express-validator'); // error-check middleware

//data access object imports
const userDAO = require('./dao/user_dao');
const cityDAO = require('./dao/city_dao');
const instrumentDAO = require('./dao/instrument_dao');
const genreDAO = require('./dao/genre_dao');
const platformDAO = require('./dao/platform_dao');
const videoDAO = require('./dao/video_dao');


//model imports
const Feedback = require('./model/feedback');

//setup server listen port
const port = 3001;
// setup server express
const app = new express();

//setup logging as dev (/tiny?)
app.use(morgan('dev'));

//process body content as json format
app.use(express.json());


// * REST API endpoints with no authenitication * //


// * REST API GET * //

// GET api/user/<username>
app.get('/api/user/:username', async (req, res) => {
    userDAO.getUserByUsername(req.params.username)
    .then((user) => {
        if(!user) {
            // - if you are here the user is not present in the database
            // - handled by a `Not Found` error
            res.status(404).send();
        } else {
            res.json(user);
        }
    }).catch((err) => {
        // - if you are here some errors occurred getting data from database
        // - handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});

// GET api/users/
app.get('/api/users/', (req, res) => {
    userDAO.getAllUsers()
    .then((users) => {
        if(!users) {
            // if you are here no users are present in the database
            // handled by a `Not Found` error
            res.status(404).send();
        } else {
            res.json(users);
        }
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});

// GET /api/cities
app.get('/api/cities', async (req,res) => {
    cityDAO.getAllCities()
    .then((cities) => {
        if(!cities) {
            // no cities
            // handled by a `Not Found` error
            res.status(404).send();
        } else {
            res.json(cities);
        }
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});

// GET /api/markers
app.get('/api/markers', (req,res) => {
    cityDAO.getAllMarkers()
    .then((markers) => {
        if(!markers) {
            // no markers
            // handled by a `Not Found` error
            res.status(404).send();
        } else {
            res.json(markers)
        }
    }).catch(()=> {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});

// GET /api/city/<username>
app.get('/api/city/:username', (req, res) => {
    cityDAO.getCityByUsername(req.params.username)
    .then((city) => {
        if(!city) {
            // if you are here the city is not present in the database
            // handled by a `Not Found` error
            res.status(404).send();
        } else {
            res.json(city);
        }
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});

// GET /api/feedbacks/:username
app.get('/api/feedbacks/:username', (req, res) => {
    userDAO.getFeedbacksByUsername(req.params.username)
    .then((feedbacks) => {
        res.json(feedbacks);
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});


// GET /api/instruments/
app.get('/api/instruments/', (req, res) => {
    instrumentDAO.getAllInstruments()
    .then((instruments) => {
        res.json(instruments);
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});

// GET /api/genres/
app.get('/api/genres/', (req, res) => {
    genreDAO.getAllGenres()
    .then((genres) => {
        res.json(genres);
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});

// GET /api/platforms/
app.get('/api/platforms/', (req, res) => {
    platformDAO.getAllPlatforms()
    .then((platforms) => {
        res.json(platforms);
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});

// GET /api/videos/
app.get('/api/videos/', (req, res) => {
    videoDAO.getAllVideos()
    .then((videos) => {
        res.json(videos);
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});

// GET /api/requests/
app.get('/api/requests/:username', (req, res) => {
    userDAO.getRequestsByUsername(req.params.username)
    .then((requests) => {
        res.json(requests);
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});

// GET /api/collaborations/
app.get('/api/collaborations/:username', (req, res) => {
    userDAO.getCollaborationsByUsername(req.params.username)
    .then((collabs) => {
        res.json(collabs);
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    });
});



// * REST API POST/PUT/PATCH/DELETE * //


// POST /api/collaborations?source=<username>&destination=<username>
app.post('/api/collaborations', [
], (req, res) => {
    // extract the query content
    const source_username = req.query.source;
    const destination_username = req.query.destination;
    userDAO.getUserIdByUsername(source_username).then((id_source_user) => {
        userDAO.getUserIdByUsername(destination_username).then((id_destination_user) => {
            // remove the request
            userDAO.removeUserRequest(id_source_user, id_destination_user)
            .then(() => {
                // add the collaboration
                userDAO.addUserCollaboration(id_source_user, id_destination_user)
                .then(res.status(201).end())
                .catch((err) => {
                    // if you are here some sql errors occurred
                    // handled by an `Service Unavailable` error
                    res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the posting on collaboration'}]});
                })
            }).catch((err) => {
                // if you are here some sql errors occurred
                // handled by an `Service Unavailable` error
                res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the posting on request'}]});
            });   
        }).catch((err) => res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, cannot well identify the destination user'}]})); 
    }).catch((err) => res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, cannot well identify the source user'}]})); 
});


// DELETE /api/collaboration?user1=<username>&user2=<username>
app.delete('/api/collaborations', [   
], (req, res) => {
    // extract the query content
    const source_username = req.query.user1;
    const destination_username = req.query.user2;

    userDAO.getUserIdByUsername(source_username).then((id_user_1) => {

        userDAO.getUserIdByUsername(destination_username).then((id_user_2) => {
            //remove collaboration
            userDAO.removeUserCollaboration(id_user_1, id_user_2)
            .then(res.status(201).end())
            .catch((err) => {
                // if you are here some sql errors occurred
                // handled by an `Service Unavailable` error
                console.log(err)
                res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the posting on collaboration'}]});
            })
        }).catch((err) => {
            // if you are here some sql errors occurred
            // handled by an `Service Unavailable` error
            res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the removing on collaboration'}]});
        })
    }).catch((err) => {
        // if you are here some sql errors occurred
        // handled by an `Service Unavailable` error
        console.log(err)
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the removing on collaboration'}]});
    })
})

// DELETE /api/feedbacks?id=<feedback_id>
app.delete('/api/feedbacks', [   
], (req, res) => {
    // extract the query content
    const feedback_id = req.query.id;
    userDAO.removeFeedbackbyId(feedback_id).then(res.status(201).end()
    ).catch((err) => {
        // if you are here some sql errors occurred
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the removing of the feedback'}]});
    })
})


// POST /api/requests?source=<username>&destination=<username>
app.post('/api/requests', [
], (req, res) => {
    // extract the query content
    const source_username = req.query.source;
    const destination_username = req.query.destination;
    userDAO.getUserIdByUsername(source_username).then((id_source_user) => {
        userDAO.getUserIdByUsername(destination_username).then((id_destination_user) => {
            // post request
            userDAO.addUserRequest(id_source_user, id_destination_user)
            .then(() => res.status(201).end())
            .catch((err) => {
                // if you are here some sql errors occurred
                // handled by an `Service Unavailable` error
                res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the posting on request'}]});
            });   
        }).catch((err) => res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, cannot well identify the destination user'}]})); 
    }).catch((err) => res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, cannot well identify the source user'}]})); 
});



// POST /api/feedback?reviewer=<username>&reviewed=<username>
app.post('/api/feedback', [
    check('user').notEmpty().withMessage('username: Not defined'),
    check('picture').notEmpty().withMessage('picture: Not defined'),
    check('date').isLength({min: 4, max: 255}).withMessage('date: Length not respected'),
    check('comment').isLength({min: 3, max: 255}).withMessage('feedback: Length not respected'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // if you are here request body is not consistent
        // handled by an `Not Acceptable` error
        return res.status(406).json({ errors: errors.array() });
    }
    // if you are here you passed the checking stage
    // extract the query content
    const reviewer_username = req.query.reviewer;
    const reviewed_username = req.query.reviewed;

    if(!reviewer_username || !reviewer_username) {
        // if you are here request query content is empty
        // - handled by an `Bad Request` error
        res.status(400).json({errors: [{'param': 'Server', 'msg': 'Request content not consistent with the expected one'}]});
    } else {
        // get the userid of the *reviewer*
        userDAO.getUserIdByUsername(reviewer_username).then((id_reviewer_user) => {
            // get the userid of the *reviewed*
            userDAO.getUserIdByUsername(reviewed_username).then((id_reviewed_user) => {
                // add the feedback
                // extract the body content
                // ex: {user: 'steo13', picture: 'images/logo.png', date: '2021-12-28', feedback: 'opinion'}
                const new_feedback_date = req.body.date;
                const new_feedback_comment = req.body.comment;
                const new_feedback_picture= req.body.picture;
                
                const feedback = new Feedback(null, new_feedback_comment, new_feedback_date, new_feedback_picture, reviewer_username);

                userDAO.addFeedback(feedback, id_reviewed_user, id_reviewer_user)
                .then(() => res.status(201).end()).catch((err) => {
                    // if you are here some sql errors occurred
                    // handled by an `Service Unavailable` error
                    res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the posting'}]});
                });   
            }).catch((err) => res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, cannot well identify the reviewed user'}]})); 
        }).catch((err) => res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, cannot well identify the reviewer'}]})); 
    }
});


function UpdateUser(new_user_data, old_user_data, old_city_id, new_city_id, res){
     /* time to update the user */

     const to_update = {};

     new_user_data.name && new_user_data.name!==old_user_data.name ? to_update["name"] = new_user_data.name : to_update["name"] = old_user_data.name;

     new_user_data.surname && new_user_data.surname!==old_user_data.surname ? to_update["surname"] = new_user_data.surname : to_update["surname"] = old_user_data.surname;

     new_user_data.username && new_user_data.username!==old_user_data.username ? to_update["username"] = new_user_data.username : to_update["username"] = old_user_data.username;

     new_user_data.email && new_user_data.email!==old_user_data.email ? to_update["email"] = new_user_data.email : to_update["email"] = old_user_data.email;

     new_city_id && new_city_id!==old_city_id ? to_update["city"] = new_city_id : to_update["city"] = old_city_id;
 
     new_user_data.password && new_user_data.password!==old_user_data.password ? to_update["password"] = new_user_data.password : to_update["password"] = old_user_data.password;
 
     new_user_data.description && new_user_data.description!==old_user_data.description ? to_update["description"] = new_user_data.description : to_update["description"] = old_user_data.description;
         
     new_user_data.picture && new_user_data.picture!==old_user_data.picture ? to_update["picture"] = new_user_data.picture : to_update["picture"] = old_user_data.picture;
     
     new_user_data.availability!==null && new_user_data.availability!==old_user_data.availability ? to_update["availability"] = new_user_data.availability : to_update["availability"] = old_user_data.availability;
     
     let collaboration = {}
     new_user_data.collaboration.single!==null && new_user_data.collaboration.single!==old_user_data.collaboration.single ? collaboration["single"] = new_user_data.collaboration.single : collaboration["single"] = old_user_data.collaboration.single;
     new_user_data.collaboration.long!==null && new_user_data.collaboration.long!==old_user_data.collaboration.long ? collaboration["long"] = new_user_data.collaboration.long : collaboration["long"] = old_user_data.collaboration.long
     to_update["collaboration"] = collaboration;
 
     let hours = {}
     new_user_data.hours.morning!==null && new_user_data.hours.morning!==old_user_data.hours.morning ? hours["morning"] = new_user_data.hours.morning : hours["morning"] = old_user_data.hours.morning;
     new_user_data.hours.afternoon!==null && new_user_data.hours.afternoon!==old_user_data.hours.afternoon ? hours["afternoon"] = new_user_data.hours.afternoon : hours["afternoon"] = old_user_data.hours.afternoon;
     new_user_data.hours.evening!==null && new_user_data.hours.evening!==old_user_data.hours.evening ? hours["evening"] = new_user_data.hours.evening : hours["evening"] = old_user_data.hours.evening;
     to_update["hours"] = hours;

     if(new_user_data.instruments){
         for(let i of new_user_data.instruments){
             const inst = old_user_data.instruments.find(el => el.name === i.name);
             if(inst === undefined){
                 userDAO.addUserInstrument(i, old_user_data.id).catch((err) => { console.log(err); res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the instrument adding'}]}); });;
             } else if(i.rating !== inst.rating){ 
                 userDAO.updateUserInstrument(i, old_user_data.id).catch((err) => { res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the instrument updating'}]}); });
             }
         }
         for(let i of old_user_data.instruments){
             const inst = new_user_data.instruments.find(el=> el.name === i.name);
             if(inst === undefined){
                 userDAO.removeUserInstrument(i,old_user_data.id).catch((err) => { res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the instrument removing'}]}); });;
             }
         }
     }
 
     if(new_user_data.videos){
         for(let new_video of new_user_data.videos){
             const v = old_user_data.videos.find(el => el.link === new_video.link);
             if(v===undefined){
                 userDAO.addUserVideo(new_video,old_user_data.id).catch((err) => { console.log(err); res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the video adding'}]}); });;
             }
         }
         for(let i of old_user_data.videos){
             const v = new_user_data.videos.find(el => el.id === i.id);
             if(v === undefined){
                 userDAO.removeUserVideo(i).catch((err) => { res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the video removing'}]}); });;
             }
         }
     }
 
     if(new_user_data.link){
         for(let link of new_user_data.link){
             const platform = old_user_data.link.find(el => el.id === link.id);
             if(platform===undefined){
                 userDAO.addUserPlatform(link, old_user_data.id).catch((err) => { res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the platform link adding'}]}); });
             } else if(link.link !== platform.link){
                 userDAO.updateUserPlatform(link, old_user_data.id).catch((err) => { res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the platform link updating'}]}); });
             }
         }
         for(let i of old_user_data.link){
             const platform = new_user_data.link.find(el => el.id === i.id);
             if(platform === undefined){
                 userDAO.removeUserPlatform(i, old_user_data.id).catch((err) => { res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the platform removing'}]}); });;
             }
         }
     }

     if(new_user_data.genres){
         //remove all genres
         userDAO.removeUserGenres(old_user_data.id)
         .then(() => {
             for(let genre of new_user_data.genres){
                 //add the new muscial genres!
                 userDAO.addUserGenre(genre, old_user_data.id).catch((err) => { res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the musical genre adding'}]}); });
             }
         }).catch((err) => { console.log(err); res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the musical genres removing'}]}); });
     }
 
     userDAO.updateUser(to_update, old_user_data.id)
     .then((_username_) => {  userDAO.getUserByUsername(_username_).then((user) => { /*console.log(user);*/ res.status(201).end(); }) })
     .catch((err) => {
         // if you are here some sql errors occurred
         // handled by an `Service Unavailable` error
         console.log(err);
         res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the updating'}]});
     });
}

// PUT /api/user/:username
app.put('/api/user/:username', [
    check('name').notEmpty().withMessage('name: Not defined'),
    check('surname').notEmpty().withMessage('surname: Not defined'),
    check('email').notEmpty().withMessage('email: Not defined'),
    check('email').isEmail().withMessage('email: Not email format'),
    check('city').isJSON().withMessage('city: Not the proper format'),
    //check('password').isMD5().withMessage('password: Not the proper format'),
    check('description').isLength({min: 4, max: 255}).withMessage('description: Length not respected'),
    check('picture').isLength({min: 4, max: 255}).withMessage('picture: Length not respected'),
    check('collaboration').isJSON().withMessage('collaboration: Not the proper format'),
    check('hours').isJSON().withMessage('hours: Not the proper format'),
    check('instrument').isArray().withMessage('instrument: Not the proper format'),
    check('genres').isArray().withMessage('genres: Not the proper format'),
    check('videos').isArray().withMessage('videos: Not the proper format'),
    check('link').isArray().withMessage('link: Not the proper format'),
    check('availability').isBoolean().withMessage('availability: should be boolean'),
], (req,res) => {

    // extract body
    const new_user_data = req.body;

    const old_username = req.params.username;

    // check body completeness
    if(!new_user_data) return res.status(406).end();

    // get user information
    userDAO.getUserByUsername(old_username).then((old_user_data) => {
        if(!old_user_data) {
            // if you are here no user matches inside the database
            // handled by a `Not Found` error
            res.status(404).send();
        } else {
            Promise.all([cityDAO.getCityByName(new_user_data.city), cityDAO.getCityByName(old_user_data.city)
            ]).then((cities) => {

                // collect the cities id
                const old_city_id = cities[1].id;
                let new_city_id = null;

                try {
                    new_city_id = cities[0].id;
                } catch {
                    // collect the cities id
                    cityDAO.AddCity(new_user_data.city).then(() => {
                        cityDAO.getCityByName(new_user_data.city)
                        .then((city) => {
                            new_city_id = city.id;
                            UpdateUser(new_user_data, old_user_data, old_city_id, new_city_id, res);
                        });
                    });
                }

                UpdateUser(new_user_data, old_user_data, old_city_id, new_city_id, res);

            }).catch((err) => {
                // if you are here some sql errors occurred
                // handled by an `Service Unavailable` error
                console.log(err);
                res.status(503).json({errors: [{'param': 'Server', 'msg': 'Sorry, some internal problems occurred during the cities updating'}]});
            });//Promise errorsc
        }//else
    }).catch((err) => {
        // if you are here some errors occurred getting data from database
        // handled by an `Service Unavailable` error
        res.status(503).json({errors: [{'param': 'Server', 'msg': 'Service temporary down! Sorry for the drawback'}]});
    }); 
});

// * RUN THE SERVER * //

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});