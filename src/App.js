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
  input: '',
  imageUrl: '',
  boxes: [],
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
    let clarifaiFaces = []
    const image = document.getElementById('inputImage')
    const width = Number(image.width)
    const height = Number(image.height)

    if(data) {
      data.outputs[0].data.regions.forEach(region => {
        const boundingBox = region.region_info.bounding_box
        clarifaiFaces.push({
          leftCol: boundingBox.left_col * width,
          topRow: boundingBox.top_row * height,
          rightCol: width - (boundingBox.right_col  * width),
          bottomRow: height - (boundingBox.bottom_row * height)
        })
      })
      //data.outputs[0].data.regions[0].region_info.bounding_box
    }

     
    console.log(clarifaiFaces)
    return clarifaiFaces
  }

  displayFaceBox = boxes => {
    console.log({boxes})
    this.setState({boxes})
  }

  onInputchange = (e) => {
    console.log(e.target.value)
    this.setState({input: e.target.value})
  }

  onButtonSubmit = () => {
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

  randomImgForDEV = () => {
    const imgs = [
      "https://d2eib6r9tuf5y8.cloudfront.net/l/assets/img/article/article-1833-aylollyd/keyvisual.jpg",
      "https://cdn.cnn.com/cnnnext/dam/assets/180209142705-20180129-trump-admin-departures-split-a-super-tease.jpg",
      "https://samples.clarifai.com/face-det.jpg"
    ]

    const rImg = imgs[Math.floor(Math.random() * imgs.length)]
    this.setState({input: rImg})
    this.onButtonSubmit()
    
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes, user } = this.state
    return (
      <div className="App">
        <Particles params={PARTICLES_PARAM} className="particles"/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/> 
        {
          route === 'home' ? 
          (
            <div>
              <Logo devClick={this.randomImgForDEV}/>
              <Rank name={user.name} entries={user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputchange} 
                onButtonSubmit={this.onButtonSubmit}/> 
              <FaceRecognition 
                imageUrl={imageUrl}
                boxes={boxes}/>
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