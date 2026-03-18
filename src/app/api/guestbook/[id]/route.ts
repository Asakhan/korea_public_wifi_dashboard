import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function getEntry(id: string) {
  return prisma.guestbookEntry.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    )
  }
  const { id } = await params
  const entry = await getEntry(id)
  if (!entry) {
    return NextResponse.json({ error: "글이 없습니다." }, { status: 404 })
  }
  if (entry.userId !== session.user.id) {
    return NextResponse.json(
      { error: "본인 글만 수정할 수 있습니다." },
      { status: 403 }
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
    const updated = await prisma.guestbookEntry.update({
      where: { id },
      data: { content },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    })
    return NextResponse.json({
      id: updated.id,
      content: updated.content,
      userId: updated.userId,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      user: updated.user,
    })
  } catch (error) {
    console.error("Guestbook PATCH error:", error)
    return NextResponse.json(
      { error: "수정에 실패했습니다." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    )
  }
  const { id } = await params
  const entry = await prisma.guestbookEntry.findUnique({ where: { id } })
  if (!entry) {
    return NextResponse.json({ error: "글이 없습니다." }, { status: 404 })
  }
  if (entry.userId !== session.user.id) {
    return NextResponse.json(
      { error: "본인 글만 삭제할 수 있습니다." },
      { status: 403 }
    )
  }
  try {
    await prisma.guestbookEntry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Guestbook DELETE error:", error)
    return NextResponse.json(
      { error: "삭제에 실패했습니다." },
      { status: 500 }
    )
  }
}
