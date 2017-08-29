const env = process.env

export const nodeEnv = env.NODE_ENV || 'development'


export default{
    //mongodbUri: 'mongodb://rnso:pongen@ds159892.mlab.com:59892/fcc',
    mongodbUri: 'mongodb://localhost:27017/bookClub',
    port: env.PORT || 9000,
    host: env.HOST || '0.0.0.0'
}




