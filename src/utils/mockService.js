// Frontend-only service boundary. Replace these functions with API calls when a backend is ready.
export const mockService = {
  saveStudent: async student => ({ ...student, id: student.id || `STU-${Math.floor(1000 + Math.random() * 8999)}` }),
  saveBooking: async booking => ({ ...booking, id: `BK-${Date.now()}`, status: 'Confirmed' }),
  saveAttendance: async entries => entries,
  recordPayment: async payment => ({ ...payment, status: 'Paid' }),
}
