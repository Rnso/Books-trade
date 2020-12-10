
require('dotenv').config()
const env = process.env

export const nodeEnv = env.NODE_ENV || 'development'


export default{
    mongodbUri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.wipan.mongodb.net/fcc-books-trade?retryWrites=true&w=majority`,
    //mongodbUri: 'mongodb://rnso:pongen@ds163053.mlab.com:63053/fcc-books-trade',
    //mongodbUri: 'mongodb://localhost:27017/bookClub',
    port: env.PORT || 9002,
    host: env.HOST || '0.0.0.0'
}



