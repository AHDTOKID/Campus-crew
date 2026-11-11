import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CollegeReview = model('CollegeReview', new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    text: { type: String, required: true },
    ratings: {
        academics: Number, faculty: Number, facilities: Number,
        hostel: Number, food: Number, placements: Number,
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    decisionReason: String,
}, { timestamps: true }));

export default CollegeReview;