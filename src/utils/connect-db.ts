import mongoose from 'mongoose'

export const connectToDatabase = () => {
  const { MONGO_URI } = process.env

  mongoose.connect(MONGO_URI ?? '')
    .then(re => { console.log('Connected successfully! ', re) })
    .catch(() => { console.error('Failed to connect to db') })
}
