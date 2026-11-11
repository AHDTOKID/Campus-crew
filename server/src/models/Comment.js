import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Comment = model('Comment', new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null, index: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true }));

export default Comment;