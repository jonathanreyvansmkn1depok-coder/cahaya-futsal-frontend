import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import Layout from '@/components/Layout';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CourtsManagement() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_hour: '',
    capacity: '',
  });

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
    } else {
      fetchCourts();
    }
  }, [isAuthenticated, user, router]);

  const fetchCourts = async () => {
    try {
      const response = await apiClient.get('/admin/courts');
      setCourts(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat data lapangan');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourt = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price_per_hour: '', capacity: '' });
    setShowModal(true);
  };

  const handleEditCourt = (court) => {
    setEditingId(court.id);
    setFormData({
      name: court.name,
      description: court.description,
      price_per_hour: court.price_per_hour,
      capacity: court.capacity,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/admin/courts/${editingId}`, formData);
        toast.success('Lapangan berhasil diperbarui');
      } else {
        await apiClient.post('/admin/courts', formData);
        toast.success('Lapangan berhasil ditambahkan');
      }
      setShowModal(false);
      fetchCourts();
    } catch (error) {
      toast.error('Gagal menyimpan lapangan');
    }
  };

  const handleDeleteCourt = async (id) => {
    if (!confirm('Yakin ingin menghapus lapangan ini?')) return;
    try {
      await apiClient.delete(`/admin/courts/${id}`);
      toast.success('Lapangan berhasil dihapus');
      fetchCourts();
    } catch (error) {
      toast.error('Gagal menghapus lapangan');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <Layout>
      <div className="min-h-screen bg-light py-20 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-dark">Kelola Lapangan</h1>
            <button
              onClick={handleAddCourt}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all"
            >
              <Plus size={20} />
              Tambah Lapangan
            </button>
          </div>

          {/* Courts Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : courts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">Tidak ada lapangan</div>
            ) : (
              <table className="w-full">
                <thead className="bg-light border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Harga/Jam</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Kapasitas</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {courts.map((court) => (
                    <tr key={court.id} className="border-b hover:bg-light transition-colors">
                      <td className="px-6 py-3">{court.name}</td>
                      <td className="px-6 py-3">Rp {parseInt(court.price_per_hour).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-3">{court.capacity} orang</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCourt(court)}
                            className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourt(court.id)}
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

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit' : 'Tambah'} Lapangan</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama Lapangan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                  <textarea
                    placeholder="Deskripsi"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                    rows={3}
                  />
                  <input
                    type="number"
                    placeholder="Harga per Jam"
                    value={formData.price_per_hour}
                    onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Kapasitas"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
