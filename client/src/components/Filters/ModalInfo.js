import React from 'react'
import { Container, Form, Image, Modal, Button } from 'react-bootstrap'
import './filters.css';

class ModalInfo extends React.Component {
  
  render() {
    return (
      <Modal show={this.props.showModal.visible} animation={true} size="lm">
        <Modal.Header>
          <Container>
            <Modal.Title>{this.props.showModal.information}</Modal.Title>
          </Container>
        </Modal.Header>

        <Modal.Body>
          <Container style={{textAlign: 'center'}}>
            
            {
              this.props.showModal.information !== '' ?
                <Image className="Image-Modal" src={`./images/svg/${this.props.showModal.information}.svg`.replaceAll(" ", "_").toLowerCase()} alt="image" />
              : <></>
            }

            {
              // Collaboration goal
              this.props.showModal.information && this.props.showModal.information === "Collaboration goal" ?
              <Form.Label className="Form-Label text-secondary" style={{textAlign: 'left'}}><br></br><p className="text-dark" style={{textAlign:'center'}}>Let's clarify the type of collaboration.</p><b>Short-time collaborations:</b> you need a musician for a single event. Maybe you need to replace someone for an upcoming night, or you are looking for a one-shot collaboration on social media!<br></br><br></br><b>Long-time collaborations:</b> you may want to set up a new band!<br></br>Any selection will include both types.</Form.Label>:<></>
            }

            {
              // Musical genres
              this.props.showModal.information && this.props.showModal.information === "Musical genres" ?
              <Form.Label className="Form-Label text-secondary" style={{textAlign: 'left'}}><br></br><br></br><p className="text-dark" style={{textAlign:'center'}}>What music do they should listen to?</p>Select the musical genres you would like your future partner to like!<br></br>Any selection will include all genres.</Form.Label>:<></>
            }

            {
              // Availability hours
              this.props.showModal.information && this.props.showModal.information === "Availability hours" ?
              <Form.Label className="Form-Label text-secondary" style={{textAlign: 'left'}}><br></br><p className="text-dark" style={{textAlign:'center'}}>Time for rehearses!</p>By selecting one or more ranges of times, you'll include all the musicians who have become available in that time ranges.<br></br>Any selection will include all ranges.</Form.Label>:<></>
            }

            {
              // Instruments
              this.props.showModal.information && this.props.showModal.information === "Instruments" ?
              <Form.Label className="Form-Label text-secondary" style={{textAlign: 'left'}}><br></br><p className="text-dark" style={{textAlign:'center'}}>Select the instruments your mate should be able to play!</p>Note that the reseach is not exclusive: it returns all musicians who at least play one of that instruments.<br></br>Any selection will include all instruments.</Form.Label>:<></>
            }

            {
              // Search by name
              this.props.showModal.information && this.props.showModal.information === "Search by name" ?
              <Form.Label className="Form-Label text-secondary" style={{textAlign: 'left'}}><br></br><p className="text-dark" style={{textAlign:'center'}}>Are you looking for a specific musician?</p>If so, try to search by name.<br></br><br></br><font style={{fontSize: "90%"}} color="#d9534f">Note:</font><font style={{fontSize: "90%"}}> although the reaserch returns <b>zero</b> musicians around you, it will be possible to "serach by name only" so that all the other filters will be excluded (location, availability hours, instruments, genres, collaboration goal).</font></Form.Label>:<></>
            }
            
            {
              // Skill level
              this.props.showModal.information && this.props.showModal.information === "Skill level" ?
              <Form.Label className="Form-Label text-secondary" style={{textAlign: 'left'}}><br></br><p className="text-dark" style={{textAlign:'center'}}>How good do you think you are?</p>Give your own self-evaluation on playing your instruments.<br></br> You can consider five stars as advanced and one star as a perfect beginner.</Form.Label>:<></>
            }
          
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => this.props.handleInfoModal()}>Ok!</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalInfo;
