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
        this.signUp = this.signUp.bind(this)
        this.logIn = this.logIn.bind(this)
        this.state.logout = store.LOGOUT
        this.logOut = this.logOut.bind(this)
    }
    signUp() {
        store.LOGOUT = true
        sessionStorage.store = JSON.stringify(store)
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
        sessionStorage.removeItem('store')
        this.props.history.push('/')
    }
    render() {
        const { history } = this.props
        return (
            <div>
                {!this.state.logout &&
                    <div className='logout'>
                        <h5 className='editprofile'>Log out<span>&nbsp;&nbsp;<a href=''><i className="fa fa-sign-out" onClick={this.logOut}></i></a></span></h5>
                    </div>
                }
                <div className='container text-center'><br />
                    <img src={img} alt='books' /><br />
                    <h2 className='textshadow'>ABOUT</h2><br /><br />
                    <div className='about'>
                        <p className='about-text'>This is a platform where you can trade books.
                        You can check out the library for the list of books available
                        In order to start trading books, you will need to sign up for an account first
                    You can then add books to library or request for trading books available in the library</p><br /><br />
                        {/*<div className='col-md-4'>
                            <Link to='/library'><button className='btn btn-warning'>GO TO LIBRARY</button></Link>
            </div><br />*/}
                        {this.state.logout && <span>
                            <div className='col-md-12 text-center'>
                                <button className='btn btn-warning' style={{margin: '0 15px'}} onClick={this.signUp}>SIGN UP</button>
                                <button className='btn btn-warning' onClick={this.logIn}>LOG IN</button>
                            </div><br />
                        </span>}

                    </div><br /><br />
                </div>
            </div>
        )
    }
}
export default About