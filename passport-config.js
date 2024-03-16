import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

//the passport modules is inserted here
function initialize(passport,getUserByEmail,getUserById){
    const authenticateUser = async (email,password,done) => {

        //email part
        const user = await getUserByEmail(email)
        console.log(user);
        if(user == null){
            return done(null, false, { message: 'No user with that email' })
        }

        //password part
        try{
            if (await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                return done(null, false, { message:'Password incorrect' })
            }
        }catch (e){
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' },authenticateUser))
    passport.serializeUser((user, done) => done(null,user.id))
    passport.deserializeUser((id, done) => {
        return done(null,getUserById(id))
    })
}

export default initialize