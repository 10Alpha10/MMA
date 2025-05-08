import { connectToDatabase } from "@/lib/mongodb"; 
import User from "@/models/user.model"; 
import { NextResponse } from "next/server"; 
import bcrypt from "bcryptjs"; 

export async function POST(req: Request) {
  try {
    const { email, password, confirmPassword } = await req.json();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { message: "Password must contain at least one uppercase letter, one lowercase letter, and one digit" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "This email is already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { id: newUser._id, email: newUser.email },
      },
      { status: 201, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Server error occurred" },
      { status: 500 }
    );
  }
}
