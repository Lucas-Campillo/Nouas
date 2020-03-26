const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
let db = require('./config/db.js')
let users = require('./models/users.js')
function initialize(passport, getUserByEmail, getUserById) 
{
  const authenticateUser = async (email, password, done) => {
    users.read(email, async(resultats)=>
    {
    const user = (resultats[0])
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
    })
    
  
    
  }


  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => 
  {
    users.readId(id, async(Users)=>
    {
    return done(null, 
      {
      id: Users[0].id,
      name: Users[0].username,
      email: Users[0].email,
      password: Users[0].password,
      admin: Users[0].admin
      })
    })
  })
}

module.exports = initialize