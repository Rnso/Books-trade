import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import * as constants from '../../constant.js'
import axios from 'axios'
import '../app.css'
import img from '../img/book_logo.jpeg'
import store from './store'


class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const menu = (store.LOGOUT === true) ? [
            { link: '/about', menu: 'ABOUT' },
            { link: '/library', menu: 'LIBRARY' }
        ] : [
                { link: '/about', menu: 'ABOUT' },
                { link: '/library', menu: 'LIBRARY' },
                { link: '/profile', menu: 'PROFILE' }
            ]
        return (
            <div>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <Link className="navbar-brand" to="/"><img height='35px' src={img} /></Link>
                        </div>
                        <div className="collapse navbar-collapse" id="myNavbar">
                            <ul className="nav navbar-nav navbar-right">
                                {menu.map((item, i) => {
                                    return <li key={i}><Link to={item.link}>{item.menu}</Link></li>
                                })}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}
export default Menu