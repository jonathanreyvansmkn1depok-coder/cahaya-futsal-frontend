import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import Layout from '@/components/Layout';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Mail } from 'lucide-react';

export default function AdminMessages() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
    } else {
      fetchMessages();
    }
  }, [isAuthenticated, user, router]);

  const fetchMessages = async () => {
    try {
      const response = await apiClient.get('/admin/messages');
      setMessages(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat pesan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm('Yakin ingin menghapus pesan ini?')) return;
    try {
      await apiClient.delete(`/admin/messages/${messageId}`);
      toast.success('Pesan berhasil dihapus');
      fetchMessages();
    } catch (error) {
      toast.error('Gagal menghapus pesan');
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Balasan tidak boleh kosong');
      return;
    }

    try {
      await apiClient.post(`/admin/messages/${selectedMessage.id}/reply`, {
        response: replyText,
      });
      toast.success('Balasan terkirim');
      setReplyText('');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error('Gagal mengirim balasan');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <Layout>
      <div className="min-h-screen bg-light py-20 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-dark mb-8">Pesan Masuk</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Messages List */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow-lg">
                <div className="border-b p-4">
                  <h2 className="font-bold text-lg">Pesan ({messages.length})</h2>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`w-full text-left p-4 hover:bg-light transition-colors ${
                        selectedMessage?.id === msg.id ? 'bg-light' : ''
                      }`}
                    >
                      <p className="font-semibold text-sm">{msg.name}</p>
                      <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                      <span className={`text-xs font-semibold mt-2 inline-block px-2 py-1 rounded ${
                        msg.status === 'unread' ? 'bg-yellow-100 text-yellow-800' :
                        msg.status === 'read' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {msg.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-2">
                {selectedMessage ? (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">{selectedMessage.subject}</h2>
                    
                    <div className="bg-light p-4 rounded-lg mb-6">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Dari:</strong> {selectedMessage.name}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Email:</strong> {selectedMessage.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Telepon:</strong> {selectedMessage.phone || '-'}
                      </p>
                    </div>

                    <div className="mb-6 p-4 bg-white border border-gray-300 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>

                    {selectedMessage.admin_response ? (
                      <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg">
                        <p className="text-sm font-semibold text-green-800 mb-2">Balasan Admin:</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.admin_response}</p>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tulis Balasan
                        </label>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Tulis balasan Anda di sini"
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                        />
                        <button
                          onClick={handleReply}
                          className="mt-4 w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center"
                        >
                          <Mail size={18} className="mr-2" />
                          Kirim Balasan
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="w-full text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors font-semibold flex items-center justify-center"
                    >
                      <Trash2 size={18} className="mr-2" />
                      Hapus Pesan
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
                    <Mail size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Pilih pesan untuk melihat detail</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
