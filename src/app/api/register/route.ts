import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists." }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    // Create user and auto-create a placeholder Therapist profile
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        therapist: {
          create: {
            name: "Unnamed Therapist",
            slug: `therapist-${Date.now()}`,
            published: false,
            profileComplete: false,
          },
        },
      },
      include: {
        therapist: true,
      },
    });

    return NextResponse.json({
      message: "User and therapist created successfully",
      user: {
        id: user.id,
        email: user.email,
        therapistId: user.therapist?.id,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
