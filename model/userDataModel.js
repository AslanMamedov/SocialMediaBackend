import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userDataSchema = new Schema({
	name: { type: String, require: true },
	fullname: { type: String, require: true },
	day: { type: Number, require: true },
	month: { type: String, require: true },
	year: { type: Number, require: true },
	gender: { type: String, require: true },
	posts: { type: Schema.Types.ObjectId, ref: 'Post' },
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	password: { type: String, require: true },
	activationLink: { type: String },
});

export default model('UserData', userDataSchema);
