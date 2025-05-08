import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { corsHeaders, handleOptions } from "@/lib/cors";

// ✅ لدعم preflight request
export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Email and password are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(req),
          },
        }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid email" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders(req) },
        }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders(req) },
        }
      );
    }

    const { password: _, ...userWithoutPassword } = user.toObject();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutPassword,
      },
      {
        headers: { ...corsHeaders(req) },
      }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Server error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
