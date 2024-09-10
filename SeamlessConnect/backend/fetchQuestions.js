import mongoose from "mongoose";

var questionModel = null;
const questionsSchema = new mongoose.Schema({
    statement: String,
    options: Object,
})

export const GetQuestions = async (category) => {
    try {
        await mongoose.connect(`url`);

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