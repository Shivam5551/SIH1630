import mongoose from "mongoose";



export const checkAnswers = async (category) => {
    await mongoose.connect('url');

    const answersSchema = new mongoose.Schema({
        questionId: {type: String, required: true, unique: true},
        correctOption: String,
    })
    const answersCollectoin = mongoose.model(category, answersSchema);
    const answers = await answersCollectoin.find({});
    return answers;
}