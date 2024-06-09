import jwt from "jsonwebtoken";
import userDB from "../models/userModel.js";

const requireAuth = async (req, res, next) => {
  // require authentication by grabbing token from headers
  const { authorization } = req.headers;

  // if no authorization provided, we end the req
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  // in authorization, the string would be like this 'Bearer XFEHDC1234.SAJNINQG.SNUIH324'
  // now we split by taking the string token after ' ' (white spaces), means it become an array length = 2 (just take index 1)
  const token = authorization.split(" ")[1];

  // do try catch
  try {
    // we apply jwt to verify the token (return token, then we grab the _id component which is in payload)
    // it took the token part, which are header and payload (will hash using the SECRET)
    // then compare the hashed result with the .signature
    const { _id } = jwt.verify(token, process.env.SECRET);

    // then we attach the user properties to req, so when next() they can use it
    // we only grab the _id of the user instead of email and meta data because it will be used just for verification for the API
    req.user = await userDB.findOne({ _id }).select("_id role");

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Request is not authorized" });
  }
};

export default requireAuth;
