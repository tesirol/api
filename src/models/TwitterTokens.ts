import {Schema, model} from 'mongoose'

const {Mixed, String} = Schema.Types

const TwitterProfilePhotoSchema = new Schema({
  value: String
})

const TwitterProfileSchema = new Schema({
  id: {type: String, unique: true},
  username: String,
  displayName: String,
  photos: [TwitterProfilePhotoSchema],
  _raw: String,
  _json: Mixed
})

const TwitterTokensSchema = new Schema({
  token: String,
  tokenSecret: String,
  profile: TwitterProfileSchema
})

export default model('TwitterTokens', TwitterTokensSchema)