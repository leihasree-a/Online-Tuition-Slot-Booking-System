import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class BookingManager {

    // ==========================================
    // BOOK A SLOT
    // ==========================================
    public static boolean bookSlot(Booking booking) {

        Connection con = null;

        try {
            con = DBConnection.getConnection();

            // Check whether availability exists
            String checkSql =
                    "SELECT availability_id, tutor_id, available_date, " +
                    "start_time, end_time, status " +
                    "FROM availability " +
                    "WHERE availability_id = ?";

            PreparedStatement checkPs =
                    con.prepareStatement(checkSql);

            checkPs.setInt(1, booking.getAvailabilityId());

            System.out.println(
                    "Checking availability ID: "
                    + booking.getAvailabilityId()
            );

            ResultSet rs = checkPs.executeQuery();

            if (!rs.next()) {

                System.out.println(
                        "No availability record found for ID: "
                        + booking.getAvailabilityId()
                );

                rs.close();
                checkPs.close();

                return false;
            }

            int availabilityId =
                    rs.getInt("availability_id");

            int tutorId =
                    rs.getInt("tutor_id");

            String status =
                    rs.getString("status");

            System.out.println(
                    "Found availability ID: "
                    + availabilityId
            );

            System.out.println(
                    "Tutor ID: "
                    + tutorId
            );

            System.out.println(
                    "Status: "
                    + status
            );

            rs.close();
            checkPs.close();

            // Check whether slot is available
            if (!"AVAILABLE".equalsIgnoreCase(status)) {

                System.out.println(
                        "Slot is not available. Current status: "
                        + status
                );

                return false;
            }

            // Check for duplicate booking
            String conflictSql =
                    "SELECT booking_id FROM bookings " +
                    "WHERE availability_id = ? " +
                    "AND status = 'BOOKED'";

            PreparedStatement conflictPs =
                    con.prepareStatement(conflictSql);

            conflictPs.setInt(
                    1,
                    booking.getAvailabilityId()
            );

            ResultSet conflictRs =
                    conflictPs.executeQuery();

            if (conflictRs.next()) {

                System.out.println(
                        "Booking conflict! Slot is already booked."
                );

                conflictRs.close();
                conflictPs.close();

                return false;
            }

            conflictRs.close();
            conflictPs.close();

            // Insert booking
            String insertSql =
                    "INSERT INTO bookings " +
                    "(student_id, tutor_id, availability_id, " +
                    "booking_date, start_time, end_time, status) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement insertPs =
                    con.prepareStatement(insertSql);

            insertPs.setInt(
                    1,
                    booking.getStudentId()
            );

            insertPs.setInt(
                    2,
                    booking.getTutorId()
            );

            insertPs.setInt(
                    3,
                    booking.getAvailabilityId()
            );

            insertPs.setDate(
                    4,
                    booking.getBookingDate()
            );

            insertPs.setTime(
                    5,
                    booking.getStartTime()
            );

            insertPs.setTime(
                    6,
                    booking.getEndTime()
            );

            insertPs.setString(
                    7,
                    "BOOKED"
            );

            int rows =
                    insertPs.executeUpdate();

            insertPs.close();

            // Update availability status
            if (rows > 0) {

                String updateSql =
                        "UPDATE availability " +
                        "SET status = 'BOOKED' " +
                        "WHERE availability_id = ?";

                PreparedStatement updatePs =
                        con.prepareStatement(updateSql);

                updatePs.setInt(
                        1,
                        booking.getAvailabilityId()
                );

                updatePs.executeUpdate();

                updatePs.close();

                System.out.println(
                        "Booking successful!"
                );

                return true;
            }

        } catch (Exception e) {

            System.out.println(
                    "Error creating booking!"
            );

            e.printStackTrace();

        } finally {

            try {

                if (con != null) {
                    con.close();
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return false;
    }


    // ==========================================
    // VIEW STUDENT BOOKINGS
    // ==========================================
    public static void viewStudentBookings(int studentId) {

        String sql =
                "SELECT b.booking_id, b.tutor_id, " +
                "b.booking_date, b.start_time, " +
                "b.end_time, b.status " +
                "FROM bookings b " +
                "WHERE b.student_id = ? " +
                "ORDER BY b.booking_date, b.start_time";

        try {

            Connection con =
                    DBConnection.getConnection();

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, studentId);

            ResultSet rs =
                    ps.executeQuery();

            System.out.println(
                    "\n--- MY BOOKINGS ---"
            );

            boolean found = false;

            while (rs.next()) {

                found = true;

                System.out.println(
                        "Booking ID: "
                        + rs.getInt("booking_id")
                        + " | Tutor ID: "
                        + rs.getInt("tutor_id")
                        + " | Date: "
                        + rs.getDate("booking_date")
                        + " | Start: "
                        + rs.getTime("start_time")
                        + " | End: "
                        + rs.getTime("end_time")
                        + " | Status: "
                        + rs.getString("status")
                );
            }

            if (!found) {

                System.out.println(
                        "No bookings found."
                );
            }

            rs.close();
            ps.close();
            con.close();

        } catch (Exception e) {

            System.out.println(
                    "Error viewing bookings!"
            );

            e.printStackTrace();
        }
    }

    public static boolean cancelBooking(int bookingId) {

    Connection con = null;

    try {

        con = DBConnection.getConnection();

        // Find the booking
        String findSql =
                "SELECT availability_id, status " +
                "FROM bookings " +
                "WHERE booking_id = ?";

        PreparedStatement findPs =
                con.prepareStatement(findSql);

        findPs.setInt(1, bookingId);

        ResultSet rs = findPs.executeQuery();

        if (!rs.next()) {

            System.out.println("Booking not found.");

            rs.close();
            findPs.close();

            return false;
        }

        int availabilityId =
                rs.getInt("availability_id");

        String status =
                rs.getString("status");

        rs.close();
        findPs.close();

        // Check booking status
        if (!"BOOKED".equalsIgnoreCase(status)) {

            System.out.println(
                    "Booking cannot be cancelled. Current status: "
                    + status
            );

            return false;
        }

        // Cancel booking
        String cancelSql =
                "UPDATE bookings " +
                "SET status = 'CANCELLED' " +
                "WHERE booking_id = ?";

        PreparedStatement cancelPs =
                con.prepareStatement(cancelSql);

        cancelPs.setInt(1, bookingId);

        int rows =
                cancelPs.executeUpdate();

        cancelPs.close();

        // Make availability available again
        if (rows > 0) {

            String updateSql =
                    "UPDATE availability " +
                    "SET status = 'AVAILABLE' " +
                    "WHERE availability_id = ?";

            PreparedStatement updatePs =
                    con.prepareStatement(updateSql);

            updatePs.setInt(1, availabilityId);

            updatePs.executeUpdate();

            updatePs.close();

            System.out.println(
                    "Booking cancelled successfully!"
            );

            return true;
        }

    } catch (Exception e) {

        System.out.println(
                "Error cancelling booking!"
        );

        e.printStackTrace();

    } finally {

        try {

            if (con != null) {
                con.close();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    return false;
}

public static boolean rescheduleBooking(
        int bookingId,
        int newAvailabilityId) {

    Connection con = null;

    try {

        con = DBConnection.getConnection();

        // 1. Get old booking details
        String findSql =
                "SELECT student_id, tutor_id, availability_id, status " +
                "FROM bookings " +
                "WHERE booking_id = ?";

        PreparedStatement findPs =
                con.prepareStatement(findSql);

        findPs.setInt(1, bookingId);

        ResultSet rs = findPs.executeQuery();

        if (!rs.next()) {

            System.out.println("Booking not found.");

            rs.close();
            findPs.close();

            return false;
        }

        int studentId = rs.getInt("student_id");
        int tutorId = rs.getInt("tutor_id");
        int oldAvailabilityId = rs.getInt("availability_id");
        String bookingStatus = rs.getString("status");

        rs.close();
        findPs.close();

        if (!"BOOKED".equalsIgnoreCase(bookingStatus)) {

            System.out.println(
                    "Only BOOKED reservations can be rescheduled."
            );

            return false;
        }

        // 2. Check new availability
        String availabilitySql =
                "SELECT tutor_id, available_date, start_time, " +
                "end_time, status " +
                "FROM availability " +
                "WHERE availability_id = ?";

        PreparedStatement availabilityPs =
                con.prepareStatement(availabilitySql);

        availabilityPs.setInt(1, newAvailabilityId);

        ResultSet availabilityRs =
                availabilityPs.executeQuery();

        if (!availabilityRs.next()) {

            System.out.println(
                    "New availability slot not found."
            );

            availabilityRs.close();
            availabilityPs.close();

            return false;
        }

        int newTutorId =
                availabilityRs.getInt("tutor_id");

        java.sql.Date newDate =
                availabilityRs.getDate("available_date");

        java.sql.Time newStartTime =
                availabilityRs.getTime("start_time");

        java.sql.Time newEndTime =
                availabilityRs.getTime("end_time");

        String newStatus =
                availabilityRs.getString("status");

        availabilityRs.close();
        availabilityPs.close();

        // 3. Check whether new slot is available
        if (!"AVAILABLE".equalsIgnoreCase(newStatus)) {

            System.out.println(
                    "New slot is not available."
            );

            return false;
        }

        // 4. Cancel old booking
        String cancelSql =
                "UPDATE bookings " +
                "SET status = 'CANCELLED' " +
                "WHERE booking_id = ?";

        PreparedStatement cancelPs =
                con.prepareStatement(cancelSql);

        cancelPs.setInt(1, bookingId);

        cancelPs.executeUpdate();

        cancelPs.close();

        // 5. Make old availability available again
        String oldSlotSql =
                "UPDATE availability " +
                "SET status = 'AVAILABLE' " +
                "WHERE availability_id = ?";

        PreparedStatement oldSlotPs =
                con.prepareStatement(oldSlotSql);

        oldSlotPs.setInt(1, oldAvailabilityId);

        oldSlotPs.executeUpdate();

        oldSlotPs.close();

        // 6. Create new booking
        String insertSql =
                "INSERT INTO bookings " +
                "(student_id, tutor_id, availability_id, " +
                "booking_date, start_time, end_time, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        PreparedStatement insertPs =
                con.prepareStatement(insertSql);

        insertPs.setInt(1, studentId);
        insertPs.setInt(2, newTutorId);
        insertPs.setInt(3, newAvailabilityId);
        insertPs.setDate(4, newDate);
        insertPs.setTime(5, newStartTime);
        insertPs.setTime(6, newEndTime);
        insertPs.setString(7, "BOOKED");

        int rows =
                insertPs.executeUpdate();

        insertPs.close();

        // 7. Mark new slot as booked
        if (rows > 0) {

            String newSlotSql =
                    "UPDATE availability " +
                    "SET status = 'BOOKED' " +
                    "WHERE availability_id = ?";

            PreparedStatement newSlotPs =
                    con.prepareStatement(newSlotSql);

            newSlotPs.setInt(1, newAvailabilityId);

            newSlotPs.executeUpdate();

            newSlotPs.close();

            System.out.println(
                    "Booking rescheduled successfully!"
            );

            return true;
        }

    } catch (Exception e) {

        System.out.println(
                "Error rescheduling booking!"
        );

        e.printStackTrace();

    } finally {

        try {
            if (con != null) {
                con.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    return false;
}

}