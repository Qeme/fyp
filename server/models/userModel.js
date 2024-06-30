import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'
const Schema = mongoose.Schema

// add second argument 'timestamp: true' to make sure if any new object created, the time will be recorded as well
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user", "referee"],
        required: true,
        default: "user",
    }
},{timestamps: true})

// generate static function like userdb.create (.create)
// we cant use => function because later we use 'this.'
userSchema.statics.signup = async function (name, email, password) {
    
    // validation part
    // check if the email and password exist or not
    if (!name || !email || !password) {
        throw Error("All fields must be filled");
    }
    // check if the email is REALLY an email or not
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }
    // check if the password is STRONG or not
    if (!validator.isStrongPassword(password)) {
        throw Error("Password is weak");
    }

    const exist = await this.findOne({ email });
  
    // check if the email already exist or not
    if (exist) {
      throw Error("The email already exist");
    }
  
    // create a salt to generate how long the hashing will be (argument)
    // await because it took some times to generate them
    const salt = await bcrypt.genSalt(10);
  
    // then put the salt into hash key
    // it took 2 arguments (the thing that you want to hash, the salt or rounds)
    const hash = await bcrypt.hash(password, salt);
  
    // then, we create a new user based on the email and hashed password
    const user = await this.create({ name, email, password: hash });
  
    // return the user information, for testing
    return user;
};

userSchema.statics.login = async function (email, password) {

    // check if the email and password are visible or not
    if (!email || !password) {
      throw Error("All fields must be filled");
    }
  
    // try to find the user by email first
    const user = await this.findOne({ email });
  
    // if no, throw an errow
    if(!user){
      throw Error('Incorrect email inserted / This account has been deleted by admin')
    }
  
    /* 
      1. so, if the user is there by email, now compare the password inserted by user
      2. bcrypt can use .compare to compare between the password inserted and the hashed password
    */
    const match = await bcrypt.compare(password, user.password)
  
    // if not match, throw an error
    if(!match){
      throw Error('Incorrect password inserted')
    }
  
    // pass the user ... any JWT process handled in server not in database
    return user
};

userSchema.statics.createuser = async function (name, email, password, role) {
    
  // validation part
  // check if the email and password exist or not
  if (!name || !email || !password) {
      throw Error("All fields must be filled");
  }
  // check if the email is REALLY an email or not
  if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
  }
  // check if the password is STRONG or not
  if (!validator.isStrongPassword(password)) {
      throw Error("Password is weak");
  }

  const exist = await this.findOne({ email });

  // check if the email already exist or not
  if (exist) {
    throw Error("The email already exist");
  }

  // create a salt to generate how long the hashing will be (argument)
  // await because it took some times to generate them
  const salt = await bcrypt.genSalt(10);

  // then put the salt into hash key
  // it took 2 arguments (the thing that you want to hash, the salt or rounds)
  const hash = await bcrypt.hash(password, salt);

  // then, we create a new user based on the email and hashed password
  const user = await this.create({ name, email, password: hash, role});

  // return the user information, for testing
  return user;
};

// users is the name of the collection in DB
// userSchema is the name of the Schema
const userDB = mongoose.model('users',userSchema)
export default userDB;