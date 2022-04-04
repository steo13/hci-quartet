import React from 'react'
import { Navbar, Dropdown, Button } from 'react-bootstrap';
import './customnavbar.css'


const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href='/'
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {/* Render custom icon here*/}
    <img src='images/user.png' title='User tools' height='21' width='21' id='action-img' alt=''/>
    {children}
  </a>
));


function CustomNavbar(props) {


    return (
      <Navbar className='d-flex flex-fill justify-content-center sticky-top' bg='primary'>

          { 
            props.settings === true ? <>
              <p>&nbsp;&nbsp;</p><Button size='sm' onClick={() => props.setProfileSettings(false) } variant="light"><font color='#0d6efd'><i className="bi bi-arrow-left"></i>Back</font></Button>
            </>: ''
          }
          {
            props.profiles && props.profile === false ? <>
              <p>&nbsp;&nbsp;</p><Button size='sm' onClick={() => { props.setProfiles(false); } } variant="light"><font color='#0d6efd'><i className="bi bi-arrow-left"></i>Back</font></Button>
            </> : ''
          }
          {
            props.profile ? <>
              <p>&nbsp;&nbsp;</p><Button size='sm' onClick={() => { props.setProfile(false); props.setProfiles(true) }} variant="light"><font color='#0d6efd'><i className="bi bi-arrow-left"></i>Back</font></Button>
            </> : ''
          }
          {
            props.req_settings ? <>
             <p>&nbsp;&nbsp;</p><Button size='sm' onClick={ () => props.setRequestSettings(false) } variant="light"><font color='#0d6efd'><i className="bi bi-arrow-left"></i>Back</font></Button>
            </> : ''
          }
          <Navbar.Brand className='d-flex flex-fill justify-content-center'>
              { props.settings ? <><img src="/images/logo.png" width={"40px"} height={"40px"} alt="logo" style={{marginRight: "10px"}}/></> :
                props.profiles ? <><img src="/images/logo.png" width={"40px"} height={"40px"} alt="logo" style={{marginRight: "36px"}}/></> : 
                props.profile ? <><img src="/images/logo.png" width={"40px"} height={"40px"} alt="logo" style={{marginRight: "36px"}}/></>:
                props.req_settings ? <><img src="/images/logo.png" width={"40px"} height={"40px"} alt="logo" style={{marginRight: "62px"}}/></> :
                <><img src="/images/logo.png" width={"40px"} height={"40px"} alt="logo" style={{marginLeft: "47px"}}/></>
              }
          </Navbar.Brand>


          {
            props.settings ? <><Button size='sm' onClick={() => { props.setUser()} } variant="light"><font color='#0d6efd'>{'Save'}</font></Button><p>&nbsp;&nbsp;</p></> :
            props.req_settings ? <></> :
            <>
              <Dropdown align='end' drop='down'>
                <Dropdown.Toggle as={CustomToggle} id='dropdown-custom-components'/>
                <Dropdown.Menu style={{boxShadow: "1px 1px grey"}}>
                <Dropdown.Header>Welcome {props.user.username}!</Dropdown.Header>
                <Dropdown.Divider/>
                <Dropdown.Item onClick={() => { props.setProfileSettings(true); }}>Profile settings</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item onClick={() => { props.setRequestSettings(true); }}>Requests {props.requests.filter((r) => r["destination"] === props.user.username).length === 0 ? '' : <div className="circle"><b>&nbsp;&nbsp;{props.requests.filter((r) => r["destination"] === props.user.username).length}&nbsp;&nbsp;</b></div>}</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <p>&nbsp;&nbsp;</p>
            </>
          }
      </Navbar>
    );
}

export default CustomNavbar;