import mongoose from 'mongoose';

mongoose.connect("url");


// Define schemas
const mentorSchema = new mongoose.Schema({
    firstName: { required: true, type: String },
    lastName: { type: String },
    emailID: { required: true, type: String, unique: true },
    phoneNO: { required: true, type: String, unique: true },
    hashedPassword: { required: true, type: String }
});

const menteeSchema = new mongoose.Schema({
    firstName: { required: true, type: String },
    lastName: { type: String },
    emailID: { required: true, type: String, unique: true },
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
