import mongoose from "mongoose";

mongoose.connect("url");

const CategorySchema = new mongoose.Schema({
    categoryName: {type: String, required: true, unique: true}
});

export const GetCategories = mongoose.model("categories", CategorySchema);

