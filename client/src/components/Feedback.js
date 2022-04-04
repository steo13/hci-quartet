import { Modal, Form, Button } from 'react-bootstrap'
import { useState } from 'react'

function Feedback (props) {
    const [opinion, setOpinion] = useState('')

    return (<>
        <Modal show={props.show} onHide={() => props.setShow(false)} style={{marginTop: '60px'}}>
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-pencil-square"></i>Give your feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div align='center'>
                    <Form.Label>Have you ever played with <b>@{props.user['username']}</b>?</Form.Label>
                    { /*<Image thumbnail={true} src={props.user['picture']} width='100'/> */ }
                </div>         
                <Form.Control as='textarea' placeholder='Write your feedback here.' style={{height: '200px'}} onChange={(e) => setOpinion(e.target.value)}></Form.Control>
                <small className="text-secondary">Post your opinion with min 4 and max 255 chars.</small>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={opinion.length < 4 || opinion.length > 254 } variant='success' onClick={() => { props.addOpinion(opinion); props.setShow(false)}}>Submit</Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default Feedback;