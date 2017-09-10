import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as constants from '../../constant.js'
import axios from 'axios'
import '../app.css'
import Index from '../index'

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = { errormsg: false }
        this.submit = this.submit.bind(this)
        this.redirectToLogin = this.redirectToLogin.bind(this)
    }
    submit(e) {
        e.preventDefault()
        let name = this.refs.name.value
        let email = this.refs.email.value
        let pwd = this.refs.pwd.value
        let city = this.refs.city.value
        let country = this.refs.country.value
        let shared_ids = []
        let yourrequest_ids = []
        let otherrequest_ids = []
        if (name !== '' && email !== '' && pwd !== '' && city !== '' && country !== '') {
            axios.post(constants.serverUrl + `/api/register`, { name, email, pwd, city, country, shared_ids, yourrequest_ids, otherrequest_ids })
                .then(res => {
                    this.refs.name.value = ''
                    this.refs.email.value = ''
                    this.refs.pwd.value = ''
                    this.refs.city.value = ''
                    this.refs.country.value = ''
                    $('#myModal').modal('show')
                })
                .catch(console.error)
        }
        else {
            this.setState({ errormsg: true })
        }
    }
    redirectToLogin() {
        ReactDOM.render(<Index />, document.getElementById('app'))
        this.props.history.push('/login')
    }
    render() {
        const { history } = this.props
        return (
            <div className='container font'><br />
                <div className='text-center'>
                    <h2 className='textshadow'>SIGN UP FORM</h2><br /><br />
                </div>
                <div className='container form'>
                    <form onSubmit={this.submit}>
                        <div className="form-group">
                            <label >NAME:</label>
                            <input type="text" className="form-control" ref="name" placeholder='Ex. John Smith' />
                        </div>
                        <div className="form-group">
                            <label >EMAIL:</label>
                            <input type="email" className="form-control" ref="email" placeholder='Ex. john@gmail.com' />
                        </div>
                        <div className="form-group">
                            <label>PASSWORD:</label>
                            <input type="password" className="form-control" ref="pwd" placeholder='password' />
                        </div>
                        <div className="form-group">
                            <label >CITY:</label>
                            <input type="text" className="form-control" ref="city" placeholder='Ex. New York' />
                        </div>
                        <div className="form-group">
                            <label >COUNTRY:</label>
                            <input type="text" className="form-control" ref="country" placeholder='Ex. US' />
                        </div><br />
                        <div className='text-center'>
                            <button type='submit' className="btn btn-warning">Submit</button>
                        </div>
                    </form><br />
                    {this.state.errormsg ? <div className='alert alert-danger'>Enter all the fields</div> : ''}
                    <div id="myModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='alert alert-success'>Sign Up Successful!</div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success" data-dismiss="modal" onClick={this.redirectToLogin}>Continue to Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Register