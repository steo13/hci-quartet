import React, { Component } from 'react';
import { Map, Marker, Circle, GoogleApiWrapper } from 'google-maps-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { FormControl, Form, Container } from 'react-bootstrap';
import Loading from './Loading/Loading.js'

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // for google map places autocomplete
      address: `${this.props.city.city}`,
      clicked: false,
      visual: true,
      autocomplete: true, 
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      mapCenter: { lat: parseFloat(this.props.city.lat), lng: parseFloat(this.props.city.lng) },
    };
  }

  handleChange = address => {
    this.setState({autocomplete: true})
    this.setState({visual: false})
    this.setState({ address });
  };
 
  handleSelect = address => {
    this.setState({visual: true})
    this.setState({ address });

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        //console.log('Success', latLng);
        this.props.change({city: address.split(',')[0], lat: latLng.lat, lng: latLng.lng})
        //console.log({city: address.split(',')[0], lat: latLng.lat, lng: latLng.lng})
        // update center state
        this.setState({ mapCenter: latLng });
      })
      .catch(error => console.error('Error', error));
  };
 
  render() {
    return (
      <div id='googleMaps'>
        {
          this.props.showMapFilters ? <>
            <Container className='mt-2'>
              <Form.Label>Musicians around:</Form.Label>
                <PlacesAutocomplete value={this.state.address} onChange={this.handleChange} onSelect={this.handleSelect}
                searchOptions={{types: ['(regions)'], componentRestrictions: {country: "it"}}}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (<>
                <div>
                  <FormControl {...getInputProps({placeholder: 'Search Places ...', className: 'location-search-input' })} 
                               onBlur={() => { this.setState({autocomplete: false}); this.setState({visual: true}); this.setState({address: this.props.city.city})}}/>
                  <div className="autocomplete-dropdown-container">
                    { this.state.autocomplete ? <>
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
              
              <div className='mt-2 d-flex'><h6>Range: <font color='#0d6efd'>{this.props.range} km</font></h6></div>
              <Form.Range defaultValue={this.props.range} onChange={e => this.props.setRange(e.target.value)} step={10} />
            </Container>  
          </> : ''
        }
        {
          this.state.visual ? <>
            <Map style={{position: 'absolute', bottom: `${this.props.showMapFilters ? '343px' : '200px'}`, width: `${window.screen.width - 26}px`}}
                 google={this.props.google} initialCenter={{lat: this.state.mapCenter.lat, lng: this.state.mapCenter.lng }}
                 center={{lat: this.state.mapCenter.lat, lng: this.state.mapCenter.lng}} zoom={9}
                 disableDefaultUI zoomControl={true}>
                {
                  this.props.markers.filter(m => this.state.address !== '' ? m.city === this.state.address.split(',')[0] : m.city === this.props.city.city).length === 0 ?
                  <Marker position={{lat: this.state.mapCenter.lat, lng: this.state.mapCenter.lng}} label={'0'} opacity={0.8}/>: '' 
                }
                {
                  this.props.markers.map((m, index) => (
                    <Marker key={index}
                          position={{lat: m.lat, lng: m.lng}} 
                          onClick={() => { this.setState({ mapCenter: {lat: m.lat, lng: m.lng}}); this.props.change(m); this.setState({address: m.city})}} 
                          label={`${m.musicians}`}
                          opacity={this.props.city.city === m.city ? 1.0 : 0.4 }/>
                  ))
                }
                  <Circle center={{lat: this.state.mapCenter.lat,lng: this.state.mapCenter.lng}}
                          radius={this.props.range * 1000} fillColor='#0d6efd' strokeColor='#0d6efd' fillOpacity={0.2}></Circle>
            </Map>
          </> : ''
        }
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCULQ7FWn4zKpjHB_KEypXZQHk2P6c0Ba0')
})(MapContainer)