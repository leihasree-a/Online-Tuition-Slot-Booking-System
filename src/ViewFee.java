import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Scanner;

public class ViewFee {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Student ID: ");
        int studentId = sc.nextInt();

        String sql = "SELECT f.fee_id, u.name, f.booking_id, " +
                     "f.amount, f.payment_date, f.payment_method, f.status " +
                     "FROM fees f " +
                     "JOIN students s ON f.student_id = s.student_id " +
                     "JOIN users u ON s.user_id = u.user_id " +
                     "WHERE f.student_id = ?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);
            pst.setInt(1, studentId);

            ResultSet rs = pst.executeQuery();

            boolean found = false;

            while (rs.next()) {
                found = true;

                System.out.println("\n--- Fee Details ---");
                System.out.println("Fee ID: " + rs.getInt("fee_id"));
                System.out.println("Student Name: " + rs.getString("name"));
                System.out.println("Booking ID: " + rs.getInt("booking_id"));
                System.out.println("Amount: " + rs.getDouble("amount"));
                System.out.println("Payment Date: " + rs.getDate("payment_date"));
                System.out.println("Payment Method: " + rs.getString("payment_method"));
                System.out.println("Status: " + rs.getString("status"));
            }

            if (!found) {
                System.out.println("No fee records found!");
            }

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        sc.close();
    }
}