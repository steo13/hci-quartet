import { Fragment } from "react";
import { Form, Modal, Row } from "react-bootstrap";
import Loading from './Loading/Loading.js'

function Contact (props) {
    return (<>
        {props.socials.length === 0 ? <Loading type={'cylon'} color={'#0275d8'} /> : <>
        <Modal show={props.show} onHide={() => props.setShow(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-signal"></i>Contact @{props.user.username}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label className="text-secondary">{props.user.name} is contactable through the following means:</Form.Label>
                {
                    props.user['link'].length === 0 ? 
                        <div>
                            <font color='#dc3545'>{props.user['name']} has no social media.</font>
                        </div> : ''
                }
                {
                    props.user['link'].map((l, index) => (
                    <Fragment key={index}>
                        {
                            l['link'] !== '' ?
                            <>
                                <Row className='mt-3'>
                                    <div>
                                        <i className={props.socials.filter(s => s['name'] === l['name'])[0]['icon']}></i>
                                        <a href={l['link']}><Form.Label>{l['name']}</Form.Label></a>
                                    </div>
                                </Row>
                            </>: ''
                        }
                    </Fragment>))
                }
                <Row className='mt-3'><div><i className="bi bi-envelope"></i><a href={'mailto:'+props.user['email']+"?subject=Quartet collaboration"}>{props.user['email']}</a></div></Row>
            </Modal.Body>
        </Modal>
    </>}</>)
}

export default Contact;