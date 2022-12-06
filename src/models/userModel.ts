import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: object;
  name: String;
  email: String;
  photo: String;
  role: String;
  password: String;
  confirmPassword: String | undefined;
  passwordChangedAt: Date;
  correctPassword: (candidatePassword: string, userPassword: string) => boolean;
  changePasswordAfter: (JWTTimestamp: number | undefined) => boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    requied: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el: String): boolean {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password as string, 12);
  this.confirmPassword = undefined;

  next();
});

// Instance methods
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (
  JWTTimestamp: number | undefined
) {
  if (this.passwordChangedAt && JWTTimestamp) {
    const changedTimestamp = this.passwordChangedAt / 1000;
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

export default mongoose.model<IUser>('User', userSchema);
