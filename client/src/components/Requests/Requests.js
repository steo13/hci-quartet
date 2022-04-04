import React, { useState } from 'react'
import { Container, Card, ListGroup, ListGroupItem, Button, Col, Row, Modal, Spinner} from 'react-bootstrap'
import disableScroll from 'disable-scroll';
import CustomNavbar from '../CustomNavBar/CustomNavbar';
import API from '../../API';
import Loading from '../Loading/Loading';
import './requests.css'

function Requests(props) {

    const [confirm, setConfirm] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [remove_user, setRemoveUser] = useState("")


    /* post collaboration, remove request from the queue */
    const updateRequests = (value) => {
        setSpinner(true)
        API.postCollaboration(value, props.user.username).then(() => {
            API.getAllCollabs(props.user.username).then(c => props.setCollabs(c)).then(() => {
                API.getAllRequests(props.user.username).then(r => props.setRequests(r))
                .then(() => setSpinner(false))
            })
        })
    }

    /* remove collaboration from the queue */
    const updateCollabs = (value) => {
        API.removeCollaboration(value, props.user.username).then(() => {
            let newCollabs = props.collabs.filter(c => c['user1'] !== value )
            props.setCollabs(newCollabs)
            setRemoveUser("")
            setConfirm(false)
        })
    }
    
    return (<>
      {disableScroll.off()}
      { !props.user ? <Loading type={'cylon'} color={'#0275d8'} /> : <>
      
      <CustomNavbar req_settings={props.req_settings} setRequestSettings={(value) => props.setShowRequestSettings(value)}
                    user={props.user} />

      <Container className='mt-3'>
          <Card>
            <Card.Header>
                <Card.Text className='mt-2 bg-transparent border-primary'>{ spinner ? <Spinner as="span" size="sm" role="status" aria-hidden="true" animation="border" style={{marginRight: '5px'}}></Spinner> : <i className="bi bi-star"></i>}Requests of collaboration</Card.Text>
            </Card.Header>
            <Card.Body>
                <Card.Text className='text-secondary'>Pendent requests: accept the collaboration requests for allowing you and other musicians to write feedbacks each other regarding your common experience.</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                {
                    props.requests.map((r,index) => (<>
                        <ListGroupItem key={index}>
                            <Row>
                                <Col><Card.Text>@{r["source"]}</Card.Text></Col>
                                <Col><Button className="success-button" size={'sm'} variant="success" style={{float: 'right'}} value={r["source"]} onClick={(e) => { updateRequests(e.target.value)}}><i className="bi bi-check-circle"></i>Accept</Button></Col>
                            </Row>
                        </ListGroupItem>
                    </>))
                }
            </ListGroup>
          </Card>
          <br></br>
          <Card>
              <Card.Header>
                <Card.Text className='mt-2 bg-transparent border-primary'><i className="bi bi-star"></i>Sent requests</Card.Text>
              </Card.Header>
              <Card.Body>
                <Card.Text className='text-secondary'>Outgoing requests: your collaboration requests not yet accepted by the recipients.</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    {
                        props.sent_requests.map((r,index) => (<>
                            <ListGroupItem key={'sent'+index}>
                                <Row>
                                    <Col><Card.Text className="text-secondary">Waiting for @{r["destination"]}...</Card.Text></Col>
                                </Row>
                            </ListGroupItem>
                        </>))
                    }
                </ListGroup>
          </Card>
          <br></br>
          <Card>
            <Card.Header>
                <Card.Text className='mt-2'><i className="bi bi-list-stars"></i>Your collaborations</Card.Text>
            </Card.Header>
            <Card.Body>
                <Card.Text className='text-secondary'>Collaborations accepted: you and these musicians can write feedbacks to each other.</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                {
                    props.collabs.map((c,index) => (<>
                        <ListGroupItem key={index}>
                            <Row>
                                <Col><Card.Text>@{c["user1"]}</Card.Text></Col>
                                <Col><Button className="remove-button" variant="danger" size={'sm'} style={{float: 'right'}} value={c["user1"]} onClick={(e) => { setRemoveUser(e.target.value); setConfirm(true) }}><i className="bi bi-x-circle"></i>Remove</Button></Col>
                            </Row>
                        </ListGroupItem>
                    </>))
                }
            </ListGroup>
          </Card>
          <br></br>
          {
            confirm ?
            <>
               <Modal show={confirm} centered onHide={() => {setConfirm(false); setRemoveUser("")}}>
               <Modal.Header closeButton>
                 <Modal.Title>Remove collaboration</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                 <p><b>Are you sure?</b></p>
                 You and @{remove_user} will not be able to write feedbacks to each other anymore.
               </Modal.Body>
               <Modal.Footer>
                    <Button className="remove-button" variant="danger" onClick={() => { updateCollabs(remove_user) }}><i className="bi bi-x-circle"></i>Yes, remove</Button>
               </Modal.Footer>
             </Modal>
            </> : <></>
          }
      </Container>
    </>
    } 
  </>)
}

export default Requests;