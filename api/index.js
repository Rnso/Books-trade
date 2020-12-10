import express from 'express'
import { ObjectId } from 'mongodb'
import config from '../config'

const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(config.mongodbUri, { useNewUrlParser: true })
let database
let users, books, yourRequests, otherRequests
client.connect((err, client) => {
    if (err) console.log('failed to connect')
    else {
        console.log('connected')
        database = client.db('fcc-books-trade')
        users = database.collection('users')
        books = database.collection('books')
        yourRequests = database.collection('yourRequests')
        otherRequests = database.collection('otherRequests')
    }
})

const router = express.Router()

router.post('/register', (req, res) => {
    users.insertOne(req.body).then((result) => {
        res.send(result.ops)
    })

})

router.post('/login', (req, res) => {
    users.findOne({ email: req.body.email, pwd: req.body.pwd }).then(result => {
        res.send(result)
    })
})

router.post('/profile/editprofile', (req, res) => {
    users.updateOne({ _id: ObjectId(req.body.userId) }, { $set: { name: req.body.name, email: req.body.email, city: req.body.city, country: req.body.country }}).then((result) => {
        res.send(result)
    })
})

router.post('/profile/sharebooks', (req, res) => {
    books.insertOne({ user_id: ObjectId(req.body.userId), title: req.body.title, authors: req.body.authors, publisher: req.body.publisher, categories: req.body.categories, image: req.body.image, infolink: req.body.infolink, available: req.body.available, pending: req.body.pending }).then((result) => {
        users.updateOne({ _id: ObjectId(req.body.userId) }, { $push: { shared_ids: ObjectId(result.ops[0]._id) } }).then(result1 => {
            users.findOne({ _id: ObjectId(req.body.userId) }).then(result2 => {
                res.send(result2)
            })
        })
    })
})

router.get('/profile/getuserbookinfo/:userId', (req, res) => {
    users.findOne({ _id: ObjectId(req.params.userId) }).then(user => {
        let obj = {}
        obj.sharedBooks = user.shared_ids
        obj.yourRequestBooks = user.yourrequest_ids
        obj.otherRequestBooks = user.otherrequest_ids
        res.send(obj)
    })

})

router.get('/profile/getusersharedbooks/:userId', (req, res) => {
    books.find({ user_id: ObjectId(req.params.userId) }).toArray((err, books) => {
        res.send(books)
    })
})

router.get('/profile/getyourrequestbooks/:id', (req, res) => {
    yourRequests.findOne({ _id: ObjectId(req.params.id) }, { _id: 0, book_id: 1 }).then(book => {
        //console.log(book)
        books.findOne({ _id: ObjectId(book.book_id) }).then(result => {
            //console.log(result)
            res.send(result)
        })
    })
})

router.get('/profile/getotherrequestbooks/:id', (req, res) => {
    otherRequests.findOne({ _id: ObjectId(req.params.id) }, { _id: 0, book_id: 1 }).then(book => {
        books.findOne({ _id: ObjectId(book.book_id) }).then(result => {
           // console.log(result)
            res.send(result)
        })
    })
})

router.post('/profile/acceptbook', (req, res) => {
    otherRequests.findOne({ book_id: ObjectId(req.body.book_id) }, { _id: 1 }).then(id => {
        //console.log(id)
        users.updateOne({ _id: ObjectId(req.body.userId) }, { $pull: { otherrequest_ids: ObjectId(id._id) } }).then(() => {
            books.updateOne({ _id: ObjectId(req.body.book_id) }, { $set: { pending: req.body.pending } }).then(() => {
                users.findOne({ _id: ObjectId(req.params.userId) }).then(user => {
                    otherRequests.deleteOne({ _id: ObjectId(id._id) })
                    res.send(user.otherrequest_ids)
                })
            })
        })
    })
})

router.get('/library/getsharedbooks', (req, res) => {
    books.find().toArray((err, books) => {
        res.send(books)
    })
})

router.post('/library/requestBook', (req, res) => {
    yourRequests.insertOne({ user_id: ObjectId(req.body.user), book_id: ObjectId(req.body.book_id) }).then(yid => {
        //console.log(yid.ops[0]._id)

        users.updateOne({ _id: ObjectId(req.body.user) }, { $push: { yourrequest_ids: ObjectId(yid.ops[0]._id) } }).then(() => {
            otherRequests.insertOne({ user_id: ObjectId(req.body.owner), book_id: ObjectId(req.body.book_id) }).then(oid => {
                users.updateOne({ _id: ObjectId(req.body.owner) }, { $push: { otherrequest_ids: ObjectId(oid.ops[0]._id) } }).then(() => {
                    books.updateOne({ _id: ObjectId(req.body.book_id) }, { $set: { pending: true, available: false } }).then(result => {
                        books.find().toArray((err, books) => {
                            res.send(books)
                        })
                    })
                })
            })
        })
    })

})

router.post('/library/withdrawBook', (req, res) => {
    users.updateOne({ _id: ObjectId(req.body.user) }, { $pull: { shared_ids: ObjectId(req.body.book_id) } }).then((result1) => {
        books.deleteOne({ _id: ObjectId(req.body.book_id) }).then(result2 => {
            books.find().toArray((err, books) => {
                res.send(books)
            })
        })
    })
})



export default router