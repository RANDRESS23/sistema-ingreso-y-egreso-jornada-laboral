import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  
  if (!code) {
    return NextResponse.json(
      { error: "El código es obligatorio" },
      { status: 400 }
    );
  }

  const active = await prisma.workSession.findFirst({
    where: { code, endTime: null },
  });

  return NextResponse.json({ active });
}
