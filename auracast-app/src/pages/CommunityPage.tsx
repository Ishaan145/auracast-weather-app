import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send, User, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCommunityMessages } from '../hooks/useCommunityMessages';
import { formatDistanceToNow } from 'date-fns';
import { WeatherAnimatedBackground } from '../components/WeatherAnimatedBackground';
import { useToast } from '../hooks/use-toast';

const CommunityPage = () => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage, likeMessage } = useCommunityMessages();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [likedMessages, setLikedMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      try {
        await sendMessage(user.id, user.name, newMessage.trim());
        setNewMessage('');
        toast({
          title: "Message sent",
          description: "Your message has been posted to the community.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLikeMessage = async (messageId: string, currentLikes: number) => {
    if (likedMessages.includes(messageId)) return;
    
    try {
      await likeMessage(messageId, currentLikes);
      setLikedMessages(prev => [...prev, messageId]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <WeatherAnimatedBackground />
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Community Hub
            </h1>
            <p className="text-xl text-muted-foreground mt-6 leading-relaxed">
              Connect with fellow planners, share experiences, and discuss climatological insights
            </p>
          </motion.div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-8 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-3xl font-bold text-primary">{messages.length}</div>
              <div className="text-muted-foreground text-sm">Community Messages</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl font-bold text-primary">
                {messages.reduce((sum, msg) => sum + (msg.likes || 0), 0)}
              </div>
              <div className="text-muted-foreground text-sm">Total Likes</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl font-bold text-primary">150+</div>
              <div className="text-muted-foreground text-sm">Active Members</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground text-sm">Community Support</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Live Community Chat</h2>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-6 space-y-4 bg-background">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No messages yet. Be the first to post!</p>
                  </div>
                ) : messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-start space-x-3 ${
                      user && message.user_name === user.name ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        user && message.user_name === user.name 
                          ? 'bg-gradient-to-br from-primary to-accent' 
                          : 'bg-gradient-to-br from-muted-foreground to-muted'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 max-w-xs sm:max-w-md ${
                      user && message.user_name === user.name ? 'text-right' : ''
                    }`}>
                      <div className={`flex items-baseline space-x-2 mb-1 ${
                        user && message.user_name === user.name ? 'justify-end' : ''
                      }`}>
                        <span className="font-semibold text-sm">{message.user_name}</span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimestamp(message.created_at)}
                        </span>
                      </div>
                      
                      <div className={`rounded-lg p-3 ${
                        user && message.user_name === user.name
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                      </div>

                      {/* Like Button */}
                      <div className={`mt-2 flex items-center space-x-2 ${
                        user && message.user_name === user.name ? 'justify-end' : ''
                      }`}>
                        <button
                          onClick={() => handleLikeMessage(message.id, message.likes)}
                          disabled={likedMessages.includes(message.id)}
                          className={`flex items-center space-x-1 text-xs rounded-full px-2 py-1 transition-colors ${
                            likedMessages.includes(message.id)
                              ? 'bg-red-100 text-red-600 cursor-default'
                              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${
                            likedMessages.includes(message.id) ? 'fill-current' : ''
                          }`} />
                          <span>{message.likes}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-border bg-muted/20">
                {user ? (
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Share your experience or ask a question..."
                      className="flex-1 input"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="btn btn-primary flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Please log in to join the conversation
                    </p>
                    <a href="#login" className="btn btn-primary">
                      Sign In
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Community Guidelines</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card p-6 space-y-4">
                <h3 className="text-xl font-semibold text-green-600">✓ Encouraged</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Share your outdoor planning experiences</li>
                  <li>• Ask questions about risk assessment</li>
                  <li>• Discuss climate trends and impacts</li>
                  <li>• Help fellow community members</li>
                  <li>• Provide constructive feedback</li>
                </ul>
              </div>
              
              <div className="card p-6 space-y-4">
                <h3 className="text-xl font-semibold text-red-600">✗ Please Avoid</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Spam or promotional content</li>
                  <li>• Off-topic discussions</li>
                  <li>• Personal attacks or harassment</li>
                  <li>• Misinformation about climate data</li>
                  <li>• Sharing sensitive personal information</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;