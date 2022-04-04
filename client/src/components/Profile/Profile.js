import { Fragment, useEffect, useState } from 'react';
import '../../App.css';
import { Image, Form, Toast, ToastContainer, Container, FormControl, Button, ToggleButton, Row, Col, Carousel, Modal, Alert, Spinner, InputGroup, Card } from 'react-bootstrap'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import { FaStar } from 'react-icons/fa'
import disableScroll from 'disable-scroll';

import CustomNavbar from '../CustomNavBar/CustomNavbar';
import API from '../../API';
import Loading from '../Loading/Loading.js'
import ModalInfo from '../Filters/ModalInfo.js'

import './profile.css'

function Profile(props) {
    //Città di default dell'utente
    const [user, setUser] = useState(props.user)
    const [address, setAddress] = useState('')
    const [autocomplete, setAutocomplete] = useState(true)
    const [changePassword, setChangePassword] = useState(false)
    const [changePicture, setChangePicture] = useState(false)
    const [changeVideos, setChangeVideos] = useState(false)

    const [showModal, setShowModal] = useState(false)
    
    const [showModalSkill, setShowModalSkill] = useState({visible: false, information: ''})


    /**
     * Function for calling the info modal
     */
    const handleInfoModal = (info) => {
        if(info)
          setShowModalSkill({visible: !showModalSkill.visible, information: info})
        else
          setShowModalSkill({visible: !showModalSkill.visible, information: ''})
    }

    const handleChange = address => {
        setAutocomplete(true)
        setAddress(address);
      };
     
    const handleSelect = address => {
        setAddress(address)
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                //console.log(latLng['lat'])
                setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
                  email: user.email, city: {city: address.split(',')[0], lat: latLng['lat'], lng: latLng['lng']},
                  availability: user.availability, collaboration: user.collaboration, hours: user.hours,
                  picture: user.picture, description: user.description, instruments: user.instruments,
                  genres: user.genres, videos: user.videos, link: user.link})
            })
            .catch(error => console.error('Error', error));
    };

    const updateInstruments = (instrument) => {
      let newInstruments = [...user.instruments]
      if (newInstruments){
        if (newInstruments.filter(i => i['name'] === instrument['name']).length === 1){
          newInstruments = newInstruments.filter(i => i['name'] !== instrument['name'])
        }else
          newInstruments.push({id: instrument['id'], name: instrument['name'], rating: 0})
        setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
          email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
          hours: user.hours, picture: user.picture, description: user.description, instruments: newInstruments,
          genres: user.genres, videos: user.videos, link: user.link})
        }
    }

    const updateRating = (instrument, value) => {
      let newRating = [...user.instruments]
      newRating.map(r => r['name'] === instrument ? r['rating'] = value : '')
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: newRating,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updateAvailability = () => {
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: !user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updateCollaboration = (value) => {
      let newCollaboration = {...user.collaboration}
      newCollaboration[value] = !newCollaboration[value]
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: newCollaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updateHours = (value) => {
      let newHours = {...user.hours}
      newHours[value] = !newHours[value]
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: newHours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updateLink = (social, value) => {
      let newLink = [...user.link]
      if (newLink.filter(l => l['name'] === social['name']).length === 0)
        newLink.push({id: social['id'], name: social['name'], link: value})
      else
        newLink.map(l => l['name'] === social['name'] ? l['link'] = value : '')
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: newLink})
    }

    const updateName = (value) => {
      setUser({id: user.id, username: user.username, password: user.password, name: value, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updateSurname = (value) => {
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: value, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updateUsername = (value) => {
      setUser({id: user.id, username: value, password: user.password, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updateEmail = (value) => {
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
        email: value, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updatePassword = (value) => {
      setUser({id: user.id, username: user.username, password: value, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updateDescription = (value) => {
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: value, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updateImage = (value) => {
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: value, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: user.videos, link: user.link})
    }

    const updateVideo = (video) => {
      let newVideos = [...user.videos, {id: user.videos.length+1, link: video}]
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: newVideos, link: user.link})
    }

    const deleteVideo = (video) => {
      let newVideos = user.videos.filter(v => v['id'] !== video['id'])
      setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
        email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
        hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
        genres: user.genres, videos: newVideos, link: user.link})
    }

    const updateGenres = (genre) => {
      let newGenres = [...user.genres]
      if (newGenres){
        if (newGenres.filter(g => g['name'] === genre['name']).length === 1){
          newGenres = newGenres.filter(g => g['name'] !== genre['name'])
        } else
          newGenres.push({id: genre['id'], name: genre['name']})
        setUser({id: user.id, username: user.username, password: user.password, name: user.name, surname: user.surname, 
          email: user.email, city: user.city, availability: user.availability, collaboration: user.collaboration, 
          hours: user.hours, picture: user.picture, description: user.description, instruments: user.instruments,
          genres: newGenres, videos: user.videos, link: user.link})
        }
    }

    useEffect(() => {
      if (user)
        setAddress(user.city.city)
    }, [user])

    const updateUser = () => {
      API.updateUser(user).then((resp) => {
        if (resp) {
          props.updateUser(true)
          setShowModal(true)
        }
      }).catch(e => setUser(null))
    }

    return (<>

      {disableScroll.off()}

      { !user || props.genres.length === 0 || props.instruments.length === 0 || props.socials.length === 0 ? <Loading type={'cylon'} color={'#0275d8'} /> : <>
      
      
      <CustomNavbar settings={props.settings} setProfileSettings={(value) => props.setShowProfileSettings(value)} setUser={() => { updateUser() }} />
      
      <Container className='mt-3'>
         
        <Card style={{marginTop: "10px"}}>
          <Card.Header>Choose a profile image</Card.Header>
          <Card.Body>
          <Card.Text className="text-secondary"><i className="bi bi-person-circle"></i>Be more attractive for the other users updating you profile</Card.Text>
            <div className='mt-4 d-flex justify-content-center'>
              <Image alt="profile-image" thumbnail={true} src={user.picture} width='150'></Image>
            </div>
          </Card.Body>
          <Card.Footer>
            <Button variant='link' onClick={() => setChangePicture(true)}>Change profile picture</Button>
          </Card.Footer>
        </Card>

        <Card style={{marginTop: "20px"}}>
          <Card.Header>About you</Card.Header>
          <Card.Body>
          <Card.Text className="text-secondary"><i className="bi bi-pen-fill"></i>Introduce yourself to other users typing some general information and a brief description.</Card.Text>
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm-1">Name</InputGroup.Text>
              <Form.Control style={{borderColor: "transparent"}} placeholder={user.name} onChange={(e) => updateName(e.target.value)}/>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm-2">Surname</InputGroup.Text>
              <Form.Control style={{borderColor: "transparent"}} placeholder={user.surname} onChange={(e) => updateSurname(e.target.value)}/>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm-3">Username</InputGroup.Text>
              <Form.Control style={{borderColor: "transparent"}} disabled placeholder={user.username} onChange={(e) => updateUsername(e.target.value)}/>
            </InputGroup>
            <Form.Label>Talk about you:</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control as="textarea" placeholder={user.description} style={{height: '150px'}} onChange={(e) => updateDescription(e.target.value)} />
            </InputGroup>
            <hr></hr>
            <Card.Text>Set new password:</Card.Text>
            <div className="d-grid gap-2">
              <Button size="md" className="btn-block" variant='danger' onClick={() => setChangePassword(true)}>Change password</Button>
            </div>
          </Card.Body>
        </Card>

        <Card style={{marginTop: "20px"}}>
          <Card.Header>Availability</Card.Header>
          <Card.Body>
            <Card.Text className="text-secondary"><i className="bi bi-eye-slash"></i>Disable if you want to appear unavailable to the other musicians, who cannot temporarily see your contacts You will be able to rehabilitate yourself when you wish.</Card.Text>
              <Form.Check checked={user.availability} type='switch' label='Available for collaborations' onClick={() => updateAvailability()} onChange={() => {}}/>
          </Card.Body>
        </Card>

        <Card style={{marginTop: "20px"}}>
          <Card.Header>Where are you from?</Card.Header>
          <Card.Body>
            <Card.Text className="text-secondary"><i className="bi bi-geo-alt-fill"></i>Select the city where you live: it will be the starting place from which to look around.</Card.Text>
            <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect} 
                                searchOptions={{types: ['(regions)'], componentRestrictions: {country: "it"}}}>
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (<>
                <div>
                    <FormControl {...getInputProps({placeholder: 'Search Places ...', className: 'location-search-input' })}
                                onBlur={() => { setAddress(user.city.city); setAutocomplete(false) } }/>
                    <div className="autocomplete-dropdown-container">
                        { autocomplete ? <>
                          {loading && <Loading type={'cylon'} color={'#0275d8'} />}
                          {suggestions.map((suggestion, index) => {
                            const className = suggestion.active
                              ? 'suggestion-item--active'
                              : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                              ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                              : { backgroundColor: '#ffffff', cursor: 'pointer' };
                            return (
                              <div key={index} {...getSuggestionItemProps(suggestion, { className, style })}>
                                <span>{suggestion.description}</span>
                              </div>
                            );
                          }
                        )}
                        </> : ''}  
                    </div>
                </div>
                </>)}
            </PlacesAutocomplete>
          </Card.Body>
        </Card>

        <Card style={{marginTop: "20px"}}>
          <Card.Header>Instruments played</Card.Header>
          <Card.Body>
            <Card.Text className="text-secondary"><i className="bi bi-file-earmark-music"></i>Select your musical instruments and rates your skill level.</Card.Text>
            <div align='center'>
              {
                props.instruments.map((i, index) =>( <Fragment key={index}>
                    <ToggleButton className='mt-2 toggleBut' id={"toggle-check"+index}type="checkbox" variant="outline-primary" value="1" checked={user.instruments.filter(i2 => i2['name'] === i['name']).length === 1 ? true : false} 
                                  onClick={() => { updateInstruments(i)}}>
                      <Image src={i['icon']} alt=''/> {i['name']}
                    </ToggleButton>{' '}
                </Fragment>))
              }
            </div>
            <div style={{marginTop: "30px"}}>
              <Card.Text>
                <Image alt="question" src="/images/svg/question.svg" className='Question-logo' onClick={(e) => handleInfoModal('Skill level')}/>  
                Select skill level:
              </Card.Text>
                {
                user.instruments.map((i, index) => (<Fragment key={index}>
                  <div key={index}>
                    <Image src={props.instruments.filter(i2 => i2['name'] === i['name'])[0]['icon']}/>{' '}
                    <Form.Label>{i['name']}:</Form.Label>{' '}
                    {[...Array(5)].map((star, cont) => {
                        const ratingValue = cont + 1;
                        return (
                            <label key={cont}>
                                <input type='radio' name='rating' value={ratingValue} onClick={() => updateRating(i['name'], ratingValue)}/>
                                <FaStar className='star' color={ratingValue <= i['rating'] ? '#ffc107' : 'e4e5e9'} ratingsize={20}/>
                            </label>
                )})}</div></Fragment>))
                }
              </div>
          </Card.Body>
        </Card>

        <Card style={{marginTop: "20px"}}>
          <Card.Header>Musical genres</Card.Header>
          <Card.Body>
            <Card.Text className="text-secondary"><i className="bi bi-headset"></i>Which musical genres do you prefer to play?</Card.Text>
            <div align='center'>
              {
                props.genres.map((g, index) =>( <Fragment key={index}>
                  <ToggleButton className='mt-2 toggleBut' id={"toggle-check"+index+"-2"} type="checkbox" variant="outline-primary" value="1" 
                                checked={user.genres.filter(g2 => g2['name'] === g['name']).length === 1 ? true : false}
                                onClick={() => { updateGenres(g)}}>
                    <Image src={g['icon']} alt='' width='24px' height='24px'/> {g['name']}
                  </ToggleButton>{' '}
                </Fragment>))
              }
            </div>
          </Card.Body>
        </Card>

        <Card style={{marginTop: "20px"}}>
          <Card.Header>Collaboration goal</Card.Header>
          <Card.Body>
            <Card.Text className="text-secondary"><i className="bi bi-bullseye"></i>Make it clear the type of collaboration.</Card.Text>
            <div>
              <Form.Check checked={user.collaboration['single']} inline label='Single time collaboration' type='checkbox' onClick={() => updateCollaboration('single')} onChange={() => {}}></Form.Check>
              <Form.Check checked={user.collaboration['long']} inline label='Long time collaboration' type='checkbox' onClick={() => updateCollaboration('long')} onChange={() => {}}></Form.Check>
            </div>
          </Card.Body>
        </Card>


        <Card style={{marginTop: "20px"}}>
          <Card.Header>Availability hours</Card.Header>
          <Card.Body>
            <Card.Text className="text-secondary"><i className="bi bi-clock-history"></i>Make your preferences on meeting and rehearsal times known.</Card.Text>
            <div>
              <Form.Check checked={user.hours['morning']} inline label='Morning (9am - 13pm)' type='checkbox' onClick={() => updateHours('morning')} onChange={() => {}}></Form.Check><i className="bi bi-brightness-high" style={{paddingLeft: '24px', paddingRight: '5px'}}></i>
              <Form.Check checked={user.hours['afternoon']} inline label='Afternoon (15pm - 19pm)' type='checkbox' onClick={() => updateHours('afternoon')} onChange={() => {}}></Form.Check><i className="bi bi-cloud-sun-fill" style={{paddingLeft: '5px', paddingRight: '5px'}}></i>
              <Form.Check checked={user.hours['evening']} inline label='Evening (20pm - 24pm)' type='checkbox' onClick={() => updateHours('evening')} onChange={() => {}}></Form.Check><i className="bi bi-moon" style={{paddingLeft: '17px', paddingRight: '5px'}}></i>
            </div>
          </Card.Body>
        </Card>

        <Card style={{marginTop: "20px"}}>
          <Card.Header>Your performances</Card.Header>
          <Card.Body>
            <Card.Text className="text-secondary"><i className="bi bi-camera-video-fill"></i>Upload your video performances.</Card.Text>
              {<>
                <Carousel key={1} className='mt-2' variant='dark' indicators={false} interval={null}>
                  { user.videos.map((v, index) => { return (
                    <Carousel.Item key={index}>
                      <div className='d-flex flex-fill justify-content-center'>
                        <video style={{width:'80%'}} controls>
                          <source src={v['link']} type="video/mp4"></source>
                        </video>
                      </div>
                      <div className='d-flex justify-content-center'>
                        <Button variant='danger' size='sm' className='mb-1 mt-2' onClick={() => deleteVideo(v)}>Delete</Button>
                      </div>
                    </Carousel.Item>
                  )}) }
                </Carousel>
              </>}
              <div className='d-flex justify-content-center'>
                <Button variant='link' onClick={() => setChangeVideos(true)}>Update your videos</Button>
              </div>
          </Card.Body>
        </Card>

        <Card style={{marginTop: "20px"}}>
          <Card.Header>Social and contacts</Card.Header>
          <Card.Body>
            <Card.Text className="text-secondary"><i className="bi bi-signal"></i>Share your social contacts, so you can be contacted on the medium you prefer.</Card.Text>
              {
                  props.socials.map(s => (<>
                  <InputGroup className="mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1"><i className={s['icon']}></i></span>
                    </div>
                    <Form.Control value={user.link.filter(l => l['name'] === s['name']).length === 1 ? user.link.filter(l => l['name'] === s['name'])[0]['link']: ''} type='link' placeholder={'your '+s['name']+' link'} onChange={(e) => updateLink(s, e.target.value)}/>
                  </InputGroup>
                </>))
              }
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
              <Form.Control placeholder={user.email} aria-label="Email" onChange={(e) => updateEmail(e.target.value)}/>
            </InputGroup>
          </Card.Body>
        </Card>
        
      </Container>

    {
      changePassword ? <ChangePasswordModal show={changePassword} setShow={(value) => setChangePassword(value)} setPassword={(value) => updatePassword(value)} user={user}/> : ''
    }
    {
      changePicture ? <ChangePictureModal show={changePicture} setShow={(value) => setChangePicture(value)} setImage={(value) => updateImage(value)}/> : ''
    }
    {
      changeVideos ? <ChangeVideosModal show={changeVideos} setShow={(value) => setChangeVideos(value)} setVideos={(video) => updateVideo(video)}/> : ''
    }
    {
      showModal ? 
          <ToastContainer className="sticky-top p-3" position={'middle-center'}>
            <Toast show={showModal} style={{position: "relative", top: window.scrollY, right: "0"}} onClose={() => setShowModal(false)} delay={3000} role="alert" aria-live="assertive" bg={'light'} autohide>
              <Toast.Header>
                <Image src={user.picture} alt="profile_image" height={"30px"} width={"30px"} style={{borderRadius: "50%", marginRight: "5px"}}></Image>
                <strong className="me-auto">Quartet</strong>
                <small>{new Date().toLocaleString('it-IT', {'month': '2-digit', 'day': '2-digit'})}</small>
              </Toast.Header>
              <Toast.Body><i className="bi bi-check-lg check-icon text-success"></i>Updates correctly saved!</Toast.Body>
            </Toast>
          </ToastContainer> : ''
    }
    
    <ModalInfo showModal={showModalSkill} handleInfoModal={handleInfoModal} />

    </>} 
  </>)
}

//Modal on 'Change password'
function ChangePasswordModal (props) {
  const [verify, setVerify] = useState(true)
  const [message, setMessage] = useState('Old password incorrect')

  const [oldPass, setOldPass] = useState('')
  const [newPass1, setNewPass1] = useState('')
  const [newPass2, setNewPass2] = useState('')

  const verifyPassword = () => {
    if (oldPass === props.user.password){
      if (newPass1 === newPass2){
        if (newPass1.length === 0 && newPass2.length === 0){
          setVerify(false)
          setMessage('Insert the passwords')
        } else {
          setVerify(true)
          props.setShow(false)
          props.setPassword(newPass1)
        }        
      } else {
        setVerify(false)
        setMessage('The passwords are different')
      }
    } else {
        setVerify(false)
        setMessage('Old password incorrect')
    }
  }
  return (
    <Modal show={props.show} centered onHide={() => props.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Change password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col><Form.Label>Insert old password:</Form.Label></Col>
          <Col><Form.Control type='password' placeholder='Old password' onChange={(e) => { setOldPass(e.target.value) }}/></Col>
        </Row>
        <Row className='mt-2'>
          <Col><Form.Label>Insert new password:</Form.Label></Col>
          <Col><Form.Control type='password' placeholder='New password' onChange={(e) => { setNewPass1(e.target.value) }}/></Col>
        </Row>
        <Row className='mt-2'>
          <Col><Form.Label>Reinsert new password:</Form.Label></Col>
          <Col><Form.Control type='password' placeholder='New password' onChange={(e) => { setNewPass2(e.target.value) }}/></Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        { !verify ? <Alert variant='danger'>{message}</Alert> :  ''}
        <Button variant='success' onClick={() => verifyPassword()}>Change</Button>
      </Modal.Footer>
    </Modal>
  )
}

//Modal on 'Change Picture'
function ChangePictureModal (props) {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [accept, setAccept] = useState(false)

  const uploadImage = async e => {
    setLoading(true)
    const files = e.target.files
    if (files){
      if(files[0].name.split('.').slice(-1)[0] === 'jpg' || files[0].name.split('.')[1] === 'png' || 
          files[0].name.split('.')[1] === 'jpeg') {
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'hciproject')
        const res = await fetch(
          'https://api.cloudinary.com/v1_1/dfscqvt5e/image/upload',
          {
            method: 'POST',
            body: data
          }
        )
        const file = await res.json()
        setImage(file.secure_url)
        setLoading(false)
        setAccept(true)
      } else {
        setAccept(false)
        setLoading(false)
      }
    }
  }

  return (
    <Modal show={props.show} centered onHide={() => props.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Change profile picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="App">
          <h1>Upload Image</h1>
          <Form.Control type="file" name="file" placeholder="Upload an image" onChange={uploadImage} accept='.png, .jpg, .jpeg'/>
          { loading ? <><h3 className='mt-2'>Loading...</h3><Spinner animation='border'/></> : 
            accept ? image ? <><h4 className='mt-3'>Preview</h4><Image className='mt-2' src={image} style={{ width: '200px' }} alt=''/></>
            : '' : <Alert className='mt-3' variant='danger'>Choose a correct format for the image (.png, .jpg, .jpeg)</Alert>
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={!accept} variant='success' onClick={() => { props.setShow(false); props.setImage(image); }}>Upload</Button>
      </Modal.Footer>
    </Modal>
  )
}

// Modal on Change Video
function ChangeVideosModal (props) {
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [accept, setAccept] = useState(false)

  const uploadVideo = async e => {
    setLoading(true)
    const files = e.target.files
    if (files){
      if(files[0].name.split('.').slice(-1)[0] === 'mp4' || 
            files[0].name.split('.').slice(-1)[0] === 'mov' || files[0].name.split('.').slice(-1)[0] === 'avi' || 
            files[0].name.split('.').slice(-1)[0] === 'wmw') {
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'hciproject')
        const res = await fetch(
          'https://api.cloudinary.com/v1_1/dfscqvt5e/video/upload',
          {
            method: 'POST',
            body: data
          }
        )
        const file = await res.json()

        setVideo(file.secure_url)
        setLoading(false)
        setAccept(true)
      } else{
        setAccept(false)
        setLoading(false)
      }
    }
  }

  return (
    <Modal show={props.show} centered onHide={() => props.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Update your videos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="App">
          <h1>Upload Video</h1>
          <Form.Control type="file" name="file" placeholder="Upload a video" onChange={uploadVideo} accept={'.mp4, .mov, .wmv, .avi'}/>
          { loading ? <><h3 className='mt-2'>Loading...</h3><Spinner animation='border'/></> :
            accept ? video ?
            <><h4 className='mt-3'>Preview</h4>
            <video style ={{width:"300px"}}>
              <source src={video}/>
            </video> </>: '' : <Alert className='mt-3' variant='danger'>Choose a correct format for the video (.mp4, .mov, .wmv, .avi)</Alert>
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={!accept} variant='success' onClick={() => { props.setShow(false); props.setVideos(video); }}>Upload</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Profile;