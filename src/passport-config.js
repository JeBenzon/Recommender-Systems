//https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/passport-config.js
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport, getUserByEmail){
    const authenticateUser = async (email, password, done) => {
        
        const user = getUserByEmail(email)

            if (user == null){
                return done(null, false, { message: 'No user with this email!'})
            }
        
            try {
                if (await bcrypt.compare(password, user.password)){
                    return done(null, user)
                } else {
                    done(null, false, {message: 'password not correct'})
                }
            } catch(e){
                return done(e)
            }

    }
    
    
    passport.use(new LocalStrategy({usernameField: 'email'}, 
    authenticateUser))
    passport.serializeUser((user, done) => {})
    passport.deserializeUser((id, done) => {})
}

module.exports = {
    initialize
}