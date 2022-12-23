import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const postSchema = new Schema({
	title: { type: String, require: true },
	date: { type: Date },
	likes: { type: Number },
	comments: { type: [Object] },
	shared: { type: Number },
	watch: { type: Number },
	author: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model('Post', postSchema);
