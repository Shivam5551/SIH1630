import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.ANSWERS_DB;

if (!connectionString) {
  throw new Error('MongoDB connection string for answers is not defined in the environment variables.');
}

mongoose.connect(connectionString);

const answersSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  correctOption: String,
});

export const checkAnswers = async (category) => {
  try {
    const answersCollectoin = mongoose.model(category, answersSchema);
    const answers = await answersCollectoin.find({});
    return answers;
  } catch (error) {
    console.error('Error fetching answers:', error);
    throw error;
  }
}
