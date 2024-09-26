import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.REGISTRATION_DB;

if (!connectionString) {
  throw new Error('MongoDB connection string for registration is not defined in the environment variables.');
}

mongoose.connect(connectionString)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define schemas and models
const mentorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  emailID: { type: String, required: true, unique: true },
  phoneNO: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  test: {required: true, type: Boolean},
  filesUpload: {required: true, type: Boolean},
  documentVerified: {required: true, type: Boolean},
});

const menteeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  emailID: { type: String, required: true, unique: true },
  phoneNO: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true }
});

const MentorModel = mongoose.model('Mentor', mentorSchema);
const MenteeModel = mongoose.model('Mentee', menteeSchema);

export { MentorModel, MenteeModel };

