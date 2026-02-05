import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "El código es obligatorio" },
        { status: 400 }
      );
    }

    // Revisar si el código es válido
    const user = await prisma.workSession.findUnique({
      where: { code },
    });

    if (user) {
      return NextResponse.json(
        { error: "El código no es válido, ya fue utilizado anteriormente" },
        { status: 404 }
      );
    }

    // Revisar si ya hay jornada activa
    const active = await prisma.workSession.findFirst({
      where: { code, endTime: null },
    });

    if (active) {
      return NextResponse.json(
        { error: "Ya tienes una jornada activa" },
        { status: 409 }
      );
    }

    const session = await prisma.workSession.create({
      data: {
        code,
        startTime: new Date(),
      },
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.log(error)
    
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
