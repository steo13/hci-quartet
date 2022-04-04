import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Profile from './components/Profile/Profile'
import HomePage from './components/HomePage/HomePage'
import Requests from './components/Requests/Requests'
import Loading from './components/Loading/Loading'

import React, { useState, useEffect } from 'react'

import disableScroll from 'disable-scroll';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom';


import API from './API.js'

disableScroll.on();

function App() {
  const [user, setUser] = useState(false)
  const [updateUser, setUpdateUser] = useState(false)
  const [updateMarkers, setUpdateMarkers] = useState(false)

  const [genres, setGenres] = useState([])
  const [socials, setSocials] = useState([])
  const [instruments, setInstruments] = useState([])
  const [markers, setMarkers] = useState([])
  const [requests, setRequests] = useState([])
  const [collabs, setCollabs] = useState([])

  const [profileSettings, setProfileSettings] = useState(false)
  const [requestSettings, setRequestSettings] = useState(false)
  
  useEffect(() => {
    const checkSocials = () => {
      API.getAllPlatforms().then(s => setSocials(s))
    }
    if (socials.length === 0)
      checkSocials()
  }, [socials])

  useEffect(() => {
    const checkGenres = () => {
      API.getAllGenres().then(g => setGenres(g))
    }
    if (genres.length === 0)
      checkGenres()
  }, [genres])

  useEffect(() => {
    const checkInstruments = () => {
      API.getAllInstruments().then(i => setInstruments(i))
    }
    if (instruments.length === 0)
      checkInstruments()
  }, [instruments])

  useEffect(() => {
    const checkUser = (username) => {
      API.getUser(username).then(u => {
        setUser(u);
        API.getAllRequests(u.username).then(r => setRequests(r));
        API.getAllCollabs(u.username).then(c => setCollabs(c));
      })
    }
    if (!user){
      checkUser('steo13')
    }
  }, [user])

  useEffect(() => {
    const checkUser = (username) => {
      API.getUser(username).then(u => setUser(u))
    }
    if (updateUser){
      checkUser('steo13')
      setUpdateMarkers(true)
    }
  }, [updateUser])

  useEffect(() => {
    const getAllMarkers = () => {
        API.getAllMarkers().then(m => setMarkers(m.map(m => { 
          m['lat'] = parseFloat(m['lat']); 
          m['lng'] = parseFloat(m['lng']); 
          return m
        })))
    }
    if ((markers.length === 0 || updateMarkers) && (user || updateUser)){
      getAllMarkers()
      setUpdateMarkers(false)
      setUpdateUser(false)
    }
  }, [markers, updateMarkers, user, updateUser])

  return (
    <Router>
      {
        // if you are here there's a problem on data loading
        // probably the server is down
        !user || !socials || !genres || !instruments || !markers  ? <Loading type={'cylon'} color={'#0275d8'} /> : <></>
      }
      <Switch>
        <Route path='/profile' render={() => <>
          {
          !profileSettings ? <Redirect to='/'/> : <Profile settings={profileSettings} setShowProfileSettings={(value) => setProfileSettings(value)}
                                                              genres={genres} socials={socials} instruments={instruments} user={user}
                                                              updateUser={(value) => setUpdateUser(value)}/> }</>
        }/>
        <Route path='/requests' render={() => <>
          {
          !requestSettings ? <Redirect to='/'/> :  <Requests settings={profileSettings} setShowProfileSettings={(value) => setProfileSettings(value)}
                                                              req_settings={requestSettings} setShowRequestSettings={(value) => setRequestSettings(value)}
                                                              requests={requests.filter((r) => r["destination"] === user.username)} setRequests={(value) => setRequests(value)}
                                                              sent_requests = {requests.filter((r) => r["source"] === user.username)}
                                                              collabs={collabs} setCollabs={(value) => setCollabs(value)}
                                                              user={user}>
                                                    </Requests>}</>
        }/>
        <Route path='/' render={() => <> 
          { profileSettings ? <Redirect to='/profile'/> : requestSettings ? <Redirect to='/requests'/> : <HomePage settings={profileSettings} setShowProfileSettings={(value) => setProfileSettings(value)}
                                                                      req_settings={requestSettings} setShowRequestSettings={(value) => setRequestSettings(value)} requests={requests} collabs={collabs}
                                                                      setRequests={(value) => setRequests(value)}
                                                                      genres={genres} socials={socials} instruments={instruments} user={user}
                                                                      markers={markers} />
          }</>
        }
        />
      </Switch>
    </Router>
  );
}

export default App;
