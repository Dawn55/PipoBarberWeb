import { useState, useEffect } from "react";
import { X, Send, User } from "lucide-react";
import { useSession } from "next-auth/react";

export default function MessageDrawer({ isOpen, onClose }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("inbox");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState({
    receiver_id: "",
    title: "",
    description: "",
  });
  const [receivers, setReceivers] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (isOpen && session) {
      fetchMessages();
      fetchReceivers();
    }
  }, [isOpen, activeTab, session]);

  const fetchMessages = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const endpoint =
        activeTab === "inbox" ? "/api/messages/received" : "/api/messages/sent";
      const res = await fetch(endpoint);

      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
      
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceivers = async () => {
    if (!session) return;

    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setReceivers(data.filter((user) => user.id !== session.user.id));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (
      !session ||
      !newMessage.receiver_id ||
      !newMessage.title ||
      !newMessage.description
    ) {
      alert("Lütfen tüm alanları doldurunuz");
      return;
    }

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (res.ok) {
        setNewMessage({
          receiver_id: "",
          title: "",
          description: "",
        });
        alert("Mesaj başarıyla gönderildi");

        // If we're viewing sent messages, refresh the list
        if (activeTab === "sent") {
          fetchMessages();
        }
      } else {
        alert("Mesaj gönderilemedi");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Mesaj gönderilirken bir hata oluştu");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Function to display message details directly in the list instead of a separate view
  const renderMessageContent = (message) => {
    return (
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between mb-2">
          <h3 className="font-bold text-lg">{message.title}</h3>
          <span className="text-xs text-gray-400">
            {formatDate(message.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-4 text-sm">
          <User size={16} className="text-gray-400" />
          <span>
            {activeTab === "inbox"
              ? `${message.sender?.name} ${message.sender?.surname}`
              : `${message.receiver?.name} ${message.receiver?.surname}`}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-gray-300">
          {message.description}
        </p>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-96 bg-primary-dark z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Mesajlar</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-3 font-medium ${
              activeTab === "inbox"
                ? "text-blue-800 border-b-2 border-blue-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("inbox");
              setSelectedMessage(null);
            }}
          >
            Gelen Kutusu
          </button>
          <button
            className={`flex-1 py-3 font-medium ${
              activeTab === "sent"
                ? "text-blue-800 border-b-2 border-blue-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("sent");
              setSelectedMessage(null);
            }}
          >
            Gönderilen
          </button>
          <button
            className={`flex-1 py-3 font-medium ${
              activeTab === "new"
                ? "text-blue-800 border-b-2 border-blue-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("new");
              setSelectedMessage(null);
            }}
          >
            Yeni Mesaj
          </button>
        </div>

        
        <div className="h-[calc(100%-110px)] overflow-y-auto">
          {!session ? (
            <div className="p-6 text-center">
              <p>Mesajlarınızı görüntülemek için lütfen giriş yapın.</p>
            </div>
          ) : loading ? (
            <div className="p-6 text-center">
              <p>Yükleniyor...</p>
            </div>
          ) : activeTab === "new" ? (
            <div className="p-4">
              <form onSubmit={handleSendMessage}>
                <div className="mb-4">
                  <label
                    htmlFor="receiver_id"
                    className="block mb-1 font-medium"
                  >
                    Alıcı
                  </label>
                  <select
                    id="receiver_id"
                    name="receiver_id"
                    value={newMessage.receiver_id}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
                    required
                  >
                    <option value="">Alıcı seçin</option>
                    {receivers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} {user.surname}{" "}
                        {user.isAdmin ? "(Admin)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="title" className="block mb-1 font-medium">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newMessage.title}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
                    maxLength={50}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block mb-1 font-medium"
                  >
                    Mesaj
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newMessage.description}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white min-h-32"
                    maxLength={500}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/80 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <Send size={18} />
                  Gönder
                </button>
              </form>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-6 text-center">
              <p>Mesaj bulunamadı.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {messages.map((message) => (
                <div key={message.id} className="bg-gray-900">
                  <div 
                    className="p-4 bg-gray-900 hover:bg-gray-800"
                    onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
                  >
                    <div className="flex justify-between mb-1">
                      <h3 className="font-bold truncate flex-1">
                        {message.title}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <User size={14} className="text-gray-400" />
                      <span>
                        {activeTab === "inbox"
                          ? `${message.sender?.name} ${message.sender?.surname}`
                          : `${message.receiver?.name} ${message.receiver?.surname}`}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {message.description}
                    </p>
                  </div>
                  
                  
                  {selectedMessage?.id === message.id && (
                    <div className="bg-gray-800 p-4 border-t border-gray-700">
                      <p className="whitespace-pre-wrap text-gray-200">{message.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}