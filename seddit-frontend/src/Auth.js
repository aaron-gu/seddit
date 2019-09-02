import React from 'react';
import {Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';
import { getRequest, postRequest } from './requests';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            errorMsg: "",
            toFeed: false
        };
    }
    
    validateForm(){
        return this.state.username.length > 0 && this.state.password.length > 0;
    }
    
    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleSubmit = async event => {
        event.preventDefault();
        postRequest('login/', {
            "username": this.state.username,
            "password": this.state.password
        }).then((myJson) => {
            if(myJson['status'] === "OK"){                
                this.props.onLogin(this.state.username);

                Cookies.set('user', this.state.username);
                Cookies.set('auth_token', myJson['auth_token']);

                this.setState({toFeed: true});
            }
            else{
                console.log(myJson['error']);
                this.setState({
                    password: "",
                    errorMsg: myJson['error']
                })
            }
        });
    }

    render(){
        if(this.state.toFeed === true){
            return <Redirect to="/feed/" />; // when using render with react router, you can use Redirect
        }
        return(
            <div className="row">
                <div className="col-sm-3 mx-auto">
                    <h1 id="auth-header" className="my-4">Login</h1>
                    <div className="errorMsg">{this.state.errorMsg}</div>
                    <form onSubmit={this.handleSubmit}>
                        <label><b>Username</b></label><br />
                        <input type="text" name="username" className="mb-2" value={this.state.username} onChange={this.handleChange} required autoFocus />
                        <br />
                        <label><b>Password</b></label><br />
                        <input type="password" name="password" className="mb-2" value={this.state.password} onChange={this.handleChange} required />
                        <br />
                        <input className="btn btn-primary btn-block" type="submit" disabled={!this.validateForm()} value="Login" />
                    </form>
                </div>
            </div>
        );
    }
}

class Logout extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        postRequest('logout/', {
            "user": Cookies.get('user')
        });
        this.props.onLogout(""); // reset username
        Cookies.remove('user');
        return <Redirect to="/login/" />;
    }
}



class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            errorMsg: "",
            toFeed: false
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    validateForm(){
        if(this.state.username.length > 0 && this.state.password.length > 0 && this.state.password === this.state.confirmPassword)
            return true;
        if(this.state.username.length === 0 || this.state.password.length === 0 || this.state.confirmPassword === 0){
            this.setState({errorMsg: "All fields not filled out"});
        } else if(this.state.password !== this.state.confirmPassword){
            this.setState({errorMsg: "Passwords do not match"});
        } else if(this.state.password === this.state.confirmPassword){
            this.setState({errorMsg: ""});
        }
        return false;
    }
    
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        if(!this.validateForm()) return;

        postRequest('register/', {
            "username": this.state.username,
            "password": this.state.password
        }).then((response) => {
            if(response['status'] === "OK"){
                this.props.onRegister(this.state.username);
                Cookies.set('user', this.state.username);
                // this.props.history.push("/feed/");
                this.setState({toFeed: true});
            }
            else{
                console.log(response['error']);
                this.setState({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    errorMsg: response['error']
                })
            }
        });
    }

    render(){
        if(this.state.toFeed === true){
            return <Redirect to="/feed/" />; // when using render with react router, you can use Redirect
        }
        return(
            <div className="row">
                <div className=" col-sm-3 mx-auto">
                <h1 id="auth-header" className="my-4">Register</h1>
                <p className="errorMsg">{this.state.errorMsg}</p>
                <form onSubmit={this.handleSubmit}>
                    <label><b>Username</b></label><br />
                    <input type="text" name="username" className="mb-2" value={this.state.username} onChange={this.handleChange} required autoFocus />
                    <br />
                    <label><b>Password</b></label><br />
                    <input type="password" name="password" className="mb-2" value={this.state.password} onChange={this.handleChange} required />
                    <br />
                    <label><b>Confirm Password</b></label><br />
                    <input type="password" name="confirmPassword" className="mb-2" value={this.state.confirmPassword} onChange={this.handleChange} required />
                    <br />
                    <input className="btn btn-primary btn-block" type="submit" value="Register" />
                </form>
                </div>
            </div>
        );
    }
}

export {Login, Logout, Register};