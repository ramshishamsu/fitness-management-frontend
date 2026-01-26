import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { Send, MessageCircle, User } from "lucide-react";

const POLL_INTERVAL = 3000;

const TrainerMessages = () => {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const pollRef = useRef(null);
  const bottomRef = useRef(null);

  /* ----------------------------------
     LOAD CONVERSATIONS
  ---------------------------------- */
  useEffect(() => {
    fetchConversations();
  }, []);

  /* ----------------------------------
     POLLING MESSAGES
  ---------------------------------- */
  useEffect(() => {
    if (!selectedConversation) return;

    loadMessages(selectedConversation._id);

    pollRef.current = setInterval(() => {
      loadMessages(selectedConversation._id);
    }, POLL_INTERVAL);

    return () => clearInterval(pollRef.current);
  }, [selectedConversation]);

  /* ----------------------------------
     AUTO SCROLL
  ---------------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ----------------------------------
     API FUNCTIONS
  ---------------------------------- */
  const fetchConversations = async () => {
    try {
      const res = await axiosInstance.get("/messages/conversations");
      setConversations(res.data || []);
    } catch (err) {
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const res = await axiosInstance.get(
        `/messages/conversation/${conversationId}`
      );

      setMessages((prev) =>
        prev.length === res.data.length ? prev : res.data
      );
    } catch {
      setError("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);

      const res = await axiosInstance.post("/messages", {
        conversationId: selectedConversation._id,
        receiverId: selectedConversation.lastMessage.sender._id,
        content: newMessage.trim()
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  /* ----------------------------------
     UTILS
  ---------------------------------- */
  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  /* ----------------------------------
     UI
  ---------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-neutral-900">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Client Messages</h1>
          <p className="text-sm text-neutral-400">
            Chat with your clients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CONVERSATIONS */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Conversations</h2>

            {conversations.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => {
                const client =
                  conv.lastMessage.sender._id ===
                  conv.trainer.userId._id
                    ? conv.lastMessage.receiver
                    : conv.lastMessage.sender;

                return (
                  <div
                    key={conv._id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-3 rounded-lg cursor-pointer mb-2 ${
                      selectedConversation?._id === conv._id
                        ? "bg-blue-600"
                        : "bg-neutral-800 hover:bg-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                        <User size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {client?.name || "Client"}
                        </p>
                        <p className="text-xs opacity-70 truncate">
                          {conv.lastMessage?.content}
                        </p>
                      </div>
                      <div className="text-xs opacity-60">
                        {formatTime(conv.lastMessage.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* CHAT */}
          <div className="lg:col-span-2 bg-neutral-800 rounded-lg flex flex-col h-[600px]">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation
              </div>
            ) : (
              <>
                {/* HEADER */}
                <div className="p-4 border-b border-neutral-700">
                  <h3 className="font-semibold">
                    Client Conversation
                  </h3>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => {
                    const isTrainer =
                      msg.sender._id ===
                      selectedConversation.trainer.userId._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isTrainer ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-lg max-w-xs ${
                            isTrainer
                              ? "bg-blue-600"
                              : "bg-neutral-700"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-60 text-right mt-1">
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* INPUT */}
                <div className="p-4 border-t border-neutral-700 flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 bg-neutral-700 rounded-lg px-4 py-2 outline-none"
                    placeholder="Type a message..."
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="bg-blue-600 px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
};

export default TrainerMessages;
