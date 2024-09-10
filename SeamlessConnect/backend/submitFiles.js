import mongoose from "mongoose";

mongoose.connect('url');

const submissionSchema = new mongoose.Schema({
    idCardPath: String,
    profileUrl: String,
    certificationPath: String,
    education: String,
    experience: String,
    additionalCertificates: String,
}, {timestamps: true});

export const Submission = mongoose.model('Submission', submissionSchema);
