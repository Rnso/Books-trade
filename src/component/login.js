import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as constants from '../../constant.js'
import store from './store'
import axios from 'axios'
import '../app.css'
import Index from '../index'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = { showmsg: false }
        this.LogIn = this.LogIn.bind(this)
    }
    LogIn(e) {
        e.preventDefault()
        let email = this.refs.email.value
        let pwd = this.refs.pwd.value
        axios.post(constants.serverUrl + `/api/login`, { email, pwd })
            .then(res => {
                if (res.data != '') {
                    store.user_id = res.data._id
                    store.user_name = res.data.name
                    store.email = res.data.email 
                    store.city = res.data.city
                    store.country = res.data.country 
                    store.searched_book = ''
                    store.books = []
                    store.sharedbooks = []                    
                    store.LOGOUT = false   
                    sessionStorage.store = JSON.stringify(store)           
                    ReactDOM.render(<Index />,document.getElementById('app'))
                    this.props.history.push('/profile')
                }
                else {
                    this.setState({ showmsg: true })
                }
            })
            .catch(console.error)
    }
    render() {
        const { history } = this.props
        return (
            <div className='container font'><br/>
                    <div className='text-center'>
                        <h2 className='textshadow'>LOG IN</h2><br/><br/>
                    </div>
                    <div className='container form'>
                        <form onSubmit={this.LogIn}>
                            <div className="form-group">
                                <label >EMAIL:</label>
                                <input type="email" className="form-control" ref="email" placeholder='Enter your email'/>
                            </div>
                            <div className="form-group">
                                <label>PASSWORD:</label>
                                <input type="password" className="form-control" ref="pwd" placeholder='Enter your password'/>
                            </div><br />
                            <div className='text-center'>
                                <button type='submit' className="btn btn-warning">LogIn</button>
                            </div>
                        </form><br />
                        {this.state.showmsg ? <div className='alert alert-danger'>Enter the corect details</div> : ''}
                    </div>
            </div>
        )
    }
}
export default Login