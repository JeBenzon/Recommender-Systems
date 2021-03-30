//https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/passport-config.js
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        //henter user fra email
        const user = getUserByEmail(email)

            //Tjekker om user (email) er null
            if (user == null){
                return done(null, false, { message: 'No user with this email!'})
            }
            //tjekker om user's password matcher
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
    //SerializeUser gemmer user.id i session cookie (sid) hos brugeren
    passport.serializeUser((user, done) => done( null, user.id))
    passport.deserializeUser((id, done) => {
        return done( null, getUserById(id))
    })
}

module.exports = {
    initialize
}