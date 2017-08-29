import express from 'express'
import { MongoClient, ObjectID } from 'mongodb'
import assert from 'assert'
import config from '../config'

let mdb;
MongoClient.connect(config.mongodbUri, (err, db) => {
    assert.equal(null, err)

    mdb = db
})
const router = express.Router()

router.post('/register', (req, res) => {
    mdb.collection("users").insert(req.body).then((result) => {
        res.send(result.ops)
    })

})

router.post('/login', (req, res) => {
    mdb.collection('users').findOne({ email: req.body.email, pwd: req.body.pwd }).then(result => {
        res.send(result)
    })
})

router.post('/profile/editprofile', (req, res) => {
    mdb.collection("users").update({ _id: ObjectID(req.body.userId) }, { $set: { name: req.body.name, email: req.body.email, city: req.body.city, country: req.body.country }}).then((result) => {
        res.send(result)
    })
})

router.post('/profile/sharebooks', (req, res) => {
    mdb.collection("books").insert({ user_id: ObjectID(req.body.userId), title: req.body.title, authors: req.body.authors, publisher: req.body.publisher, categories: req.body.categories, image: req.body.image, infolink: req.body.infolink, available: req.body.available, pending: req.body.pending }).then((result) => {
        mdb.collection("users").update({ _id: ObjectID(req.body.userId) }, { $push: { shared_ids: ObjectID(result.ops[0]._id) } }).then(result1 => {
            mdb.collection("users").findOne({ _id: ObjectID(req.body.userId) }).then(result2 => {
                res.send(result2)
            })
        })
    })
})

router.get('/profile/getuserbookinfo/:userId', (req, res) => {
    mdb.collection("users").findOne({ _id: ObjectID(req.params.userId) }).then(user => {
        let obj = {}
        obj.sharedBooks = user.shared_ids
        obj.yourRequestBooks = user.yourrequest_ids
        obj.otherRequestBooks = user.otherrequest_ids
        res.send(obj)
    })

})

router.get('/profile/getusersharedbooks/:userId', (req, res) => {
    mdb.collection("books").find({ user_id: ObjectID(req.params.userId) }).toArray((err, books) => {
        res.send(books)
    })
})

router.get('/profile/getyourrequestbooks/:id', (req, res) => {
    mdb.collection("yourrequests").findOne({ _id: ObjectID(req.params.id) }, { _id: 0, book_id: 1 }).then(book => {
        console.log(book)
        mdb.collection("books").findOne({ _id: ObjectID(book.book_id) }).then(result => {
            console.log(result)
            res.send(result)
        })
    })
})

router.get('/profile/getotherrequestbooks/:id', (req, res) => {
    mdb.collection("otherrequests").findOne({ _id: ObjectID(req.params.id) }, { _id: 0, book_id: 1 }).then(book => {
        mdb.collection("books").findOne({ _id: ObjectID(book.book_id) }).then(result => {
            console.log(result)
            res.send(result)
        })
    })
})

router.post('/profile/acceptbook', (req, res) => {
    mdb.collection("otherrequests").findOne({ book_id: ObjectID(req.body.book_id) }, { _id: 1 }).then(id => {
        console.log(id)
        mdb.collection("users").update({ _id: ObjectID(req.body.userId) }, { $pull: { otherrequest_ids: ObjectID(id._id) } }).then(() => {
            mdb.collection("books").update({ _id: ObjectID(req.body.book_id) }, { $set: { pending: req.body.pending } }).then(() => {
                mdb.collection("users").findOne({ _id: ObjectID(req.params.userId) }).then(user => {
                    mdb.collection("otherrequests").remove({ _id: ObjectID(id._id) })
                    res.send(user.otherrequest_ids)
                })
            })
        })
    })
})

router.get('/library/getsharedbooks', (req, res) => {
    mdb.collection("books").find().toArray((err, books) => {
        res.send(books)
    })
})

router.post('/library/requestBook', (req, res) => {
    mdb.collection("yourrequests").insert({ user_id: ObjectID(req.body.user), book_id: ObjectID(req.body.book_id) }).then(yid => {
        console.log(yid.ops[0]._id)

        mdb.collection("users").update({ _id: ObjectID(req.body.user) }, { $push: { yourrequest_ids: ObjectID(yid.ops[0]._id) } }).then(() => {
            mdb.collection("otherrequests").insert({ user_id: ObjectID(req.body.owner), book_id: ObjectID(req.body.book_id) }).then(oid => {
                mdb.collection("users").update({ _id: ObjectID(req.body.owner) }, { $push: { otherrequest_ids: ObjectID(oid.ops[0]._id) } }).then(() => {
                    mdb.collection("books").update({ _id: ObjectID(req.body.book_id) }, { $set: { pending: true, available: false } }).then(result => {
                        mdb.collection("books").find().toArray((err, books) => {
                            res.send(books)
                        })
                    })
                })
            })
        })
    })

})

router.post('/library/withdrawBook', (req, res) => {
    mdb.collection("users").update({ _id: ObjectID(req.body.user) }, { $pull: { shared_ids: ObjectID(req.body.book_id) } }).then((result1) => {
        mdb.collection("books").remove({ _id: ObjectID(req.body.book_id) }).then(result2 => {
            mdb.collection("books").find().toArray((err, books) => {
                res.send(books)
            })
        })
    })
})



export default router