export default function ChatsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl">Chats</h1>
        <p className="text-sm text-muted-foreground mt-1">AI chatbot conversations will appear here</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🤖</span>
        </div>
        <h2 className="font-display font-bold text-lg mb-2">AI Chatbot Coming Soon</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Once the AI chatbot is configured, all visitor conversations will appear here for your review.
        </p>
      </div>
    </div>
  )
}