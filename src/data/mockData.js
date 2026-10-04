export const students = [
  { id: 'STU-1042', name: 'Ananya Kumar', email: 'ananya.k@email.com', phone: '+91 98765 43210', grade: 'Grade 10', tutor: 'Priya Sharma', status: 'Active', initials: 'AK', color: 'lilac' },
  { id: 'STU-1041', name: 'Rohan Mehta', email: 'rohan.m@email.com', phone: '+91 98765 43211', grade: 'Grade 8', tutor: 'Arjun Rao', status: 'Active', initials: 'RM', color: 'blue' },
  { id: 'STU-1039', name: 'Meera Iyer', email: 'meera.i@email.com', phone: '+91 98765 43212', grade: 'Grade 12', tutor: 'Neha Kapoor', status: 'Active', initials: 'MI', color: 'peach' },
  { id: 'STU-1037', name: 'Kabir Singh', email: 'kabir.s@email.com', phone: '+91 98765 43213', grade: 'Grade 9', tutor: 'Priya Sharma', status: 'Inactive', initials: 'KS', color: 'mint' },
  { id: 'STU-1034', name: 'Diya Patel', email: 'diya.p@email.com', phone: '+91 98765 43214', grade: 'Grade 11', tutor: 'Vikram Das', status: 'Active', initials: 'DP', color: 'rose' },
  { id: 'STU-1032', name: 'Aarav Nair', email: 'aarav.n@email.com', phone: '+91 98765 43215', grade: 'Grade 7', tutor: 'Arjun Rao', status: 'Active', initials: 'AN', color: 'gold' },
]
export const tutors = [
  { id: 'TUT-204', name: 'Priya Sharma', subject: 'Mathematics', experience: '8 years', email: 'priya.sharma@email.com', phone: '+91 98765 10001', availability: 'Mon – Sat', status: 'Available', initials: 'PS', color: 'lilac', rating: '4.9' },
  { id: 'TUT-203', name: 'Arjun Rao', subject: 'Physics', experience: '6 years', email: 'arjun.rao@email.com', phone: '+91 98765 10002', availability: 'Mon – Fri', status: 'Available', initials: 'AR', color: 'blue', rating: '4.8' },
  { id: 'TUT-202', name: 'Neha Kapoor', subject: 'Chemistry', experience: '10 years', email: 'neha.k@email.com', phone: '+91 98765 10003', availability: 'Tue – Sun', status: 'In session', initials: 'NK', color: 'peach', rating: '5.0' },
  { id: 'TUT-201', name: 'Vikram Das', subject: 'English', experience: '5 years', email: 'vikram.d@email.com', phone: '+91 98765 10004', availability: 'Mon – Sat', status: 'Available', initials: 'VD', color: 'mint', rating: '4.7' },
]
export const bookings = [
  { student: 'Ananya Kumar', tutor: 'Priya Sharma', subject: 'Mathematics', date: 'Today, Oct 08', time: '05:00 PM', status: 'Confirmed' },
  { student: 'Rohan Mehta', tutor: 'Arjun Rao', subject: 'Physics', date: 'Today, Oct 08', time: '06:00 PM', status: 'Confirmed' },
  { student: 'Meera Iyer', tutor: 'Neha Kapoor', subject: 'Chemistry', date: 'Tomorrow, Oct 09', time: '10:00 AM', status: 'Pending' },
  { student: 'Diya Patel', tutor: 'Vikram Das', subject: 'English', date: 'Tomorrow, Oct 09', time: '02:00 PM', status: 'Confirmed' },
]
export const payments = [
  { student: 'Ananya Kumar', fee: 'Monthly tuition', amount: 8500, due: 'Oct 12, 2026', status: 'Pending' },
  { student: 'Rohan Mehta', fee: 'Monthly tuition', amount: 7000, due: 'Oct 05, 2026', status: 'Overdue' },
  { student: 'Meera Iyer', fee: 'Monthly tuition', amount: 9500, due: 'Oct 01, 2026', status: 'Paid' },
  { student: 'Kabir Singh', fee: 'Monthly tuition', amount: 6500, due: 'Oct 15, 2026', status: 'Pending' },
]
export const attendanceSeed = [
  { student: 'Ananya Kumar', grade: 'Grade 10', status: 'Present' },
  { student: 'Rohan Mehta', grade: 'Grade 8', status: 'Present' },
  { student: 'Meera Iyer', grade: 'Grade 12', status: 'Late' },
  { student: 'Diya Patel', grade: 'Grade 11', status: 'Absent' },
]
export const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']
