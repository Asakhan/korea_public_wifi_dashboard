"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import SidebarLayout from "@/components/SidebarLayout"
import { BookOpen, Send, Pencil, Trash2, X, Check } from "lucide-react"
import Image from "next/image"

interface GuestbookUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

interface GuestbookEntry {
  id: string
  content: string
  userId: string
  createdAt: string
  user: GuestbookUser
}

export default function GuestbookPage() {
  const { data: session, status } = useSession()
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/guestbook")
      if (!res.ok) throw new Error("목록을 불러올 수 없습니다.")
      const data = await res.json()
      setEntries(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !session?.user?.id) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "작성에 실패했습니다.")
      setEntries((prev) => [data, ...prev])
      setContent("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (entry: GuestbookEntry) => {
    setEditingId(entry.id)
    setEditContent(entry.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent("")
  }

  const saveEdit = async () => {
    if (!editingId || !editContent.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/guestbook/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "수정에 실패했습니다.")
      setEntries((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...data } : e))
      )
      cancelEdit()
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("이 글을 삭제할까요?")) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/guestbook/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "삭제에 실패했습니다.")
      }
      setEntries((prev) => prev.filter((e) => e.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const currentUserId = session?.user?.id ?? null

  return (
    <SidebarLayout>
      <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            방명록
          </h1>
          <p className="text-neutral-400">
            로그인한 회원은 Google 계정으로 방명록을 작성할 수 있습니다. 본인 글만 수정·삭제할 수 있습니다.
          </p>
        </div>

        {session?.user && (
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6"
          >
            <label htmlFor="guestbook-content" className="block text-sm font-medium text-neutral-300 mb-2">
              새 글 작성
            </label>
            <textarea
              id="guestbook-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="방명록에 남길 말을 입력하세요..."
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              disabled={submitting}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none text-white font-medium rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
                작성
              </button>
            </div>
          </form>
        )}

        {status === "unauthenticated" && (
          <p className="text-neutral-500 text-sm">
            방명록 작성은 로그인 후 가능합니다.
          </p>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">글 목록</h2>
          {loading ? (
            <p className="text-neutral-500">불러오는 중...</p>
          ) : entries.length === 0 ? (
            <p className="text-neutral-500">아직 글이 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {entry.user.image ? (
                        <Image
                          src={entry.user.image}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded-full shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-neutral-700 shrink-0 flex items-center justify-center text-neutral-400 font-medium">
                          {(entry.user.name || entry.user.email || "?")[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">
                          {entry.user.name || entry.user.email || "알 수 없음"}
                        </p>
                        <p className="text-neutral-500 text-sm">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                    {currentUserId === entry.userId && (
                      <div className="flex items-center gap-2 shrink-0">
                        {editingId === entry.id ? (
                          <>
                            <button
                              type="button"
                              onClick={saveEdit}
                              disabled={submitting}
                              className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50"
                              title="저장"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              disabled={submitting}
                              className="p-2 text-neutral-400 hover:bg-neutral-700 rounded-lg transition-colors"
                              title="취소"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(entry)}
                              disabled={submitting}
                              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="수정"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(entry.id)}
                              disabled={submitting}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {editingId === entry.id ? (
                    <div className="mt-4">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        disabled={submitting}
                      />
                    </div>
                  ) : (
                    <p className="mt-4 text-neutral-300 whitespace-pre-wrap break-words">
                      {entry.content}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}
