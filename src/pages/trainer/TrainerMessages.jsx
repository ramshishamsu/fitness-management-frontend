import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../api/axios";
import { Send, User, MessageCircle, RefreshCw } from "lucide-react";

const POLL_INTERVAL = 10000;

const TrainerMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const pollRef = useRef(null);
  const bottomRef = useRef(null);

  // Load conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Poll messages when conversation selected
  useEffect(() => {
    if (!selectedConversation) return;

    loadMessages(selectedConversation._id);

    // Only poll if tab is visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(pollRef.current);
      } else {
        pollRef.current = setInterval(() => {
          loadMessages(selectedConversation._id);
        }, POLL_INTERVAL);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    pollRef.current = setInterval(() => {
      loadMessages(selectedConversation._id);
    }, POLL_INTERVAL);

    return () => {
      clearInterval(pollRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedConversation]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // API Functions
  const fetchConversations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      const res = await axiosInstance.get("/messages/conversations");
      console.log("Trainer conversations:", res.data);
      setConversations(res.data || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      console.log("Trainer sending message:", {
        conversationId: selectedConversation._id,
        receiverId: selectedConversation.participant.userId,
        content: newMessage.trim()
      });
      
      const res = await axiosInstance.post("/messages", {
        conversationId: selectedConversation._id,
        receiverId: selectedConversation.participant.userId,
        content: newMessage.trim()
      });

      console.log("Trainer message sent:", res.data);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Client Messages</h1>
          <p className="text-neutral-400">Chat with your clients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Clients</h2>
              <button
                onClick={() => fetchConversations(true)}
                className="p-2 text-gray-400 hover:text-white transition disabled:opacity-50"
                title="Refresh conversations"
                disabled={refreshing}
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              </button>
            </div>

            {conversations.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <User size={48} className="mx-auto mb-4" />
                <p>No client conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-3 rounded-lg cursor-pointer mb-2 transition-all ${
                    selectedConversation?._id === conv._id
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {conv.participant.name}
                      </p>
                      <p className="text-xs opacity-70 truncate">
                        {conv.lastMessage?.content || "Start chatting"}
                      </p>
                    </div>
                    <div className="text-xs opacity-60">
                      {conv.lastMessage?.createdAt 
                        ? formatTime(conv.lastMessage.createdAt)
                        : ''
                      }
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-neutral-800 rounded-lg flex flex-col h-[600px]">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <User size={48} className="mx-auto mb-4" />
                  <p>Select a client conversation to start messaging</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-neutral-700">
                  <h3 className="font-semibold">
                    {selectedConversation.participant.name}
                  </h3>
                  <p className="text-sm opacity-70">Client</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <User size={32} className="mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-400 text-sm">
                        No messages yet. Wait for client to message!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isTrainer =
                        msg.sender._id !==
                        selectedConversation.participant.userId;

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
                                ? "bg-blue-600 text-white"
                                : "bg-neutral-700 text-white"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-60 text-right mt-1">
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-neutral-700">
                  {error && (
                    <div className="mb-2 p-2 bg-red-900/50 border border-red-500 rounded">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Type your message..."
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sending || !newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {sending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerMessages;