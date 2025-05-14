export default function MessageList({ messages, currentUser }) {
  if (messages.length === 0) {
    return (
      <div className="bg-gray-800 rounded p-3 max-h-64 overflow-y-auto mb-4">
        <p className="text-gray-400 text-center py-4">
          Henüz mesaj yok
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded p-3 max-h-64 overflow-y-auto mb-4">
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="mb-4 p-3 bg-gray-700 rounded"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium">
                  {message.sender.name} {message.sender.surname}
                </span>
                {message.sender.isAdmin && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                    Yönetici
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(message.createdAt).toLocaleString("tr-TR")}
              </span>
            </div>
            <p className="mt-1">{message.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}