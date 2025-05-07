import mongoose, { Schema, Document } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // يمكن إضافة timestamps لتخزين تاريخ الإنشاء والتعديل
  }
);

// تعريف الـ Model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
