import React, { useEffect, useState } from 'react'
import { Container, Button, ButtonGroup, ToggleButton} from "react-bootstrap"

import GoogleMap from '../GoogleMap';
import Filters from '../Filters/Filters';
import Profiles from '../Profiles/Profiles'

import disableScroll from 'disable-scroll';
import CustomNavbar from '../CustomNavBar/CustomNavbar';
import API from '../../API';
import './homepage.css'

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

/** just change color on Map button press 
function changeColorMap() {
    let map_button = document.getElementById("button-map");
    let filters_button = document.getElementById("button-filters");
    if(map_button.value === "0") {
        map_button.style.backgroundColor = "#0275d8";
        map_button.style.color = "white";
        map_button.value = "1";
        //
        filters_button.style.backgroundColor = "white";
        filters_button.style.color = "#0275d8";
        filters_button.value = "0"
    } else {
        map_button.style.backgroundColor = "white";
        map_button.style.color = "#0275d8";
        map_button.value = "0";
    }
}*/


/** just change color on Map button press 
function changeColorFilters() {
    let filters_button = document.getElementById("button-filters");
    let map_button = document.getElementById("button-map");
    if(filters_button.value === "0") {
        filters_button.style.backgroundColor = "#0275d8";
        filters_button.style.color = "white";
        filters_button.value = "1";
        ///
        map_button.style.backgroundColor = "white";
        map_button.style.color = "#0275d8";
        map_button.value = "0";
    } else {
        filters_button.style.backgroundColor = "white";
        filters_button.style.color = "#0275d8";
        filters_button.value = "0";
    }
}*/


function HomePage (props) {
    const [showFilters, setShowFilters] = useState(false);
    const [showProfiles, setShowProfiles] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const [users, setUsers] = useState([])
    const [filterUsers, setFilterUsers] = useState(users)
    //Stato che memorizza tutte le città presenti nel db con associato il numero di musicisti per ogni città
    //Stato che memorizza la città di default dell'utente loggato, lo si può settare tramite props direttamente da App o tramite useEffect()
    const [city, setCity] = useState(null)
    const [range, setRange] = useState(0)
    const [results, setResults] = useState(0)
    const [filters, setFilters] = useState({})

    useEffect(() => {
        if (props.user){
            setCity({city: props.user.city['city'], lat: parseFloat(props.user.city['lat']), lng: parseFloat(props.user.city['lng'])})
        }
    }, [props.user])
    
    useEffect(() => {
        const updateResults = (range) => {
            setResults(props.markers.filter(m => getDistanceFromLatLonInKm(city.lat, city.lng, m.lat, m.lng) <= range).map(m => m.musicians).reduce((m1, m2) => m1 + m2, 0))
        }
        if (city)
            updateResults(range)
    }, [range, props.markers, city])

    useEffect(() => {
        const updateUsers = (city, range) => {
            setFilterUsers(users.filter(u => u.city.city === city || getDistanceFromLatLonInKm(u.city.lat, u.city.lng, city.lat, city.lng) <= range ))
            setFilters({city: city.city, range: `${range}km`})
        }
        if (city)
            updateUsers(city, range)
    }, [results, city, range, users])

    useEffect(() => {
        if (showFilters || showProfiles)
            disableScroll.off()
        else {
            disableScroll.on()
            if (city){
                setFilterUsers(users.filter(u => u.city.city === city || getDistanceFromLatLonInKm(u.city.lat, u.city.lng, city.lat, city.lng) <= range ))
                setFilters({city: city.city, range: `${range}km`})
            }
        }
    }, [showFilters, showProfiles, users, city, range])

    useEffect(() => {
        if (!showProfiles)
            setShowFilters(false)
    }, [showProfiles])

    useEffect(() => {
        const getAllUsers = () => {
            API.getAllUsers().then(u => setUsers(u))
        }
        if (users.length === 0)
            getAllUsers()
    }, [users])

    useEffect(() => {
        if (city)
            setFilterUsers(users.filter(u => u.city.city === city || getDistanceFromLatLonInKm(u.city.lat, u.city.lng, city.lat, city.lng) <= range ))
    }, [city, users, range])

    return (<>
    <CustomNavbar settings={props.settings} setProfileSettings={(value) => props.setShowProfileSettings(value)}
                  profiles={showProfiles} setProfiles={(value) => setShowProfiles(value)}
                  req_settings={props.req_settings} setRequestSettings={(value) => props.setShowRequestSettings(value)} requests={props.requests}
                  profile={showProfile} setProfile={(value) => setShowProfile(value)} user={props.user} />

    <Container className='mt-2 mb-2'>
        {
            showProfiles ? <Profiles originalUsers={users} users={filterUsers} filters={filters} lat={city.lat} lng={city.lng}
                                     instruments={props.instruments} genres={props.genres} socials={props.socials} user={props.user}
                                     collabs={props.collabs} requests={props.requests} setRequests={(value) => props.setRequests(value)}
                                     profile={showProfile} setProfile={() => setShowProfile(true)}/> : city ? <>
            
            <ButtonGroup className='mb-2 toggleButton'>
                <ToggleButton className="gap-2 menuButton" active={!showFilters} id="button-map" value="0" variant='outline-primary' size='md' onClick={(e) => { setShowFilters(false); }}>
                    <img src="/images/svg/maps.svg" width='30' height='30' alt='location icon'/> <font size={`${city.city.length <= 11 ? '3' : city.city.length < 14 ? '2' : '1'}`}>{city.city}</font>
                </ToggleButton>
                <ToggleButton className="gap-2 menuButton" id="button-filters" value="0" active={showFilters} variant='outline-primary' size='md' onClick={(e) => {  setShowFilters(true); }}>
                    <img src="/images/svg/filters.svg" width='30' height='30' alt='filters icon'/><font size='3'> Filters</font>
                </ToggleButton>
            </ButtonGroup>

            {
                showFilters ? <Filters city={city.city} users={filterUsers} originalUsers={users} results={results} range={range} showProfiles={() => { setShowProfiles(true);  }} setNewProfiles={(profiles) => setFilterUsers(profiles)} setFilters={(value) => setFilters(value)}
                                       instruments={props.instruments} genres={props.genres}/> : <>
                                       
                <GoogleMap city={city} change={(city) => setCity(city)} markers={props.markers} range={range} 
                       setRange={(value) => setRange(value) }
                       showMapFilters={true} />

                <div className='d-grid' style={{position: 'fixed', bottom: '40px', width: `${window.screen.width - 26}px`}}>
                    <Button size='lg' onClick={() => { setShowProfiles(true); } } disabled={results === 0 ? true : false}>Show results ({results})</Button>
                </div> </>
            } 
            </> : ''
        }
    </Container>
</>)}

export default HomePage
export { getDistanceFromLatLonInKm, deg2rad }