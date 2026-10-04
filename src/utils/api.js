const API_BASE = 'http://localhost:8080/api';

export async function getAvailability(tutorId = 1) {
    const response = await fetch(
        `${API_BASE}/availability?tutorId=${tutorId}`
    );

    if (!response.ok) {
        throw new Error('Failed to load availability');
    }

    return response.json();
}

export async function getStudentBookings(studentId = 1) {
    const response = await fetch(
        `${API_BASE}/bookings?studentId=${studentId}`
    );

    if (!response.ok) {
        throw new Error('Failed to load bookings');
    }

    return response.json();
}

export async function bookSlot(
    studentId,
    tutorId,
    availabilityId
) {
    const response = await fetch(
        `${API_BASE}/bookings?studentId=${studentId}&tutorId=${tutorId}&availabilityId=${availabilityId}`,
        {
            method: 'POST'
        }
    );

    return response.json();
}

export async function cancelBooking(bookingId) {
    const response = await fetch(
        `${API_BASE}/bookings/cancel?bookingId=${bookingId}`,
        {
            method: 'POST'
        }
    );

    return response.json();
}

export async function rescheduleBooking(
    bookingId,
    newAvailabilityId
) {
    const response = await fetch(
        `${API_BASE}/bookings/reschedule?bookingId=${bookingId}&newAvailabilityId=${newAvailabilityId}`,
        {
            method: 'POST'
        }
    );

    return response.json();
}