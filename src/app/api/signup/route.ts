import { connectToDatabase } from "@/lib/mongodb"; // Import the database connection function
import User from "@/models/user.model"; // Import the user model
import { NextResponse } from "next/server"; // Import NextResponse for the response
import bcrypt from "bcryptjs"; // Import bcryptjs

export async function POST(req: Request) {
  try {
    // Check if the request contains data
    const { email, password, confirmPassword } = await req.json();

    // Check if the fields are provided
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate the email using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate the password strength: it must contain lowercase, uppercase letters, and numbers
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { message: "Password must contain at least one uppercase letter, one lowercase letter, and one digit" },
        { status: 400 }
      );
    }

    // Validate the password length
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
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

    // Return the success response with user details (without password)
    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { id: newUser._id, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Server error occurred" },
      { status: 500 }
    );
  }
}
