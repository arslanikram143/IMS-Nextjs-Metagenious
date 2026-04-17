"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, User, Brain, BookOpen, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "react-toastify";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  subject?: string;
  helpful?: boolean;
}

interface AITutorChatbotProps {
  studentId?: string;
  subjectId?: string;
  courseId?: string;
}

const AITutorChatbot: React.FC<AITutorChatbotProps> = ({
  studentId,
  subjectId,
  courseId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI tutor. I can help you with questions about your subjects, explain concepts, and guide you through difficult topics. What would you like to learn about today?",
      timestamp: new Date(),
      subject: "General",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      subject: subject || "General",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Simulate API call to AI tutor service
      const response = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          studentId,
          subjectId,
          courseId,
          chatHistory: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          subject: data.subject || subject || "General",
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        toast.error(data.error || "Failed to get response from AI tutor");
        
        // Fallback response
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I understand you're asking about: \"" + input + "\". Based on your curriculum, this topic covers important concepts that you should review in your textbook chapter 3. Would you like me to explain any specific part in more detail?",
          timestamp: new Date(),
          subject: subject || "General",
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Connection error. Please try again.");
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check your internet connection or try again in a moment. In the meantime, you might want to review the related material in your course resources.",
        timestamp: new Date(),
        subject: subject || "General",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFeedback = (messageId: string, helpful: boolean) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, helpful } : msg
      )
    );
    
    // Send feedback to backend
    fetch("/api/ai/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageId,
        helpful,
      }),
    }).catch(console.error);
    
    toast.success(`Feedback recorded: ${helpful ? "Helpful" : "Not helpful"}`);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const clearChat = () => {
    if (confirm("Clear chat history? This cannot be undone.")) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm your AI tutor. I can help you with questions about your subjects, explain concepts, and guide you through difficult topics. What would you like to learn about today?",
          timestamp: new Date(),
          subject: "General",
        },
      ]);
    }
  };

  const quickQuestions = [
    "Explain Newton's laws of motion",
    "What is photosynthesis?",
    "Help me solve this math problem: 2x + 5 = 15",
    "What are the main themes in Shakespeare's Macbeth?",
    "Explain the water cycle",
    "What is the difference between mitosis and meiosis?",
  ];

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Computer Science",
    "General",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Tutor</h2>
            <p className="text-sm text-gray-600">24/7 curriculum-aware assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          >
            <option value="">Select Subject</option>
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Quick Questions
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {question.length > 30 ? question.substring(0, 30) + "..." : question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 rounded-bl-none"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4 text-purple-600" />
                  )}
                  <span className="text-xs font-medium">
                    {message.role === "user" ? "You" : "AI Tutor"}
                    {message.subject && ` • ${message.subject}`}
                  </span>
                  <span className="text-xs opacity-75 ml-auto">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="whitespace-pre-line">{message.content}</div>
                
                {message.role === "assistant" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleFeedback(message.id, true)}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                        message.helpful === true
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Helpful
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, false)}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                        message.helpful === false
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                      Not helpful
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-white border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium">AI Tutor</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t pt-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask your question here... (Press Enter to send, Shift+Enter for new line)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
              rows={2}
              disabled={loading}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {input.length}/1000
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="self-end px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send
              </>
            )}
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
          <MessageCircle className="w-3 h-3" />
          <span>
            AI Tutor is trained on your curriculum. Questions are scoped to your enrolled subjects.
            <button className="ml-2 text-purple-600 hover:text-purple-700">
              Escalate to teacher
            </button>
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">Messages</div>
            <div className="text-lg font-bold text-gray-900">{messages.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Helpful Responses</div>
            <div className="text-lg font-bold text-gray-900">
              {messages.filter(m => m.helpful === true).length}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Subjects Covered</div>
            <div className="text-lg font-bold text-gray-900">
              {new Set(messages.map(m => m.subject)).size}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorChatbot;