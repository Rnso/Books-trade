import React, { Component } from 'react'
//import ReactDOM from 'react-dom'
import { Link, Redirect } from 'react-router-dom'
import * as constants from '../../constant.js'
import axios from 'axios'
import '../app.css'
import img from '../img/books.jpeg'
import store from './store'


class About extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.state.logout = store.LOGOUT
        this.signUp = this.signUp.bind(this)
        this.logIn = this.logIn.bind(this)
        this.logOut = this.logOut.bind(this)
    }
    signUp() {
        store.LOGOUT = true
        localStorage.store = JSON.stringify(store)
        this.props.history.push('/register')
    }
    logIn() {
        this.props.history.push('/login')
    }
    logOut() {
        store.LOGOUT = true
        this.setState({ logout: store.LOGOUT })
        store.user_id = ''
        store.user_name = ''
        store.city = ''
        store.country = ''
        store.email = ''
        localStorage.store = JSON.stringify(store)
        this.props.history.push('/about')
    }
    render() {
        const { history } = this.props
        return (
            <div className='container text-center'><br />
                <img src={img} alt='books' /><br />
                <h2 className='textshadow'>ABOUT</h2><br /><br />
                <div className='about'>
                    <p>This is a platform where you can trade books.</p>
                    <p>You can check out the library for the list of books available</p>
                    <p>In order to start trading books, you will need to sign up for an account first</p>
                    <p>You can then add books to library or request for trading books available in the library</p><br /><br />
                    <Link to='/library'><button className='btn btn-warning'>GO TO LIBRARY</button></Link>&nbsp;&nbsp;&nbsp;<span className='span'>or</span>&nbsp;&nbsp;&nbsp;
                    {this.state.logout ? <span>
                        <button className='btn btn-warning' onClick={this.signUp}>SIGN UP</button>&nbsp;&nbsp;&nbsp;<span className='span'>or</span>&nbsp;&nbsp;&nbsp;
                        <button className='btn btn-warning' onClick={this.logIn}>LOG IN</button>
                    </span> :
                        <button className='btn btn-warning' onClick={this.logOut}>LOG OUT</button>}
                </div><br /><br />
            </div>
        )
    }
}
export default About