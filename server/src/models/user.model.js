import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
const { Types } = mongoose;
const ObjectId = Types.ObjectId;

const userSchema = new mongoose.Schema({
  company: { type: ObjectId, ref: 'Company', required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'Employee'], required: true },
  manager: { type: ObjectId, ref: 'User', default: null }, // who approves this user
  isManagerApprover: { type: Boolean, default: false },
  imageUrl:{type:String},
  accessToken: { type: String },
  refreshToken: { type: String },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password =await bcrypt.hash(this.password,10)
  }
  next()
})

userSchema.methods.isPasswordCorrect=async function (Password) {
 return await bcrypt.compare(Password,this.password)
}

userSchema.methods.generateAccessToken=async function (params) {
  // short lived access token
 return  jwt.sign({
   _id: this._id,
   email:this.email,
   username:this.username,
  },
process.env.ACCESS_TOKEN_SECRET,
{expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
)
}
userSchema.methods.generateRefreshToken=async function (params) {
  // short lived access token
 return  jwt.sign({
   _id: this._id
  },
process.env.REFRESH_TOKEN_SECRET,
{expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
)
}

const User = mongoose.model('User', userSchema);
export default User;
