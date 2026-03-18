import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    })
    return NextResponse.json(
      entries.map((e) => ({
        id: e.id,
        content: e.content,
        userId: e.userId,
        createdAt: e.createdAt.toISOString(),
        user: e.user,
      }))
    )
  } catch (error) {
    console.error("Guestbook GET error:", error)
    return NextResponse.json(
      { error: "방명록을 불러올 수 없습니다." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    )
  }
  try {
    const body = await request.json()
    const content = typeof body?.content === "string" ? body.content.trim() : ""
    if (!content) {
      return NextResponse.json(
        { error: "내용을 입력해주세요." },
        { status: 400 }
      )
    }
    const entry = await prisma.guestbookEntry.create({
      data: { content, userId: session.user.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    })
    return NextResponse.json({
      id: entry.id,
      content: entry.content,
      userId: entry.userId,
      createdAt: entry.createdAt.toISOString(),
      user: entry.user,
    })
  } catch (error) {
    console.error("Guestbook POST error:", error)
    return NextResponse.json(
      { error: "방명록 작성에 실패했습니다." },
      { status: 500 }
    )
  }
}
