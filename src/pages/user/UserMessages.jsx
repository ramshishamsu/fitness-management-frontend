import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { Send, MessageCircle, User, ArrowLeft } from "lucide-react";
import UserLayout from "../../components/common/UserLayout";

const UserMessages = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-select conversation if trainerId is provided
  useEffect(() => {
    if (trainerId && conversations.length > 0) {
      const trainerConv = conversations.find(conv => conv.trainer._id === trainerId);
      if (trainerConv) {
        setSelectedConversation(trainerConv);
      } else {
        // Create new conversation with trainer
        createConversationWithTrainer(trainerId);
      }
    }
  }, [trainerId, conversations]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const res = await axiosInstance.get("/messages/conversations");
      setConversations(res.data || []);
      console.log("✅ Conversations loaded:", res.data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const createConversationWithTrainer = async (trainerId) => {
    try {
      const res = await axiosInstance.post("/messages/conversation", {
        trainerId: trainerId
      });
      
      const newConv = res.data;
      setConversations(prev => [...prev, newConv]);
      setSelectedConversation(newConv);
      console.log("✅ New conversation created:", newConv);
    } catch (err) {
      console.error("Failed to create conversation:", err);
      setError("Failed to start conversation");
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const res = await axiosInstance.get(`/messages/conversation/${conversationId}`);
      setMessages(res.data || []);
      console.log("✅ Messages loaded:", res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      const res = await axiosInstance.post("/messages", {
        conversationId: selectedConversation._id,
        content: newMessage.trim(),
        receiverId: selectedConversation.trainer._id
      });

      setMessages(prev => [...prev, res.data]);
      setNewMessage("");
      console.log("✅ Message sent:", res.data);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            {trainerId && (
              <button
                onClick={() => navigate('/user/messages')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <ArrowLeft size={20} />
                Back to all messages
              </button>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white">Messages</h1>
          <p className="text-neutral-400">Communicate securely with your trainers</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-neutral-400 mt-4">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error</h3>
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4 text-white">Conversations</h2>
              <div className="space-y-2">
                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="mx-auto mb-4 text-gray-600" size={48} />
                    <p className="text-neutral-500 text-sm">
                      No conversations yet. Book an appointment to start messaging!
                    </p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv._id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedConversation?._id === conv._id
                          ? "bg-blue-600 text-white"
                          : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-600 rounded-full flex items-center justify-center">
                          <User size={20} className="text-neutral-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">
                            {conv.trainer?.userId?.name || 'Trainer'}
                          </h3>
                          <p className="text-xs opacity-75 truncate">
                            {conv.lastMessage?.content || 'Start conversation'}
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
            </div>

            {/* Messages Area */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <div className="bg-neutral-900 rounded-lg border border-neutral-700 h-[600px] flex flex-col">
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-neutral-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {selectedConversation.trainer?.userId?.name || 'Trainer'}
                        </h3>
                        <p className="text-sm text-neutral-400">
                          {selectedConversation.trainer?.specialization || 'Fitness Trainer'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="mx-auto mb-4 text-gray-600" size={32} />
                        <p className="text-neutral-500 text-sm">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message._id}
                          className={`flex ${
                            message.sender._id === selectedConversation.trainer._id
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.sender._id === selectedConversation.trainer._id
                                ? "bg-neutral-800 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-60 mt-1">
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-neutral-700">
                    {error && (
                      <p className="text-red-400 text-sm mb-2">{error}</p>
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
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-blue-500 focus:outline-none"
                        disabled={sendingMessage}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={sendingMessage || !newMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        {sendingMessage ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Send size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-900 rounded-lg border border-neutral-700 h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="mx-auto mb-4 text-neutral-600" size={48} />
                    <h3 className="text-xl font-semibold text-neutral-400 mb-2">Select a Conversation</h3>
                    <p className="text-neutral-500">
                      Choose a conversation from the left to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserMessages;