import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.CATEGORY_DB;

if (!connectionString) {
  throw new Error('MongoDB connection string for categories is not defined in the environment variables.');
}

mongoose.connect(connectionString);

const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true }
});

const GetCategories = mongoose.model('Category', CategorySchema);

export { GetCategories };
