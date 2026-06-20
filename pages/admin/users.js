import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import Layout from '@/components/Layout';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, user, router]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await apiClient.put(`/admin/users/${userId}/toggle-active`);
      toast.success('Status user berhasil diubah');
      fetchUsers();
    } catch (error) {
      toast.error('Gagal mengubah status user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      toast.success('User berhasil dihapus');
      fetchUsers();
    } catch (error) {
      toast.error('Gagal menghapus user');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <Layout>
      <div className="min-h-screen bg-light py-20 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-dark mb-8">Kelola User</h1>

          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">Tidak ada user</div>
            ) : (
              <table className="w-full">
                <thead className="bg-light border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-light transition-colors">
                      <td className="px-6 py-3">{u.name}</td>
                      <td className="px-6 py-3">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleActive(u.id)}
                            className="text-yellow-500 hover:bg-yellow-100 px-3 py-1 rounded-lg transition-colors text-sm font-semibold"
                          >
                            {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
