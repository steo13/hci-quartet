import { useState, useEffect} from 'react'
import { Toast, ToastContainer, Modal, Card, ListGroup, ListGroupItem, Form, Image, Badge, Accordion, Row, Button, Carousel, Alert, Col } from 'react-bootstrap'
import Contact from '../Contact'
import API from '../../API'
import { FaStar } from 'react-icons/fa'
import Feedback from '../Feedback'
import Loading from '../Loading/Loading.js'
import './user.css';
const moment = require('moment');

function User (props) {
    const [showContact, setShowContact] = useState(false)
    const [showFeedback, setShowFeedback] = useState(false)
    const [user, setUser] = useState(false)
    const [feedbacks, setFeedbacks] = useState([])
    const [alert, setAlert] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [feedback_to_remove, setFeedbackToRemove] = useState(-1)
    const [sendReq, setSendReq] = useState(false)

    const updateOpinions = (opinion) => {
        //let date = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
        const feedback = {user: props.mainUser.username, picture: props.mainUser.picture, date: moment(new Date()), comment: opinion}
        API.postFeedback(feedback, user.username).then((resp) => setAlert(true))
    }

    const sendRequest = () => {
        API.postRequest(props.mainUser.username, props.user).then(() => {
            setSendReq(true)
            API.getAllRequests(props.mainUser.username).then(r => props.setRequests(r));
        })
    }

    const removeFeedback = (id) => {
       API.removeFeedbackbyId(id).then(() => {
           setAlert(!alert)
           setConfirm(false)
       })
    }

    useEffect(() => {
        const getUser = (username) => {
            API.getUser(username).then(u => setUser(u))
        }
        if (!user)
            getUser(props.user)
    }, [user, props.user])

    useEffect(() => {
        const getAllFeedbacks = (username) => {
            API.getAllFeedbacks(username).then(f => setFeedbacks(f))
        }
        if (feedbacks.length === 0)
            getAllFeedbacks(props.user)
    }, [feedbacks.length, props.user])

    useEffect(() => {
        const getAllFeedbacks = (username) => {
            API.getAllFeedbacks(username).then(f => setFeedbacks(f))
        }
        if (alert)
            getAllFeedbacks(props.user)
    }, [alert, props.user])

    return (<>
        { window.scrollTo(0, 0) }
        { props.instruments.length === 0 || props.genres.length === 0 || !user ? <Loading type={'cylon'} color={'#0275d8'} /> : <>
        <Card>
                          
            <Card.Header>
                    <Card.Title className='mt-2'><i className="bi bi-person-circle"></i><b>{user.name} {user.surname}</b></Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">@{user.username}</Card.Subtitle>
            </Card.Header>

            <Card.Body>
                
                <Card.Text className="text-dark"><i className="bi bi-geo-alt-fill" style={{color: '#d9534f'}}></i>{user.city.city}</Card.Text>
                
                <Card.Text>
                    {
                        user.instruments.map(i => (<>
                            <Badge pill bg='info'><Image src={props.instruments.filter(i2 => i2['name'] === i['name'])[0]['icon']} height='12' width='12'/> {i['name']}</Badge><span style={{paddingRight: '2px'}}></span>
                        </>))
                    }
                    {
                        user.genres.map(g => (<>
                            <Badge pill bg='warning' style={{paddingRight: '10px'}}><Image src={props.genres.filter(g2 => g2['name'] === g['name'])[0]['icon']} height='12' width='12'/> {g['name']}</Badge><span style={{paddingRight: '2px'}}></span>
                        </>))
                    }
                </Card.Text>

                <div className='mt-4 d-flex justify-content-center'>
                    <Image alt="profile" className="profile-imagee" thumbnail={true} src={user.picture}></Image>
                </div>

                 <Card.Text className='mt-2 descript-text text-secondary'><i className="bi bi-chat-right-quote-fill"></i>{user.description}</Card.Text>
                 
            </Card.Body>

            <ListGroup className="list-group-flush">
                <ListGroupItem>
                        {
                            user.availability ?
                             <Card.Text><i className="bi bi-vinyl-fill"></i>{user.name} is available for:</Card.Text>
                            :
                            <Card.Text className="text-danger"><i className="bi bi-vinyl-fill"></i>{user.name} not available right now.</Card.Text>
                        }
                        {
                            user.availability && user.collaboration['single'] ? <Card.Text className="text-secondary" style={{marginBottom: '0.5rem'}}>Single time collaborations</Card.Text> : ''
                        }
                        {
                            user.availability && user.collaboration['long'] ? <Card.Text className="text-secondary" style={{marginBottom: '0.5rem'}}>Long time collaborations</Card.Text> : ''
                        }
                </ListGroupItem>
                <ListGroupItem>
                    {
                        user.availability ? 
                            <Row>
                                <Card.Text><i className="bi bi-vinyl-fill"></i>Availability hours:</Card.Text>{' '}
                                    { user.hours['morning'] ? <Form.Label className="text-secondary"><i className="bi bi-brightness-high" style={{paddingLeft: '5px', paddingRight: '5px'}}></i>Morning (9am - 13pm)</Form.Label> : '' }
                                    { user.hours['afternoon'] ? <Form.Label className="text-secondary"><i className="bi bi-cloud-sun-fill" style={{paddingLeft: '5px', paddingRight: '5px'}}></i>Afternoon (15pm - 19pm)</Form.Label> : '' }
                                    { user.hours['evening'] ? <Form.Label className="text-secondary"><i className="bi bi-moon" style={{paddingLeft: '5px', paddingRight: '5px'}}></i>Evening (20pm - 24pm)</Form.Label> : '' }
                            </Row>
                        : 
                        <></>
                    }
                </ListGroupItem>
            </ListGroup>

            <Card.Footer></Card.Footer> 
            
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Skills level</Accordion.Header>
                    <Accordion.Body>
                        <div>
                            {
                                user.instruments.map(i => (<>
                                <div>
                                    <Image src={props.instruments.filter(i2 => i2['name'] === i['name'])[0]['icon']}/>{' '}
                                    <Form.Label className="text-secondary">{i['name']}:</Form.Label>{' '}
                                    {[...Array(5)].map((star, cont) => {
                                        const ratingValue = cont + 1;
                                        return (
                                            <label>
                                                <FaStar className='star' color={ratingValue <= i['rating'] ? '#ffc107' : 'e4e5e9'} ratingsize={20}/>
                                            </label>
                                    )})}
                                </div>
                                </>))
                            }
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>Video performances</Accordion.Header>
                    <Accordion.Body>
                        { user.videos.length !== 0 ?
                            <Carousel className='mt-2' variant='dark' indicators={false} interval={null}>
                                { user.videos.map((v,index) => { return (
                                    <Carousel.Item key={'video'+index}>
                                    <div className='d-flex flex-fill justify-content-center'>
                                        <video style={{width:'80%'}} controls>
                                            <source src={v['link']} type="video/mp4"></source>
                                        </video>
                                    </div>
                                    </Carousel.Item>
                                )})}
                            </Carousel> : <Alert variant='info' align='center'>There aren't video performances for this user</Alert>
                        }
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>Feedback</Accordion.Header>
                    <Accordion.Body>

                        <div align="center">
                            {
                                props.collabs.some(c => c.user1 === props.user || c.user2 === props.user) && props.user !== props.mainUser.username ? <Button size='md' variant='outline-primary' onClick={() => setShowFeedback(true)}>Give your Feedback</Button> :
                                props.requests.some(r => r.source === props.mainUser.username && r.destination === props.user) ? <Button size='md' variant='outline-primary' disabled>Request sent</Button> :
                                props.requests.some(r => r.destination === props.mainUser.username && r.source === props.user) && props.user !== props.mainUser.username ? <Button size='md' variant='outline-primary' disabled>Pendent request</Button> :
                                props.user !== props.mainUser.username ? <Button size='md' variant='outline-primary' onClick={() => sendRequest()}>Send Request for feedback</Button> : ''
                            }
                        </div>
                       
                        { feedbacks.length !== 0 ?
                            feedbacks.map(f => (<>
                                <Card className='mt-2'>
                                    <Card.Header>
                                        <Image className="feedback-image" thumbnail={true} src={f.picture}/>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Text><font className="feedback-username">@{f.user}: </font>{f.comment}</Card.Text>
                                        <hr style={{color: 'white'}}></hr>
                                        <Row>
                                            <Col xs={6}><Card.Text className="text-secondary blockquote-footer" style={{textAlign: 'left'}}><i className="bi bi-calendar2-week"></i><font size='3'>{moment(f.date).format("DD/MM/YYYY")}</font></Card.Text></Col>
                                            <Col xs={6}></Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer style={{textAlign: 'right'}} >
                                    {
                                        f.user === props.mainUser.username ?
                                        <Button id={f.id} variant={'danger'} size={'sm'} onClick={(e) => { setFeedbackToRemove(e.target.id); setConfirm(true) }}><i className="bi bi-trash"></i>remove</Button>
                                        : <></>
                                    }
                                    </Card.Footer>
                                </Card>
                                <hr style={{color: 'white', backgroundColor: 'white', height: 2}}/>
                            </>)) : <Alert className='mt-2' variant='info' align='center'>There aren't feedbacks for this user</Alert>
                        }
                    
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Card>

        {
            /** Feedback post/remove alert  */
            alert ?
            <ToastContainer className="sticky-top p-3" position={'middle-center'}>
            <Toast show={alert} style={{position: "relative", top: window.scrollY, right: "0"}} onClose={() => setAlert(false)} role="alert" aria-live="assertive" bg={'light'} delay={3000} autohide>
              <Toast.Header>
                <Image src={props.mainUser.picture} alt="profile_image" height={"30px"} width={"30px"} style={{borderRadius: "50%", marginRight: "5px"}}></Image>
                <strong className="me-auto">Quartet</strong>
                <small>{new Date().toLocaleString('it-IT', {'month': '2-digit', 'day': '2-digit'})}</small>
              </Toast.Header>
              <Toast.Body><i className="bi bi-check-lg check-icon text-success"></i>Feedbacks updated.</Toast.Body>
            </Toast>
          </ToastContainer> : ''
        }

        {
             /** Confirm remove feedback modal */
            confirm?
            <>
               <Modal show={confirm} centered onHide={() => {setConfirm(false); setFeedbackToRemove(-1)}}>
               <Modal.Header closeButton>
                 <Modal.Title>Remove feedback</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                 <p><b>Are you sure?</b></p>This feedback to @{props.user} will be removed.
               </Modal.Body>
               <Modal.Footer>
                    <Button className="remove-button" variant="danger" onClick={() => { removeFeedback(feedback_to_remove); }}><i className="bi bi-x-circle"></i>Yes, remove</Button>
               </Modal.Footer>
             </Modal>
            </> : <></>
        }

        {
            /** Send req */
            sendReq ?
            <ToastContainer className="sticky-top p-3" position={'middle-center'}>
            <Toast show={sendReq} style={{position: "relative", top: window.scrollY, right: "0"}} onClose={() => setSendReq(false)} role="alert" aria-live="assertive" bg={'light'} delay={3000} autohide>
              <Toast.Header>
                <Image src={props.mainUser.picture} alt="profile_image" height={"30px"} width={"30px"} style={{borderRadius: "50%", marginRight: "5px"}}></Image>
                <strong className="me-auto">Quartet</strong>
                <small>{new Date().toLocaleString('it-IT', {'month': '2-digit', 'day': '2-digit'})}</small>
              </Toast.Header>
              <Toast.Body><i className="bi bi-check-lg check-icon text-success"></i>Request sent to @{props.user}.</Toast.Body>
            </Toast>
          </ToastContainer> : ''
        }

        <br></br><br></br><br></br>
        
        {
            showContact ? <Contact user={user} show={showContact} setShow={(value) => setShowContact(value)} socials={props.socials} /> : ''
        }

        {
            showFeedback ? <Feedback user={user} show={showFeedback} setShow={(value) => setShowFeedback(value)} addOpinion={(value) => updateOpinions(value)}/> : ''
        }

        <div className="footer d-grid">
            <Button size='md' disabled={props.user === props.mainUser.username} className="contact-button" variant='success' onClick={() => setShowContact(true)}><i className="bi bi-arrow-right-circle"></i>Contact</Button>
        </div>
        
    </>}</>)
}

export default User