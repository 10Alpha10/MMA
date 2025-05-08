import { connectToDatabase } from "@/lib/mongodb"; // Import the database connection function
import User from "@/models/user.model"; // Import the user model
import { NextResponse } from "next/server"; // Import NextResponse for the response
import bcrypt from "bcryptjs"; // Import bcryptjs

export async function POST(req: Request) {
  try {
    // Log the request body
    console.log('Request body:', await req.json());  // أضف هذا السطر لتسجيل البيانات المرسلة

    // Check if the request contains data
    const { email, password, confirmPassword } = await req.json();

    // Check if the fields are provided
    if (!email || !password || !confirmPassword) {
      console.error('Missing required fields'); // سجل خطأ إذا كانت الحقول مفقودة
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate the email using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email); // سجل الخطأ إذا كان البريد الإلكتروني غير صحيح
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate the password strength: it must contain lowercase, uppercase letters, and numbers
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      console.error('Password does not meet requirements:', password); // سجل الخطأ إذا كانت كلمة المرور لا تستوفي المتطلبات
      return NextResponse.json(
        { message: "Password must contain at least one uppercase letter, one lowercase letter, and one digit" },
        { status: 400 }
      );
    }

    // Validate the password length
    if (password.length < 8) {
      console.error('Password is too short:', password); // سجل الخطأ إذا كانت كلمة المرور قصيرة جدًا
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      console.error('Passwords do not match'); // سجل الخطأ إذا كانت كلمات المرور لا تتطابق
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('User already exists:', email); // سجل الخطأ إذا كان المستخدم موجودًا بالفعل
      return NextResponse.json(
        { message: "This email is already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Log the newly created user (without password)
    console.log('User created successfully:', newUser);

    // Return the success response with user details (without password)
    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { id: newUser._id, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    // Log the error
    console.error('Signup error:', error); // سجل تفاصيل الخطأ في حالة حدوث استثناء
    return NextResponse.json(
      { message: "Server error occurred" },
      { status: 500 }
    );
  }
}
