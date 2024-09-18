import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.FILES_SUBMIT_DB;

if (!connectionString) {
  throw new Error('MongoDB connection string for file submissions is not defined in the environment variables.');
}

mongoose.connect(connectionString);

const submissionSchema = new mongoose.Schema({
  idCardPath: String,
  profileUrl: String,
  certificationPath: String,
  education: String,
  experience: String,
  additionalCertificates: String,
}, { timestamps: true });

export const Submission = mongoose.model('Submission', submissionSchema);
