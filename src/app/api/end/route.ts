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

    const active = await prisma.workSession.findFirst({
      where: { code, endTime: null },
    });

    if (!active) {
      return NextResponse.json(
        { error: "No tienes una jornada activa" },
        { status: 404 }
      );
    }

    const endTime = new Date();
    const totalMs = endTime.getTime() - active.startTime.getTime();

    const updated = await prisma.workSession.update({
      where: { id: active.id },
      data: {
        endTime,
        totalMs,
      },
    });

    return NextResponse.json({ session: updated });
  } catch (error) {
    console.log(error)
    
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
