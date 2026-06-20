import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => set({ user, token, isAuthenticated: !!token }),
  
  logout: () => set({ user: null, token: null, isAuthenticated: false }),

  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        // 🛡️ Mencegah perulangan render (Infinite Loop) jika status sudah terverifikasi login
        if (!get().isAuthenticated) {
          set({ 
            token, 
            user: JSON.parse(user), 
            isAuthenticated: true 
          });
        }
      }
    }
  },

  saveToStorage: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },
}));

export const useBookingStore = create((set, get) => ({
  bookings: [],
  selectedCourt: null,
  bookingForm: {
    courtId: null,
    bookingDate: null,
    startTime: null,
    endTime: null,
  },

  setBookings: (bookings) => set({ bookings }),
  setSelectedCourt: (court) => set({ selectedCourt: court }),
  setBookingForm: (form) => set({ bookingForm: form }),
  
  resetBookingForm: () => set({
    bookingForm: {
      courtId: null,
      bookingDate: null,
      startTime: null,
      endTime: null,
    },
  }),
}));

export const useCourtsStore = create((set) => ({
  courts: [],
  loading: false,
  error: null,

  setCourts: (courts) => set({ courts }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));