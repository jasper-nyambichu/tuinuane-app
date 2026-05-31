import { requireAdmin } from '../../../../lib/auth'

export default async function ChatsPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900">Chats</h1>
        <p className="text-sm text-gray-500 mt-0.5">AI chatbot conversations</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4 text-2xl">
          🤖
        </div>
        <h2 className="font-semibold text-gray-900 text-lg mb-2">AI Chatbot Coming Soon</h2>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          Once configured, all visitor conversations will appear here for your review.
        </p>
      </div>
    </div>
  )
}