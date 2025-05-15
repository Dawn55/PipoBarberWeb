import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function MessageConversation({
  conversation,
  users,
  currentUserId,
  onDeleteMessage,
  onDeleteConversation,
  onSendMessage,
}) {
  const [replyTitle, setReplyTitle] = useState("");
  const [replyText, setReplyText] = useState("");

  const handleSendReply = async (e) => {
    e.preventDefault();

    if (!replyTitle || !replyText.trim()) return;

    const success = await onSendMessage(replyTitle, replyText);

    if (success) {
      setReplyTitle("");
      setReplyText("");
    }
  };

  const sortedMessages = [...conversation.messages].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const findUser = (userId) => {
    return users.find((user) => user.id === parseInt(userId));
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="mb-4 pb-4 border-b border-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Mesajlaşma</h3>
            <p className="text-gray-400">
              {conversation.participants
                .map((userId) => {
                  const user = findUser(userId);
                  return user
                    ? `${user.name} ${user.surname}`
                    : "Bilinmeyen Kullanıcı";
                })
                .join(" ◆ ")}
            </p>
          </div>
          <button
            onClick={onDeleteConversation}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            title="Konuşmayı Sil"
          >
            Konuşmayı Sil
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-bold mb-2">Mesajlar</h4>
        <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-4">
          {sortedMessages.map((message) => {
            const sender = findUser(message.sender_id);
            const isSentByMe = message.sender_id === currentUserId;

            return (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  isSentByMe ? "bg-gray-700" : "bg-gray-800"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h5 className="font-medium flex items-center">
                      <span className="mr-2">{message.title}</span>
                    </h5>
                    <p className="text-xs text-gray-400 mb-1">
                      {sender
                        ? `${sender.name} ${sender.surname} (${sender.email})`
                        : "Bilinmeyen Kullanıcı"}
                      {sender && sender.isAdmin && (
                        <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                          Yönetici
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </span>
                    <button
                      onClick={() => onDeleteMessage(message.id)}
                      className="text-red-400 hover:text-red-300 text-xs"
                      title="Mesajı Sil"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <p className="text-sm">{message.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-bold mb-2">Yanıt Gönder</h4>
        <form onSubmit={handleSendReply}>
          <div className="mb-3">
            <input
              type="text"
              value={replyTitle}
              onChange={(e) => setReplyTitle(e.target.value)}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none"
              placeholder="Başlık"
              required
              maxLength={50}
            />
          </div>
          <div className="mb-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none min-h-20"
              placeholder="Mesajınızı yazın..."
              required
              maxLength={500}
            />
          </div>
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
}