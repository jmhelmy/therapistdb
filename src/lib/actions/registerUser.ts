"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function registerUser({
  email,
  password,
  therapistSlug,
}: {
  email: string;
  password: string;
  therapistSlug?: string;
}) {
  try {
    // 1. Hash the password
    const hashedPassword = await hash(password, 10);

    // 2. Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // 3. Link the user to a therapist profile if claiming one
    if (therapistSlug) {
      await prisma.therapist.update({
        where: { slug: therapistSlug },
        data: { userId: user.id },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
}
