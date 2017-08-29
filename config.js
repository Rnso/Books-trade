const env = process.env

export const nodeEnv = env.NODE_ENV || 'development'


export default{
    mongodbUri: 'mongodb://rnso:pongen@ds163053.mlab.com:63053/fcc-books-trade',
    
    port: env.PORT || 9000,
    host: env.HOST || '0.0.0.0'
}



