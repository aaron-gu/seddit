import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import Feed from './Feed.js';
import {Login, Logout, Register} from './Auth.js';
import {About} from './About.js';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Cookies from 'js-cookie';


class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user: Cookies.get('user'),
            auth_token: ''
        }
        this.handleUserChange = this.handleUserChange.bind(this);
    }
    
    handleUserChange(user){
        this.setState({user: user});
    }

    render(){
        const user = this.state.user;
        const auth_token = this.state.auth_token;


        return (
        <div className="App">

            <Header user={user} />

            <main role="main" className="container">
                <div className="content">
                    <Route path="/" exact component={About} />
                    <Route path="/feed/" render={(props) => <Feed user={user} />} />
                    <Route path="/login/" render={(props) => <Login user={user} onLogin={this.handleUserChange} />} />
                    <Route path="/register/" render={(props) => <Register user={user} onRegister={this.handleUserChange} />} />
                    <Route path="/logout/" render={(props) => <Logout user={user} onLogout={this.handleUserChange} />} />
                </div>
            </main>

            {/* <Footer /> */}

        </div>
        );
    }
}

class Header extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        var leftnav;
        var rightnav;
        if (this.props.user) {
            console.log(this.props.user);
            leftnav = <span className="nav-item navbar-text mx-2">{this.props.user}</span>;
            rightnav = <Link className="nav-item nav-link mx-2" to="/logout/">Logout</Link>;
        } else { // this.props.user !== "" || this.props.user !== 'null' || this.props.user !== 'undefined'
            leftnav = <Link className="nav-item nav-link mx-2" to="/login/">Login</Link>;
            rightnav = <Link className="nav-item nav-link mx-2" to="/register/">Register</Link>;
        } 

        return (
            <header>
            <nav className="navbar navbar-expand-md navbar-light">
                <Link className="navbar-brand" to="/feed/">
                    <img src={process.env.PUBLIC_URL + '/images/megaphone-white.svg'} width="35" height="35" alt="" />
                    <span className="ml-2">Seddit</span>
                </Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarsExampleDefault">
                <div className="navbar-nav">
                    {leftnav}
                    {rightnav}
                </div> 
                </div>
            </nav>
            </header>
        );
    }
}

class Footer extends React.Component{
    render(){
        return(
            <footer className="footer">
                <div className="container">
                    <nav className="navbar navbar-default">
                        <span className="navbar-link"><Link to="/about/">Why Seddit, and why over 500 characters is better</Link></span>
                        <span className="navbar-text text-muted">{String.fromCharCode("0169")} Aaron Gu 2019</span>
                    </nav>
                </div>
            </footer>
        );
    }
}

export default App;
export {Header, Footer};
