import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js'
import Clarifai from 'clarifai';
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

const app = new Clarifai.App({
  apiKey: 'aceecbb72eaf453faeb5d4112e960d8c'
});

 
class App extends Component {
  state = {
    input: 'https://samples.clarifai.com/face-det.jpg',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false
  }

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

    app.models.predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(res => this.displayFaceBox(this.calcFaceLocation(res)))
      .catch(e => {
        console.log(e)
      })
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state
    return (
      <div className="App">
        <Particles params={PARTICLES_PARAM} className="particles"/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/> 
        {
          route === 'home' ? 
          (
            <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputchange} 
                onButtonSubmit={this.onButtonSubmit}/> 
              <FaceRecognition 
                imageUrl={imageUrl}
                box={box}/>
            </div>
          ) : (
            route === 'signin' ? 
            <Signin onRouteChange={this.onRouteChange}/> :
            <Register onRouteChange={this.onRouteChange}/> 
          )
        }
        
      </div>
    );
  }
}

export default App;

// app.models
// .predict(
// Clarifai.COLOR_MODEL,
//     // URL
//     "https://samples.clarifai.com/metro-north.jpg"
// )
// .then(function(response) {
//     // do something with responseconsole.log(response);
//     },
//     function(err) {// there was an error}
// );