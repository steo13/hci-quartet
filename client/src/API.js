function getUser(username) {
    //call GET /api/user/<username>
    return new Promise((res, rej) => {
        fetch(`/api/user/${String(username)}`)
            .then(resp => resp.json())
            .then(user => res(user))
            .catch(err => rej(err))
    })
}

function getAllPlatforms() {
    //call GET /api/platforms
    return new Promise((res, rej) => {
        fetch('/api/platforms')
            .then(resp => resp.json())
            .then(platforms => res(platforms))
            .catch(err => rej(err))
    })
}

function getAllGenres() {
    //call GET /api/genres
    return new Promise((res, rej) => {
        fetch('/api/genres')
            .then(resp => resp.json())
            //.then(genres => res(genres.sort()))
            .then(genres => res( genres.sort((a, b) => a["name"].length - b["name"].length)))
            .catch(err => rej(err))
    })
}

function getAllInstruments() {
    //call GET /api/instruments
    return new Promise((res, rej) => {
        fetch('/api/instruments')
            .then(resp => resp.json())
            //.then(instruments => res(instruments.sort()))
            .then(instruments => res(instruments.sort((a, b) => a["name"].length - b["name"].length)))
            .catch(err => rej(err))
    })
}

function getAllFeedbacks(username) {
    //call GET /api/feedbacks/:username
    return new Promise((res, rej) => {
        fetch(`api/feedbacks/${username}`)
        .then(resp => resp.json())
        .then(feedbacks => res(feedbacks))
        .catch(err => rej(err))
    })
}

function removeFeedbackbyId(feedback_id) {
    //call DELETE /api/feedbacks?id=<feedback_id>
    return new Promise((resolve, reject) => {
        fetch(`/api/feedbacks?id=${feedback_id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else 
                response.json().then((obj) => { reject(obj); })
        }).catch(err => { reject({'error': 'Cannot comunicate with the server'})})
    })
}

function getAllRequests(username) {
    //call GET /api/requests/:username
    return new Promise((res, rej) => {
        fetch(`api/requests/${username}`)
        .then(resp => resp.json())
        .then(requests => res(requests))
        .catch(err => rej(err))
    })
}

function getAllCollabs(username) {
    //call GET /api/collaborations/:username
    return new Promise((res, rej) => {
        fetch(`api/collaborations/${username}`)
        .then(resp => resp.json())
        .then(collabs => res(collabs))
        .catch(err => rej(err))
    })
}


function getAllUsers() {
    //call GET /api/users
    return new Promise((res, rej) => {
        fetch('/api/users')
            .then(resp => resp.json())
            .then(users => res(users))
            .catch(err => rej(err))
    })
}

function getAllMarkers() {
    //call GET /api/markers
    return new Promise((res, rej) => {
        fetch('/api/markers')
            .then(resp => resp.json())
            .then(markers => res(markers))
            .catch(err => rej(err))
    })
}

function postFeedback(feedback, user) {
    //call POST /api/feedback?reviewer=<username>&reviewed=<username>
    return new Promise((resolve, reject) => {
        fetch(`/api/feedback?reviewer=${feedback.user}&reviewed=${user}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedback)
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else 
                response.json().then((obj) => { reject(obj); })
        }).catch(err => { reject({'error': 'Cannot comunicate with the server'})})
    })
}

function postCollaboration(source_username, destination_username) {
    //call POST /api/collaborations?source=<username>&destination=<username>
    return new Promise((resolve, reject) => {
        fetch(`/api/collaborations?source=${source_username}&destination=${destination_username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else 
                response.json().then((obj) => { reject(obj); })
        }).catch(err => { reject({'error': 'Cannot comunicate with the server'})})
    })
}

function postRequest(source_username, destination_username) {
    //call POST /api/requests?source=<username>&destination=<username>
    return new Promise((resolve, reject) => {
        fetch(`/api/requests?source=${source_username}&destination=${destination_username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else 
                response.json().then((obj) => { reject(obj); })
        }).catch(err => { reject({'error': 'Cannot comunicate with the server'})})
    })
}

function removeCollaboration(source_username, user_username) {
    //call DELETE /api/collaboration?user1=<username>&user2=<username>
    return new Promise((resolve, reject) => {
        fetch(`/api/collaborations?user1=${source_username}&user2=${user_username}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else 
                response.json().then((obj) => { reject(obj); })
        }).catch(err => { reject({'error': 'Cannot comunicate with the server'})})
    })
}

function updateUser(user){
    //call PUT /api/user/:username
    return new Promise((resolve, reject) => {
        fetch(`/api/user/${user.username}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then((response) => {
            if (response.ok)
                resolve('ok');
            else 
                response.json().then((obj) => { reject(obj); 
            }).catch(err => { reject({'error': 'Cannot comunicate with the server'})})
        })
    })
}

const API = { getUser, getAllPlatforms, getAllGenres, getAllInstruments, getAllFeedbacks, getAllUsers, getAllMarkers, postFeedback, updateUser, getAllRequests, getAllCollabs, postCollaboration, removeCollaboration, postRequest, removeFeedbackbyId}
export default API