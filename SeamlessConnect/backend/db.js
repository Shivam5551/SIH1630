import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://Shivam:shivam@cluster0.d9e5typ.mongodb.net/mentorconnect/");


// Define schemas
const mentorSchema = new mongoose.Schema({
    firstName: { required: true, type: String },
    lastName: { type: String },
    mailID: { required: true, type: String, unique: true },
    phoneNO: { required: true, type: String, unique: true },
    hashedPassword: { required: true, type: String }
});

const menteeSchema = new mongoose.Schema({
    firstName: { required: true, type: String },
    lastName: { type: String },
    mailID: { required: true, type: String, unique: true },
    phoneNO: { required: true, type: String, unique: true },
    hashedPassword: { required: true, type: String }
});

// Define models
const MentorModel = mongoose.model('Mentor', mentorSchema);
const MenteeModel = mongoose.model('Mentee', menteeSchema);

export {
    MentorModel,
    MenteeModel
};
