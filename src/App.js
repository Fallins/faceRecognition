import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import 'tachyons'

const PARTICLES_PARAM = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    }   
  }
}

const initialState = {
  input: 'https://samples.clarifai.com/face-det.jpg',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  state = initialState

  calcFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col  * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = box => {
    this.setState({box})
  }

  onInputchange = (e) => {
    console.log(e.target.value)
    this.setState({input: e.target.value})
  }

  onButtonSubmit = (e) => {
    this.setState({imageUrl: this.state.input})

    fetch('http://localhost:3485/api/imageUrl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input: this.state.input
      })
    })
    .then(res => res.json())
    .then(res => {
      if(res)
        fetch('http://localhost:3485/api/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
        })
        .then(res => res.json())
        .then(entries => {
          this.setState(Object.assign(this.state.user, {entries}))
        })
        .catch(console.log)
      this.displayFaceBox(this.calcFaceLocation(res))
    })
    .catch(console.log)
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  loadUser = (user) => {
    const {id, name, email, entries, joined} = user
    this.setState({
      user: {id, name, email, entries, joined }
    })
  }

  render() {
    const { isSignedIn, imageUrl, route, box, user } = this.state
    return (
      <div className="App">
        <Particles params={PARTICLES_PARAM} className="particles"/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/> 
        {
          route === 'home' ? 
          (
            <div>
              <Logo />
              <Rank name={user.name} entries={user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputchange} 
                onButtonSubmit={this.onButtonSubmit}/> 
              <FaceRecognition 
                imageUrl={imageUrl}
                box={box}/>
            </div>
          ) : (
            route === 'signin' ? 
            <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> :
            <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> 
          )
        }
        
      </div>
    );
  }
}

export default App;