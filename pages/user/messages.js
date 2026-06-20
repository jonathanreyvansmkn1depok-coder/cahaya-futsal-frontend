import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import Layout from '@/components/Layout';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { Send, ShieldAlert } from 'lucide-react';

export default function UserMessages() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !isAuthenticated) {
      router.push('/auth/login');
    } else if (user) {
      fetchMessages();
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await apiClient.get('/user/messages');
      setMessages(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat riwayat pesan');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await apiClient.post('/contact', {
        name: user?.name || 'User',
        email: user?.email || '',
        phone: user?.phone || '0000000000',
        subject: 'Pesan Bantuan Chat',
        message: newMessage,
      });
      
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      const errorData = error.response?.data;
      const errorMsg = errorData?.errors 
        ? Object.values(errorData.errors)[0][0] 
        : (errorData?.message || 'Gagal mengirim pesan');
      
      toast.error(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-light py-20 pt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-dark mb-6">Live Support</h1>

          <div className="bg-white rounded-xl shadow-lg flex flex-col h-[600px] border border-gray-100">
            {/* Header Chat */}
            <div className="bg-primary text-white p-4 rounded-t-xl flex items-center shadow-md z-10">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <ShieldAlert size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Admin Cahaya Futsal</h2>
                <p className="text-xs text-white/80">Biasanya membalas dalam beberapa jam</p>
              </div>
            </div>

            {/* Area Obrolan */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p>Mulai percakapan dengan Admin.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  // 🛠️ FIX CERDAS: Melacak semua kemungkinan nama database buatan Claude
                  let replyText = msg.reply_message || msg.admin_reply || msg.response || msg.admin_response || msg.balasan || '';
                  if (typeof msg.reply === 'string') replyText = msg.reply; // Jika namanya benar-benar 'reply'
                  
                  const isReplied = msg.status === 'replied' || msg.status === 'REPLIED';

                  return (
                    <div key={msg.id} className="space-y-4">
                      {/* Bubble Chat User (Kanan) */}
                      <div className="flex justify-end">
                        <div className="max-w-[75%] bg-primary text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm">
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-[10px] text-white/70 text-right mt-1">
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Bubble Chat Admin (Kiri) - MEMAKSA MUNCUL JIKA SUDAH DIBALAS */}
                      {isReplied && (
                        <div className="flex justify-start">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-auto">
                            <ShieldAlert size={14} className="text-gray-500" />
                          </div>
                          <div className="max-w-[75%] bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm">
                            {/* Menampilkan teks aslinya, atau pesan cadangan jika nama variabelnya masih beda */}
                            <p className="text-sm whitespace-pre-wrap">
                              {replyText || "Pesan telah dibalas oleh Admin. (Teks tidak terbaca)"}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {formatTime(msg.updated_at)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Chat */}
            <div className="p-4 bg-white border-t border-gray-100 rounded-b-xl">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan Anda di sini..."
                  className="flex-1 max-h-32 min-h-[44px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                  rows="1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-primary text-white p-3 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 mb-0.5"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={20} className="ml-1" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}