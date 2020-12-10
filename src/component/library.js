import React, { Component } from 'react'
import * as constants from '../../constant.js'
import axios from 'axios'
import '../app.css'
import store from './store'

class Library extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.state.sharedbooks = []
        this.state.logout = store.LOGOUT
        this.logOut = this.logOut.bind(this)
        this.searchBook = this.searchBook.bind(this)
        this.requestBook = this.requestBook.bind(this)
        this.withdrawBook = this.withdrawBook.bind(this)
    }
    componentDidMount() {
        axios.get(constants.serverUrl + `/api/library/getsharedbooks`)
            .then(res => {
                if (res.data.length != 0) {
                    this.setState({ sharedbooks: res.data })
                    store.sharedbooks = res.data
                    sessionStorage.store = JSON.stringify(store)
                }
            })
            .catch(console.error)
    }
    searchBook(e) {
        e.preventDefault()
        let book = this.refs.book.value
        let arr = []
        arr = store.sharedbooks.filter(item => {
            return item.title.toLowerCase().indexOf(book.toLowerCase()) >= 0
        })
        this.setState({ sharedbooks: arr })
    }
    requestBook(e) {
        let i = e.target.id
        let temp = this.state.sharedbooks[i]
        let user = store.user_id
        let owner = temp.user_id
        let book_id = temp._id
        axios.post(constants.serverUrl + `/api/library/requestBook`, { user, owner, book_id })
            .then(res => {
                console.log(res)
                this.setState({ sharedbooks: res.data })
                store.sharedbooks = res.data
                sessionStorage.store = JSON.stringify(store)
            })
            .catch(console.error)
    }
    withdrawBook(e) {
        let temp = this.state.sharedbooks[e.target.id]
        let user = store.user_id
        let book_id = temp._id
        axios.post(constants.serverUrl + `/api/library/withdrawBook`, { user, book_id })
            .then(res => {
                this.setState({ sharedbooks: res.data })
                store.sharedbooks = res.data
                sessionStorage.store = JSON.stringify(store)
            })
            .catch(console.error)
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
        this.props.history.push('/about')
    }

    render() {
        return (
            <div>
                {!this.state.logout &&
                    <div className='logout'>
                        <h5 className='editprofile'>Log out<span>&nbsp;&nbsp;<a href=''><i className="fa fa-sign-out" onClick={this.logOut}></i></a></span></h5>
                    </div>
                }
                <div className='container text-center'><br />
                    <h2 className='textshadow'>LIBRARY</h2><br /><br />
                    <form onSubmit={this.searchBook}>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Enter the name of book" ref="book" />
                            <div className="input-group-btn">
                                <button className="btn btn-default" type="submit">
                                    <i className="glyphicon glyphicon-search"></i>
                                </button>
                            </div>
                        </div>
                    </form><br /><br />
                    {this.state.sharedbooks.map((item, i) => {
                        return <div key={i} className='col-md-3 books text-center library'>
                            <h4>{item.title}</h4>
                            <a href={item.infolink} target='_blank'><img src={item.image} alt={item.title} height='180px' /></a>
                            {store.user_id == '' ? '' :
                                item.user_id === store.user_id ?
                                    <div>
                                        {item.pending == true && item.available == false ? <button id={i} className='btn btn-warning'>BOOK ON REQUEST</button> : ''}
                                        {item.pending == false && item.available == true ? <button id={i} className='btn btn-default' onClick={this.withdrawBook}>WITHDRAW YOUR BOOK</button> : ''}
                                        {item.pending == false && item.available == false ? <button id={i} className='btn btn-danger'>BOOK IS TRADED</button> : ''}
                                    </div> : <div>
                                        {item.pending == true && item.available == false ? <button id={i} className='btn btn-warning'>BOOK ON REQUEST</button> : ''}
                                        {item.pending == false && item.available == true ? <button id={i} className='btn btn-default' onClick={this.requestBook}>REQUEST THIS BOOK</button> : ''}
                                        {item.pending == false && item.available == false ? <button id={i} className='btn btn-danger'>BOOK IS TRADED</button> : ''}
                                    </div>
                            }
                            <p>Authors: {item.authors}</p>
                            <p>Publisher: {item.publisher}</p>
                            <p>Categories: {item.categories}</p>
                        </div>
                    })}
                </div>
            </div>
        )
    }
}
export default Library