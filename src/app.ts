import mongoose from 'mongoose'
import {config} from 'dotenv'
config()

import express from 'express'
import expressSession from 'express-session'
import passport from 'passport'
import {Strategy as TwitterStrategy} from 'passport-twitter'

import TwitterTokens from './models/TwitterTokens'

mongoose.connect(process.env.DB_CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

const twitterStrategy = new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK
}, async (token, tokenSecret, profile, cb) => {
  const twitterToken = await TwitterTokens.create({
    token,
    tokenSecret,
    profile
  })

  cb(twitterToken)
})



passport.use(twitterStrategy)

const app = express()

const session = expressSession({
  secret: 'seeexret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
})

app.use(session)
app.get('/oauth/twitter', passport.authenticate('twitter'));
app.get('/oauth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('success')
    res.redirect('/');
  });

app.use(passport.initialize())


app.listen(3000)
