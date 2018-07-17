import React, {Component} from 'react'
import './Register.css'

class Register extends Component {    
    state = {
        email: '',
        password: '',
        name: ''
    }

    onEmailChange = e => {
        this.setState({email: e.target.value})
    }

    onPasswordChange = e => {
        this.setState({password: e.target.value})
    }

    onNameChange = e => {
        this.setState({name: e.target.value})
    }

    onSubmit = () => {
        const {onRouteChange, loadUser} = this.props
        const {email, password, name} = this.state

        fetch('https://amazing-face-detection-api.herokuapp.com/api/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email, password, name
            })
        })
        .then(res => res.json())
        .then(user => {
            console.log(user)
            if(user.id){
                loadUser(user)
                onRouteChange('home')
            }
        })
    }

    render() {
        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <form className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="text" 
                                    name="name"  
                                    id="name"
                                    onChange={this.onNameChange} />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email" 
                                    name="email-address"  
                                    id="email-address" 
                                    onChange={this.onEmailChange}/>
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input 
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    onChange={this.onPasswordChange}/>
                            </div>                    
                        </fieldset>
                        <div className="">
                            <input 
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                type="button" 
                                value="Register" 
                                onClick={this.onSubmit}/>
                        </div>
                    </form>
                </main>
            </article>
        )
    }
}

export default Register