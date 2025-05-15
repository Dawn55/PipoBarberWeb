import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import MessageConversation from "@/components/adminPanel/AdminMessageConversation";

export default function AdminMessageList({
  messages,
  users,
  currentUserId,
  onDeleteMessage,
  onSendMessage,
}) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [refresh, setRefresh] = useState(0); 

  
  const refreshPage = () => {
    setRefresh(prev => prev + 1);
  };

  
  const handleDeleteMessage = async (messageId) => {
    const success = await onDeleteMessage(messageId);
    if (success) {
      refreshPage();
    }
    return success;
  };

  
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (
      !selectedConversation?.otherUserId ||
      !messageTitle ||
      !messageText.trim()
    )
      return;

    const success = await onSendMessage({
      receiver_id: selectedConversation.otherUserId,
      title: messageTitle,
      description: messageText,
    });

    if (success) {
      setMessageTitle("");
      setMessageText("");
      setShowNewMessage(false);
      refreshPage();
    }
  };

  const conversations = [];
  const conversationMap = new Map();

  messages.forEach((message) => {
    const user1 = Math.min(message.sender_id, message.receiver_id);
    const user2 = Math.max(message.sender_id, message.receiver_id);
    const convKey = `${user1}-${user2}`;

    if (!conversationMap.has(convKey)) {
      const convo = {
        id: convKey,
        participants: [message.sender_id, message.receiver_id],
        otherUserId:
          message.sender_id === currentUserId
            ? message.receiver_id
            : message.sender_id,
        messages: [],
      };
      conversationMap.set(convKey, convo);
      conversations.push(convo);
    }

    conversationMap.get(convKey).messages.push(message);
  });

  conversations.forEach((convo) => {
    convo.messages.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  });

  conversations.sort((a, b) => {
    if (a.messages.length === 0) return 1;
    if (b.messages.length === 0) return -1;
    return (
      new Date(b.messages[0].createdAt) - new Date(a.messages[0].createdAt)
    );
  });

  const findUser = (userId) => {
    return users.find((user) => user.id === parseInt(userId));
  };

  const getParticipantNames = (participants) => {
    return participants
      .map((userId) => {
        const user = findUser(userId);
        return user ? `${user.name} ${user.surname}` : "Bilinmeyen Kullanıcı";
      })
      .join(" ◆ ");
  };

  const handleDeleteConversation = async (conversationId) => {
    if (
      !confirm(
        "Bu konuşmaya ait tüm mesajları silmek istediğinize emin misiniz? Bu işlem geri alınamaz!"
      )
    ) {
      return;
    }

    const conversation = conversationMap.get(conversationId);
    if (!conversation) return;

    const deletePromises = conversation.messages.map((msg) =>
      onDeleteMessage(msg.id)
    );
    try {
      await Promise.all(deletePromises);
      setSelectedConversation(null);
      refreshPage();
    } catch (error) {
      console.error("Mesajlar silinirken hata oluştu:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mesajlar</h2>
          <button
            onClick={() => {
              setShowNewMessage(true);
              setSelectedConversation(null);
            }}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
          >
            Yeni Mesaj
          </button>
        </div>

        {conversations.length === 0 ? (
          <p className="text-gray-400">Mesaj bulunamadı.</p>
        ) : (
          <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
            {conversations.map((conversation) => {
              if (conversation.messages.length === 0) return null;

              const latestMessage = conversation.messages[0];

              return (
                <li
                  key={conversation.id}
                  className={`p-3 ${
                    selectedConversation?.id === conversation.id
                      ? "bg-gray-700"
                      : "bg-gray-800 hover:bg-gray-700"
                  } rounded cursor-pointer`}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setShowNewMessage(false);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <p className="font-medium">
                        {getParticipantNames(conversation.participants)}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {latestMessage.title}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(latestMessage.createdAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="md:col-span-2">
        {showNewMessage ? (
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Yeni Mesaj</h3>
              <button
                onClick={() => setShowNewMessage(false)}
                className="text-gray-400 hover:text-white"
              >
                İptal
              </button>
            </div>

            <form onSubmit={handleSendMessage}>
              <div className="mb-4">
                <label className="block text-gray-400 mb-1">Alıcı</label>
                <select
                  value={selectedConversation?.otherUserId || ""}
                  onChange={(e) => {
                    const userId = e.target.value;
                    if (userId) {
                      const user1 = Math.min(currentUserId, parseInt(userId));
                      const user2 = Math.max(currentUserId, parseInt(userId));
                      const convKey = `${user1}-${user2}`;

                      let convo = conversationMap.get(convKey);
                      if (!convo) {
                        convo = {
                          id: convKey,
                          participants: [currentUserId, parseInt(userId)],
                          otherUserId: parseInt(userId),
                          messages: [],
                        };
                      }
                      setSelectedConversation(convo);
                    } else {
                      setSelectedConversation(null);
                    }
                  }}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none"
                  required
                >
                  <option value="">Alıcı seçin</option>
                  {users
                    .filter((user) => user.id !== currentUserId)
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} {user.surname} ({user.email})
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-1">Başlık</label>
                <input
                  type="text"
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none"
                  placeholder="Mesaj başlığı"
                  required
                  maxLength={50}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-1">Mesaj</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none min-h-32"
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
        ) : selectedConversation ? (
          <MessageConversation
            conversation={selectedConversation}
            users={users}
            currentUserId={currentUserId}
            onDeleteMessage={handleDeleteMessage}
            onDeleteConversation={() =>
              handleDeleteConversation(selectedConversation.id)
            }
            onSendMessage={(title, text) => {
              const result = onSendMessage({
                receiver_id: selectedConversation.otherUserId,
                title,
                description: text,
              });
              if (result) {
                refreshPage();
              }
              return result;
            }}
          />
        ) : (
          <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-center h-full text-gray-400">
            <p>
              Detayları görmek için bir mesaj seçin veya yeni bir mesaj
              oluşturun
            </p>
          </div>
        )}
      </div>
    </div>
  );
}