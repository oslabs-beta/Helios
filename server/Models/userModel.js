
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

dotenv.config()

const userName = process.env.MONGO_DB_USERNAME
const password = process.env.MONGO_DB_PASSWORD
const mongoDBName = process.env.MONGO_DB_NAME
const uriDomain = process.env.MONGO_URI_DOMAIN


const mongoURI = `mongodb+srv://${userName}:${password}@${uriDomain}/${mongoDBName}?retryWrites=true&w=majority`
 // 'mongodb+srv://helios:ProjectHelios21@projecthelios.fjemz.mongodb.net/Helios?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI, {
    dbName: mongoDBName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');

// user model
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  arn: { type: String },
  region: { type: String, default: 'us-east-2', required: true },
});

// hash the password before it's saved in database
userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function (err, hash) {
    if (err) console.log(err);
    user.password = hash;
    return next();
  });
});

// the method to compare the hashed password with the one the user provided during login
userSchema.methods.comparePassword = async function (potentialPass) {
  const user = this;
  return await bcrypt.compare(potentialPass, user.password);
};

const User = mongoose.model('User', userSchema);

// schema for resetting password
const resetPasswordSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

// it expires after ten minutes if they haven't continued with process
resetPasswordSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 600 });

const PasswordReset = mongoose.model('PasswordReset', resetPasswordSchema);

module.exports = { User, PasswordReset };
