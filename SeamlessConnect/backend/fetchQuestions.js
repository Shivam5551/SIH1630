import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.QUESTIONS_DB;

if (!connectionString) {
  throw new Error('MongoDB connection string for questions is not defined in the environment variables.');
}

mongoose.connect(connectionString);

const questionsSchema = new mongoose.Schema({
  statement: String,
  options: Object,
});

let questionModel = null;

export const GetQuestions = async (category) => {
  try {
    questionModel = mongoose.model(category, questionsSchema);

    const questions = await getRandomQuestions(10); 
    return questions; 
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error; 
  }
}

async function getRandomQuestions(n) {
  try {
    const randomQuestions = await questionModel.aggregate([
      { $sample: { size: n } } // Fetch 'n' random documents
    ]);
    return randomQuestions;
  } catch (error) {
    console.error('Error fetching random questions:', error);
    throw error;
  }
}
