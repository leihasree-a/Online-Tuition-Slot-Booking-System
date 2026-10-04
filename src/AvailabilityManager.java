import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class AvailabilityManager {

    // Add a new availability slot
    public static boolean addAvailability(Availability availability) {

        String sql = "INSERT INTO availability " +
                     "(tutor_id, available_date, start_time, end_time, status) " +
                     "VALUES (?, ?, ?, ?, ?)";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, availability.getTutorId());
            ps.setDate(2, availability.getAvailableDate());
            ps.setTime(3, availability.getStartTime());
            ps.setTime(4, availability.getEndTime());
            ps.setString(5, availability.getStatus());

            int rows = ps.executeUpdate();

            ps.close();
            con.close();

            return rows > 0;

        } catch (Exception e) {
            System.out.println("Error adding availability!");
            e.printStackTrace();
            return false;
        }
    }


    // View availability for a tutor
    public static void viewAvailability(int tutorId) {

        String sql = "SELECT * FROM availability " +
                     "WHERE tutor_id = ? AND status = 'AVAILABLE' " +
                     "ORDER BY available_date, start_time";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, tutorId);

            ResultSet rs = ps.executeQuery();

            System.out.println("\n--- AVAILABLE SLOTS ---");

            while (rs.next()) {

                System.out.println(
                    "Availability ID: " + rs.getInt("availability_id") +
                    " | Date: " + rs.getDate("available_date") +
                    " | Start: " + rs.getTime("start_time") +
                    " | End: " + rs.getTime("end_time") +
                    " | Status: " + rs.getString("status")
                );
            }

            rs.close();
            ps.close();
            con.close();

        } catch (Exception e) {
            System.out.println("Error viewing availability!");
            e.printStackTrace();
        }
    }


    // Delete availability
    public static boolean deleteAvailability(int availabilityId) {

        String sql = "DELETE FROM availability WHERE availability_id = ?";

        try {

            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, availabilityId);

            int rows = ps.executeUpdate();

            ps.close();
            con.close();

            return rows > 0;

        } catch (Exception e) {

            System.out.println("Error deleting availability!");
            e.printStackTrace();

            return false;
        }
    }
}