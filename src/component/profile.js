import React, { Component } from 'react'
import * as constants from '../../constant.js'
import axios from 'axios'
import '../app.css'
import store from './store'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = { name: store.user_name, email: store.email, city: store.city, country: store.country }
        this.state.books = []
        this.state.totalsharedbooks = 0
        this.state.totalyourequest = 0
        this.state.totalotherrequest = 0
        this.state.yourrequest = []
        this.state.otherrequest = []
        this.state.modalbooks = []
        this.state.logout = store.LOGOUT
        this.logOut = this.logOut.bind(this)
        this.editProfile = this.editProfile.bind(this)
        this.saveProfile = this.saveProfile.bind(this)
        this.searchBook = this.searchBook.bind(this)
        this.addBooks = this.addBooks.bind(this)
        this.handleSharedBooks = this.handleSharedBooks.bind(this)
        this.handleYourRequestBooks = this.handleYourRequestBooks.bind(this)
        this.handleOthersRequestBooks = this.handleOthersRequestBooks.bind(this)
        this.acceptBooks = this.acceptBooks.bind(this)
    }
    componentDidMount() {
        if (store.searched_book != '') {
            this.setState({ books: store.books })
            this.refs.book.value = store.searched_book
        }
        axios.get(constants.serverUrl + `/api/profile/getuserbookinfo/${store.user_id}`)
            .then(res => {
                if (res.data != '') {
                    let shared = res.data.sharedBooks.length
                    let yourequest = res.data.yourRequestBooks.length
                    let otherrequest = res.data.otherRequestBooks.length
                    this.setState({ totalsharedbooks: shared })
                    this.setState({ totalyourequest: yourequest })
                    this.setState({ totalotherrequest: otherrequest })
                    this.state.yourrequest = res.data.yourRequestBooks
                    this.state.otherrequest = res.data.otherRequestBooks
                }
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

    editProfile(e) {
        e.preventDefault()
        this.refs.name.value = store.user_name
        this.refs.email.value = store.email
        this.refs.city.value = store.city
        this.refs.country.value = store.country
        $('#profileModal').modal('show')
    }
    saveProfile(e) {
        e.preventDefault()
        let userId = store.user_id
        let name = this.refs.name.value
        let email = this.refs.email.value
        let city = this.refs.city.value
        let country = this.refs.country.value
        axios.post(constants.serverUrl + `/api/profile/editprofile`, { userId, name, email, city, country })
            .then(res => {
                if (res.data.ok == 1) {
                    store.name = this.refs.name.value
                    store.email = this.refs.email.value
                    store.city = this.refs.city.value
                    store.country = this.refs.country.value
                    sessionStorage.store = JSON.stringify(store)
                    let obj = {}
                    obj.name = this.refs.name.value
                    obj.email = this.refs.email.value
                    obj.city = this.refs.city.value
                    obj.country = this.refs.country.value
                    this.setState(obj)
                    $('#profileModal').modal('hide')
                }
            })
            .catch(console.error)
    }
    searchBook(e) {
        e.preventDefault()
        let book = this.refs.book.value
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book}&maxResults=40`)
            .then(res => {
                this.setState({ books: res.data.items })
                store.searched_book = this.refs.book.value
                store.books = res.data.items
                sessionStorage.store = JSON.stringify(store)
            })
            .catch(console.error)
    }
    addBooks(e) {
        let id = e.target.id
        let arr = this.state.books[id]
        let image, categories, authors, infolink
        let title = arr.volumeInfo.title
        let publisher = arr.volumeInfo.publisher
        let available = true
        let pending = false
        arr.volumeInfo.infoLink === undefined ? infolink = '' : infolink = arr.volumeInfo.infoLink
        arr.volumeInfo.categories === undefined ? categories = '' : categories = (arr.volumeInfo.categories).join()
        arr.volumeInfo.imageLinks === undefined ? image = '' : image = arr.volumeInfo.imageLinks.thumbnail
        arr.volumeInfo.authors === undefined ? authors = '' : authors = (arr.volumeInfo.authors).join()
        let userId = store.user_id
        axios.post(constants.serverUrl + `/api/profile/sharebooks`, { userId, title, authors, publisher, categories, image, infolink, available, pending })
            .then(res => {
                let temp = this.state.totalsharedbooks + 1
                this.setState({ totalsharedbooks: temp })
                this.state.books.splice(id, 1)
                this.setState(this.state.books)
                store.books = this.state.books
                sessionStorage.store = JSON.stringify(store)
            })
            .catch(console.error)
    }
    handleSharedBooks() {
        axios.get(constants.serverUrl + `/api/profile/getusersharedbooks/${store.user_id}`)
            .then(res => {
                if (res.data.length != 0) {
                    this.setState({ modalbooks: res.data })
                    $('#bookModal').modal('show')
                }
            })
            .catch(console.error)
    }
    handleYourRequestBooks() {
        let promises = []
        this.state.yourrequest.map((item, i) => {
            promises.push(axios.get(constants.serverUrl + `/api/profile/getyourrequestbooks/${item}`))
        })
        axios.all(promises)
            .then(res => {
                let arr = []
                if (res.length > 0) {
                    res.map(item => {
                        arr.push(item.data)
                        this.setState({ modalbooks: arr })
                        $('#bookModal').modal('show')
                    })
                }
            })
            .catch(console.error)
    }
    handleOthersRequestBooks() {
        let promises = []
        this.state.otherrequest.map((item, i) => {
            promises.push(axios.get(constants.serverUrl + `/api/profile/getotherrequestbooks/${item}`))
        })
        axios.all(promises)
            .then(res => {
                let arr = []
                if (res.length > 0) {
                    res.map(item => {
                        arr.push(item.data)
                        this.setState({ modalbooks: arr })
                        $('#bookModal').modal('show')
                    })
                }
            })
            .catch(console.error)
    }
    acceptBooks(e) {
        let id = e.target.id
        let obj = this.state.modalbooks[id]
        let userId = store.user_id
        let book_id = obj._id
        let pending = false
        axios.post(constants.serverUrl + `/api/profile/acceptbook`, { userId, book_id, pending })
            .then(res => {
                this.state.otherrequest = res.data
                this.state.modalbooks.splice(id, 1)
                this.state.totalotherrequest--
                this.setState(this.state.totalotherrequest)
                $('#bookModal').modal('hide')
            })
            .catch(console.error)
    }
    render() {
        return (
            <div>
                {!this.state.logout &&
                    <div className='logout'>
                        <h5 className='editprofile'>Log out<span>&nbsp;&nbsp;<a href=''><i className="fa fa-sign-out" onClick={this.logOut}></i></a></span></h5>
                    </div>
                }
                <div className='container'><br />
                    <div id="profileModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <h4 className="modal-title">Edit Your Profile</h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={this.saveProfile}>
                                        <div className="form-group">
                                            <label >NAME:</label>
                                            <input type="text" className="form-control" ref="name" placeholder='Ex. John Smith' />
                                        </div>
                                        <div className="form-group">
                                            <label >EMAIL:</label>
                                            <input type="email" className="form-control" ref="email" placeholder='Ex. john@gmail.com' />
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
                                            <button type='submit' className="btn btn-success">Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="bookModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <br />
                                    <div className='col-md-12'></div>
                                    {this.state.modalbooks.map((item, i) => {
                                        return <div key={i} className='col-md-4 text-center'>
                                            <h4>{item.title}</h4>
                                            <img src={item.image} alt={item.title} height='180px' />
                                            <div>
                                                {item.pending == true && item.user_id === store.user_id && item.available == false ?
                                                    <button id={i} className='btn btn-success' onClick={this.acceptBooks}>ACCEPT THE BOOK</button> : ''}
                                                {item.pending == false && item.available == false ?
                                                    <button id={i} className='btn btn-success'>REQUEST ACCEPTED</button> : ''}
                                            </div>
                                        </div>
                                    })}
                                    <div className='col-md-12'></div>
                                </div>
                                <div className="modal-footer">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='text-center'>
                        <h2 className='textshadow'>PROFILE</h2><br /><br />
                    </div>

                    <div className='profile-action'>
                        <h5 className='editprofile'>Edit profile<span>&nbsp;&nbsp;<a href=''><i className="fa fa-pencil-square-o" onClick={this.editProfile}></i></a></span></h5>&nbsp;&nbsp;
                </div>

                    <div className='col-md-3 profile'>
                        <p><i className='fa fa-user'></i>&nbsp;{this.state.name}</p>
                        <p><i className='fa fa-envelope'></i>&nbsp;{this.state.email}</p>
                        <p><i className='fa fa-location-arrow'></i>&nbsp;{this.state.city}, {this.state.country}</p><hr />
                        <p><button className='btn btn-primary book_btn' onClick={this.handleSharedBooks}>You posted : {this.state.totalsharedbooks} books</button></p>
                        <p><button className='btn btn-warning book_btn' onClick={this.handleYourRequestBooks}>You requested : {this.state.totalyourequest} books</button></p>
                        <p> <button className='btn btn-success book_btn' onClick={this.handleOthersRequestBooks}>Request pending : {this.state.totalotherrequest} books</button></p><br />
                    </div><br />
                    <div className='col-md-9'>
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
                        {this.state.books.map((item, i) => {
                            let image
                            item.volumeInfo.imageLinks === undefined ? image = '' : image = item.volumeInfo.imageLinks.thumbnail
                            return <div key={i} className='col-md-4 books'>
                                <div className='text-center'>
                                    <h4>{item.volumeInfo.title}</h4>
                                    <img src={image} alt={item.volumeInfo.title} height='180px' />
                                    <button id={i} className='btn btn-default' onClick={this.addBooks}><i className="fa fa-plus"></i>&nbsp;&nbsp; POST TO LIBRARY</button>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        )
    }
}
export default Profile