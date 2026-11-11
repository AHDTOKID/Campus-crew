import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Notification = model('Notification', new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    collegeId: { type: Schema.Types.ObjectId, ref: 'College' },
    type: String, text: String, link: String,
    read: { type: Boolean, default: false, index: true },
}, { timestamps: true }));

export default Notification;