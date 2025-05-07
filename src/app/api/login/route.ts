import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // ← Make sure it's installed

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to the database and find the user
    await connectToDatabase();
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email" },
        { status: 401 }
      );
    }

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid password  " },
        { status: 401 }
      );
    }

    // Remove password from the user object
    const { password: _, ...userWithoutPassword } = user.toObject();

    // ⬇️ Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!, // ← Make sure this exists in .env file
      { expiresIn: "7d" }
    );

    // ⬇️ Create response and set token in cookies
    const response = NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true, // Cookie not accessible from JavaScript
      secure: process.env.NODE_ENV === "production", // Secure only in production
      maxAge: 60 * 60 * 24 * 7, // Token valid for 7 days
      path: "/", // Cookie path
      sameSite: "strict", // Prevent cross-site sending
    });

    return response;

  } catch (error) {
    // Handle server errors
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Server error occurred" },
      { status: 500 }
    );
  }
}
