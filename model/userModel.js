import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
	email: { type: String, require: true, unique: true },
	isActivated: {type: Boolean, default: false},
    
});

export default model('User', userSchema);
