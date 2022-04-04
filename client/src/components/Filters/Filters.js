import { useEffect, useState } from 'react'
import { Form, ToggleButton, Image, Button, Alert, Spinner } from "react-bootstrap"
import Loading from '../Loading/Loading.js'
import ModalInfo from './ModalInfo.js'
import './filters.css';

function Filters (props) {
    const [users, ] = useState(props.users)
    const [filterUsers, setFilterUsers] = useState([])
    const [nameSurname, setNameSurname] = useState('')
    const [hours, setHours] = useState({morning: false, afternoon: false, evening: false})
    const [collaborationGoal, setCollaborationGoal] = useState({single: false, long: false})
    const [instrumentsSelected, setInstrumentsSelected] = useState([])
    const [genresSelected, setGenresSelected] = useState([])
    const [showModal, setShowModal] = useState({visible: false, information: ''})
    const [onlyName, setOnlyName] = useState(false)
    const [spinner, setSpinner] = useState(true);


    /**
     * Function for calling the info modal
     */
    const handleInfoModal = (info) => {
        if(info)
            setShowModal({visible: !showModal.visible, information: info})
        else
            setShowModal({visible: !showModal.visible, information: ''})
    }


    const updateInstruments = (ins) => {
        let newInstruments = [...instrumentsSelected]
        if (newInstruments){
            if (newInstruments.filter(i => i === ins).length === 1){
                newInstruments = newInstruments.filter(i => i !== ins)
            } else
                newInstruments.push(ins)
            setInstrumentsSelected(newInstruments)
        }
    }

    const updateGenres = (genre) => {
        let newGenres = [...genresSelected]
        if (newGenres){
            if (newGenres.filter(g => g === genre).length === 1){
                newGenres = newGenres.filter(g => g !== genre)
            } else
                newGenres.push(genre)
            setGenresSelected(newGenres)
        }
    }

    const updateCollaboration = (value) => {
        let newCollaborationGoal = {...collaborationGoal}
        newCollaborationGoal[value] = !newCollaborationGoal[value]
        setCollaborationGoal(newCollaborationGoal)
    }

    const updateHours = (value) => {
        let newHours = {...hours}
        newHours[value] = !newHours[value]
        setHours(newHours)
    }

    useEffect(() => {
        let newUsers = [...users]

        if (nameSurname)
            newUsers = users.filter(u => u.name.toLowerCase().match(`^${nameSurname.toLowerCase()}`) || u.surname.toLowerCase().match(`^${nameSurname.toLowerCase()}`))

        if (hours) 
            if (hours['morning'] === false && hours['afternoon'] === false && hours['evening'] === false)
                newUsers = [...newUsers]
            else 
                newUsers = newUsers.filter(u => 
                    hours['morning'] ? u.hours['morning'] === hours['morning'] : '' || 
                    hours['afternoon'] ? u.hours['afternoon'] === hours['afternoon'] : '' ||
                    hours['evening'] ? u.hours['evening'] === hours['evening'] : '')

        if (collaborationGoal)
            if (collaborationGoal['single'] === false && collaborationGoal['long'] === false)
                newUsers = [...newUsers]
            else
                newUsers = newUsers.filter(u => u.collaboration['single'] === collaborationGoal['single'] || u.collaboration['long'] === collaborationGoal['long'])
        
        if (instrumentsSelected.length !== 0)
            newUsers = newUsers.filter(u => u.instruments.some(i => instrumentsSelected.includes(i['name'])))
        
        if (genresSelected.length !== 0)
            newUsers = newUsers.filter(u => u.genres.some(g => genresSelected.includes(g['name'])))
                    
        setFilterUsers(newUsers)

    }, [users, nameSurname, hours, collaborationGoal, instrumentsSelected, genresSelected])

    
    useEffect(() => {
        if(onlyName && nameSurname.length !== 0){
            // spinner effect
            if(spinner) setTimeout(() => { setSpinner(!spinner);}, 3000);
            // update musicians among all the users
            let newOriginalUsers = [...props.originalUsers]
            newOriginalUsers = newOriginalUsers.filter(u => u.name.toLowerCase().match(`^${nameSurname.toLowerCase()}`) || u.surname.toLowerCase().match(`^${nameSurname.toLowerCase()}`))
            setFilterUsers(newOriginalUsers)
        }
    }, [props.originalUsers, nameSurname, onlyName, spinner])


    return (<>
        { props.instruments.length === 0 || props.genres.length === 0 ? <Loading type={'cylon'} color={'#0275d8'} /> : <>
        
        <Form.Label className="Form-Label">
            <Image alt="question" src="/images/svg/question.svg" className='Question-logo' onClick={() => handleInfoModal('Search by name')}/>
            Search by name:
        </Form.Label>
        <Form.Control placeholder='Name Surname' onChange={(e) => {setNameSurname(e.target.value); setSpinner(!spinner)} }></Form.Control>
        <Form.Check checked={onlyName} className='mt-2' label="Search by name only" type='switch' onClick={() => setOnlyName(!onlyName)} readOnly></Form.Check>
        {
           //nameSurname.length !== 0 && filterUsers.length === 0 ?
           onlyName ?
           nameSurname.length !== 0 ?
           spinner ?
           <Alert className="mt-3" variant={"warning"} style={{align: "center"}}><Spinner animation="grow" size="sm" variant="warning" style={{marginRight: '8px'}}></Spinner><small>Scanning among all the musicians...</small></Alert> :
           <Alert className="mt-3" variant={"warning"} style={{align: "center"}}><small>Scanned among all the musicians.</small></Alert> :
           <Alert className="mt-3" variant={"warning"} style={{align: "center"}}><small>Please, insert a name first.</small></Alert> : ''
        }
        
        <hr style={{color: 'white', backgroundColor: 'white', height: 2}}/>
        
        <Form.Label className="Form-Label">
            <Image key={'f1'} alt="question" src="/images/svg/question.svg" className='Question-logo' onClick={() => handleInfoModal('Instruments')}/>
            Instruments you need:
        </Form.Label>
        <div align='center'>
            {
                props.instruments.map((i,index) =>( <>
                    <ToggleButton className='mt-2 toggleBut' key={"toggle-check"+index} type="checkbox" variant="outline-primary" value="1" 
                                checked={instrumentsSelected.filter(i2 => i2 === i['name']).length === 1 ? true : false} 
                                disabled={onlyName}
                                onClick={() => updateInstruments(i['name'])} onChange={() => {}}>
                        <Image src={i['icon']} alt=''/> {i['name']}
                    </ToggleButton>{' '}
                </>))
            }
        </div>

        <hr style={{color: 'white', backgroundColor: 'white', height: 2}}/>

        <Form.Label className="Form-Label">
            <Image alt="question" src="/images/svg/question.svg" className='Question-logo' onClick={() => handleInfoModal('Availability hours')}/>
            Availability hours:
        </Form.Label>
        <div>
          <Form.Check checked={hours['morning']} inline label='Morning (9am - 13pm)' type='checkbox' disabled={onlyName} onClick={() => updateHours('morning')} onChange={() => {}}></Form.Check><i className="bi bi-brightness-high" style={{paddingLeft: '24px', paddingRight: '5px'}}></i>
          <Form.Check checked={hours['afternoon']} inline label='Afternoon (15pm - 19pm)' type='checkbox' disabled={onlyName} onClick={() => updateHours('afternoon')} onChange={() => {}}></Form.Check><i className="bi bi-cloud-sun-fill" style={{paddingLeft: '5px', paddingRight: '5px'}}></i>
          <Form.Check checked={hours['evening']} inline label='Evening (20pm - 24pm)' type='checkbox' disabled={onlyName} onClick={() => updateHours('evening')} onChange={() => {}}></Form.Check><i className="bi bi-moon" style={{paddingLeft: '17px', paddingRight: '5px'}}></i>
        </div>

        <hr style={{color: 'white', backgroundColor: 'white', height: 2}}/>
        
        <Form.Label className="Form-Label">
            <Image alt="question" src="/images/svg/question.svg" className='Question-logo' onClick={() => handleInfoModal('Musical genres')}/>
            Musical genres:
        </Form.Label>
        <div align='center'>
            {
                props.genres.map((g, index) =>( <>
                    <ToggleButton className='mt-2 toggleBut' key={"toggle-check"+index+"-2"} type="checkbox" variant="outline-primary" value="1" 
                                checked={genresSelected.filter(g2 => g2 === g['name']).length === 1 ? true : false} 
                                disabled={onlyName}
                                onClick={() => { updateGenres(g['name'])}} onChange={() => {}}>
                        <Image src={g['icon']} alt='' width='24px' height='24px'/> {g['name']}
                    </ToggleButton>{' '}
                </>))
            }
        </div>

        <hr style={{color: 'white', backgroundColor: 'white', height: 2}}/>
        
        <Form.Label className="Form-Label">
            <Image alt="question" src="/images/svg/question.svg" className='Question-logo' onClick={() => handleInfoModal('Collaboration goal')}/>
            Collaboration goal:
        </Form.Label>
        <div>
          <Form.Check checked={collaborationGoal['single']} inline label='Single time collaboration' type='checkbox' disabled={onlyName} onClick={() => updateCollaboration('single')} onChange={() => {}}></Form.Check>
          <Form.Check checked={collaborationGoal['long']}  inline label='Long time collaboration' type='checkbox' disabled={onlyName} onClick={() => updateCollaboration('long')} onChange={() => {}}></Form.Check>
        </div>

        <hr style={{color: 'white', backgroundColor: 'white', height: 2}}/>

        <div className='d-grid mt-2' style={{position: 'relative', width: `${window.screen.width - 26}px`}}>
            <Button onClick={() => { props.showProfiles(); props.setNewProfiles(filterUsers); 
                                     props.setFilters({city: props.city, range: `${props.range}km`, name: nameSurname, hours: hours, goal: collaborationGoal, instruments: instrumentsSelected, genres: genresSelected, onlyName: onlyName})}} 
                    disabled={filterUsers.length === 0} size='lg'>Show results {filterUsers.length!==0 ? '('+filterUsers.length+')' : ''}
            </Button>
        </div>

        <ModalInfo showModal={showModal} handleInfoModal={handleInfoModal} />

    </>}</>)
}

export default Filters