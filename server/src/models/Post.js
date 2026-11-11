import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Post = model('Post', new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: String,
    media: [String],
    visibility: { type: String, enum: ['private', 'public-nominated'], default: 'private' },
    publicationState: { type: String, enum: ['private', 'pending', 'approved', 'rejected', 'withdrawn'], default: 'private', index: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    commentCount: { type: Number, default: 0 },
}, { timestamps: true }));

export default Post;