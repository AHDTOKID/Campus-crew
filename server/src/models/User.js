import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', index: true, default: null },
    role: { type: String, enum: ['student', 'moderator', 'admin'], default: 'student' },
    status: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
    department: String, year: Number, bio: String,
    skills: [String], avatarUrl: String,
    rating: { avg: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

userSchema.methods.toPublicDTO = function () {
    return {
        _id: this._id, name: this.name, avatarUrl: this.avatarUrl,
        department: this.department, year: this.year,
        bio: this.bio, skills: this.skills, rating: this.rating,
        role: this.role, status: this.status, collegeId: this.collegeId,
    };
};

const User = model('User', userSchema);

export default User;