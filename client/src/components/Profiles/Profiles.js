import { Card, Badge, ListGroup, ListGroupItem, CardGroup, Row, Col, Image, Button } from "react-bootstrap"
import { getDistanceFromLatLonInKm } from '../HomePage/HomePage'
import { Fragment, useState } from 'react'

import User from "../User/User";
import Loading from '../Loading/Loading.js'
import "./profiles.css"

function Profiles (props) {
    const [showUser, setShowUser] = useState(false)
    const [onlyName, ] = useState(props.filters.onlyName)

    return (<>
        
    { props.instruments.length === 0 || props.genres.length === 0 ? <Loading type={'cylon'} color={'#0275d8'} />  :
        
    <Fragment key='1'>
        { !showUser || !props.profile ? <>
            <Card className="card border-light mb-3">
                <Card.Header className="card-header"><i className="bi bi-list-ul"></i>Summary:</Card.Header>
                {
                    !onlyName ?
                    <Card.Text className="card-container">
                        <Badge pill bg='success'>{props.filters['city']} (+{props.filters['range']})</Badge>
                        { props.filters['name'] ? <Badge pill bg='success'>{props.filters['name']}</Badge> : '' }
                        <Badge pill bg='success'>{ props.filters['goal'] ? props.filters['goal'].long ? 'Long time collaboration' : '' : ''}</Badge>
                        <Badge pill bg='success'>{ props.filters['goal'] ? props.filters['goal'].single ? 'Single time collaboration' : '' : ''}</Badge>
                        <Badge pill bg='success'>{ props.filters['hours'] ? props.filters['hours'].morning ? 'Morning (9am-13pm)' : '' : ''}</Badge>
                        <Badge pill bg='success'>{ props.filters['hours'] ? props.filters['hours'].afternoon ? 'Afternoon (15pm-19pm)' : '' : ''}</Badge>
                        <Badge pill bg='success'>{ props.filters['hours'] ? props.filters['hours'].evening ? 'Evening (20am-24pm)' : '' : ''}</Badge>
                        {
                            props.filters['instruments'] ? <>
                                {
                                    props.filters['instruments'].map(i => (
                                        <Badge pill bg='primary'>{i}</Badge>
                                    ))
                                }
                            </> : ''
                        }
                        {
                            props.filters['genres'] ? <>
                                {
                                    props.filters['genres'].map((g, index) => (
                                        <Badge key={index} pill bg='warning'>{g}</Badge>
                                    ))
                                }
                            </> : ''
                        }
                    </Card.Text> :
                    <Card.Text className="card-container">
                        <Badge pill bg='success'>{props.filters['name']}</Badge>
                    </Card.Text>
                }
                <Card.Footer className="card-footer">
                    {
                        /*  props.filters['name'] ?
                        Search by name ONLY option 
                        
                        <> <Form.Check checked={onlyName} className='mt-2' label="Search by name only" type='switch' onClick={() => setOnlyName(!onlyName)}/> </> : <></>
                        */
                    }
                </Card.Footer>
            </Card>

            <CardGroup>
                <Card className="card border-light mb-3">
                    <Card.Header className="bg-transparent text-secondary"><i className="bi bi-music-note-list"></i>Musicians matched</Card.Header> 
                </Card>
                
            { !onlyName ? 
                    props.users.map((u, index) => (
                        <Fragment key={index}>
                            {
                                /* User included inside the reaserch list */
                                u.username === props.user.username ?
                                <>
                                    <Card className="card border-danger mb-3">
                                        <Card.Header className="bg-transparent border-danger text-danger"><i className="bi bi-person-check-fill"></i>The research matches also your profile.</Card.Header>
                                        <Card.Footer className="bg-transparent border-danger">
                                            <Button variant="outline-dark" style={{float: 'right'}} onClick={() => { setShowUser(u); props.setProfile(true)}}><i className="bi bi-arrow-right-circle go-forward"></i>View</Button>
                                        </Card.Footer>
                                    </Card>
                                </> : <>

                                <Card className="card border-secondary mb-3">
                                    <Card.Header>
                                        <Card.Title className='mt-2'><i className="bi bi-person-circle"></i><b>{u.name} {u.surname}</b></Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">@{u.username}</Card.Subtitle>
                                    </Card.Header>
                                    <Card.Body className="text-secondary">
                                        <Image src="images/wave.png" className="wave" alt=""></Image>
                                        <Card.Text className="text-dark"><i className="bi bi-geo-alt-fill" style={{color: '#d9534f'}}></i>{u.city.city}{u.city.city === props.filters['city'] ? '' : <font color='#d9534f'>{' '}{getDistanceFromLatLonInKm(props.lat, props.lng, u.city.lat, u.city.lng).toFixed(1)}km from {props.filters['city']}</font>}</Card.Text>
                                        <ListGroup variant="flush">
                                            <ListGroupItem>
                                                <Row> 
                                                    <Col xs={6}>
                                                        <Image thumbnail={true} src={u.picture} />
                                                    </Col>
                                                    <Col xs={6}>
                                                        <small>Availability hours:
                                                            <br></br>
                                                            {
                                                                u.hours['morning'] ? <><i className="bi bi-brightness-high" style={{paddingLeft: '5px', paddingRight: '5px'}}></i><font className="text-secondary">morning </font><br></br></> : ''
                                                            } 
                                                            {
                                                                u.hours['afternoon'] ? <><i className="bi bi-cloud-sun-fill" style={{paddingLeft: '5px', paddingRight: '5px'}}></i><font className="text-secondary">afternoon </font><br></br></> : ''
                                                            }
                                                            {
                                                                u.hours['evening'] ? <><i className="bi bi-moon" style={{paddingLeft: '5px', paddingRight: '5px'}}></i><font className="text-secondary">evening </font></> : ''
                                                            }
                                                        </small>
                                                    </Col>
                                                </Row>
                                            </ListGroupItem>
                                            <ListGroupItem style={{marginTop: '5px'}}>
                                                <div>
                                                {
                                                    u.instruments.map((i,index) => (
                                                    <Fragment key={'i'+index}>
                                                        <Badge pill bg='info'><Image src={props.instruments.filter(i2 => i2['name'] === i['name'])[0]['icon']} height='12' width='12'/> {i['name']}</Badge>
                                                        <span style={{marginRight: '3px'}}></span>
                                                    </Fragment>))
                                                }
                                                {
                                                    u.genres.map((g,index) => (<>
                                                        <Badge key={'g'+index} pill bg='warning'><Image src={props.genres.filter(g2 => g2['name'] === g['name'])[0]['icon']} height='12' width='12'/> {g['name']}</Badge>
                                                        <span style={{marginRight: '3px'}}></span>
                                                    </>))
                                                }
                                                </div>
                                            </ListGroupItem>
                                        </ListGroup>
                                    </Card.Body>
                                    <Card.Footer className="text-danger">
                                        <Button variant="outline-dark" style={{float: 'right'}} onClick={() => { setShowUser(u); props.setProfile(true)}}><i className="bi bi-arrow-right-circle go-forward"></i>View</Button>
                                    </Card.Footer>
                                </Card>
                            </>
                            }
                        </Fragment>
                    )) //map_end
                    : 
                    props.originalUsers.map(u => (
                        <>
                            {   
                                props.filters['name'].match(' ') ?
                                    u.username === props.user.username && (u.name.toLowerCase().match(`^${props.filters['name'].split(' ')[0].toLowerCase()}`) && u.surname.toLowerCase().match(`^${props.filters['name'].split(' ')[1].toLowerCase()}`)) ? <>
                                        <Card className="card border-danger mb-3">
                                            <Card.Header className="bg-transparent border-danger text-danger"><i className="bi bi-person-check-fill"></i>The research matches also your profile.</Card.Header>
                                            <Card.Footer className="bg-transparent border-danger">
                                                <Button variant="outline-dark" style={{float: 'right'}} onClick={() => { setShowUser(u); props.setProfile(true)}}><i className="bi bi-arrow-right-circle go-forward"></i>View</Button>
                                            </Card.Footer>
                                        </Card>
                                    </> :
                                    u.name.toLowerCase().match(`^${props.filters['name'].split(' ')[0].toLowerCase()}`) && u.surname.toLowerCase().match(`^${props.filters['name'].split(' ')[1].toLowerCase()}`) ?
                                    <>
                                        <Card className="card border-secondary mb-3">
                                            <Card.Header>
                                                <Card.Title className='mt-2'><i className="bi bi-person-circle"></i><b>{u.name} {u.surname}</b></Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">@{u.username}</Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body className="text-secondary">
                                                <Image src="images/wave.png" className="wave" alt=""></Image>
                                                <Card.Text className="text-dark"><i className="bi bi-geo-alt-fill" style={{color: '#d9534f'}}></i>{u.city.city}</Card.Text>
                                                <ListGroup variant="flush">
                                                    <ListGroupItem>
                                                        <Row> 
                                                            <Col xs={6}>
                                                                <Image thumbnail={true} src={u.picture} />
                                                            </Col>
                                                            <Col xs={6}>
                                                                <small>Availability hours:
                                                                    <br></br>
                                                                    {
                                                                        u.hours['morning'] ? <><i className="bi bi-brightness-high" style={{paddingLeft: '5px', paddingRight: '5px'}}></i><font className="text-secondary">morning </font><br></br></> : ''
                                                                    } 
                                                                    {
                                                                        u.hours['afternoon'] ? <><i className="bi bi-cloud-sun-fill" style={{paddingLeft: '5px', paddingRight: '5px'}}></i><font className="text-secondary">afternoon </font><br></br></> : ''
                                                                    }
                                                                    {
                                                                        u.hours['evening'] ? <><i className="bi bi-moon" style={{paddingLeft: '5px', paddingRight: '5px'}}></i><font className="text-secondary">evening </font></> : ''
                                                                    }
                                                                </small>
                                                            </Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                    <ListGroupItem style={{marginTop: '5px'}}>
                                                        <div>
                                                        {
                                                            u.instruments.map((i,index) => (
                                                            <Fragment key={'i'+index}>
                                                                <Badge pill bg='info'><Image src={props.instruments.filter(i2 => i2['name'] === i['name'])[0]['icon']} height='12' width='12'/> {i['name']}</Badge>
                                                                <span style={{marginRight: '3px'}}></span>
                                                            </Fragment>))
                                                        }
                                                        {
                                                            u.genres.map((g,index) => (<>
                                                                <Badge key={'g'+index} pill bg='warning'><Image src={props.genres.filter(g2 => g2['name'] === g['name'])[0]['icon']} height='12' width='12'/> {g['name']}</Badge>
                                                                <span style={{marginRight: '3px'}}></span>
                                                            </>))
                                                        }
                                                        </div>
                                                    </ListGroupItem>
                                                    { !u.availability ? <ListGroupItem className="text-danger">User not avaiable for a collaboration right now.</ListGroupItem> : <></>}
                                                </ListGroup>
                                                
                                            </Card.Body>
                                            <Card.Footer className="text-danger">
                                                <Button variant="outline-dark" style={{float: 'right'}} onClick={() => { setShowUser(u); props.setProfile(true)}}><i className="bi bi-arrow-right-circle go-forward"></i>View</Button>
                                        </Card.Footer>
                                        </Card>
                                    </>: '' : ''   
                            }
                            {
                                !props.filters['name'].match(' ') ?
                                u.username === props.user.username && (u.name.toLowerCase().match(`^${props.filters['name'].toLowerCase()}`) || u.surname.toLowerCase().match(`^${props.filters['name'].toLowerCase()}`)) ? <>
                                    <Card className="card border-danger mb-3">
                                        <Card.Header className="bg-transparent border-danger text-danger"><i className="bi bi-person-check-fill"></i>The research matches also your profile.</Card.Header>
                                        <Card.Footer className="bg-transparent border-danger">
                                            <Button variant="outline-dark" style={{float: 'right'}} onClick={() => { setShowUser(u); props.setProfile(true)}}><i className="bi bi-arrow-right-circle go-forward"></i>View</Button>
                                        </Card.Footer>
                                    </Card>
                                </> :
                                u.name.toLowerCase().match(`^${props.filters['name'].toLowerCase()}`) || u.surname.toLowerCase().match(`^${props.filters['name'].toLowerCase()}`) ?
                                <>
                                    <Card className="card border-secondary mb-3">
                                        <Card.Header>
                                            <Card.Title className='mt-2'><i className="bi bi-person-circle"></i><b>{u.name} {u.surname}</b></Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">@{u.username}</Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body className="text-secondary">
                                            <Image src="images/wave.png" className="wave" alt=""></Image>
                                            <Card.Text className="text-dark"><i className="bi bi-geo-alt-fill" style={{color: '#d9534f'}}></i>{u.city.city}</Card.Text>
                                            <ListGroup variant="flush">
                                                <ListGroupItem>
                                                    <Row> 
                                                        <Col xs={6}>
                                                            <Image thumbnail={true} src={u.picture} />
                                                        </Col>
                                                        <Col xs={6}>
                                                            <small>Availability hours:
                                                                <br></br>
                                                                {
                                                                    u.hours['morning'] ? <><i className="bi bi-brightness-high" style={{paddingLeft: '5px', paddingRight: '5px'}}></i><font className="text-secondary">morning </font><br></br></> : ''
                                                                } 
                                                                {
                                                                    u.hours['afternoon'] ? <><i className="bi bi-cloud-sun-fill" style={{paddingLeft: '5px', paddingRight: '5px'}}></i><font className="text-secondary">afternoon </font><br></br></> : ''
                                                                }
                                                                {
                                                                    u.hours['evening'] ? <><i className="bi bi-moon" style={{paddingLeft: '5px', paddingRight: '5px'}}></i><font className="text-secondary">evening </font></> : ''
                                                                }
                                                            </small>
                                                        </Col>
                                                    </Row>
                                                </ListGroupItem>
                                                <ListGroupItem style={{marginTop: '5px'}}>
                                                    <div>
                                                    {
                                                        u.instruments.map((i,index) => (
                                                        <Fragment key={'i'+index}>
                                                            <Badge pill bg='info'><Image src={props.instruments.filter(i2 => i2['name'] === i['name'])[0]['icon']} height='12' width='12'/> {i['name']}</Badge>
                                                            <span style={{marginRight: '3px'}}></span>
                                                        </Fragment>))
                                                    }
                                                    {
                                                        u.genres.map((g,index) => (<>
                                                            <Badge key={'g'+index} pill bg='warning'><Image src={props.genres.filter(g2 => g2['name'] === g['name'])[0]['icon']} height='12' width='12'/> {g['name']}</Badge>
                                                            <span style={{marginRight: '3px'}}></span>
                                                        </>))
                                                    }
                                                    </div>
                                                </ListGroupItem>
                                                { !u.availability ? <ListGroupItem className="text-danger">User not avaiable for a collaboration right now.</ListGroupItem> : <></>}
                                            </ListGroup>
                                            
                                        </Card.Body>
                                        <Card.Footer className="text-danger">
                                            <Button variant="outline-dark" style={{float: 'right'}} onClick={() => { setShowUser(u); props.setProfile(true)}}><i className="bi bi-arrow-right-circle go-forward"></i>View</Button>
                                    </Card.Footer>
                                    </Card>
                                </>: '' : ''   
                            }
                            
                        </>))} </CardGroup>
                        <br></br>
                        {/*<Card className="card border-light mb-3">
                            <Card.Header className="bg-transparent text-secondary"><i className="bi bi-music-note-list" style={{float: 'right'}}></i></Card.Header> 
                        </Card>*/}
                        </>
                        :
                        <User user={showUser.username} instruments={props.instruments} genres={props.genres} socials={props.socials} mainUser={props.user} collabs={props.collabs} requests={props.requests} setRequests={(value) => props.setRequests(value)} />} 
    </Fragment>
    }</>)     
}

export default Profiles