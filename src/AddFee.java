import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Scanner;

public class AddFee {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Student ID: ");
        int studentId = sc.nextInt();

        System.out.print("Enter Booking ID: ");
        int bookingId = sc.nextInt();

        System.out.print("Enter Amount: ");
        double amount = sc.nextDouble();
        sc.nextLine();

        System.out.print("Enter Payment Date (YYYY-MM-DD): ");
        String paymentDate = sc.nextLine();

        System.out.print("Enter Payment Method: ");
        String paymentMethod = sc.nextLine();

        System.out.print("Enter Status: ");
        String status = sc.nextLine();

        String sql = "INSERT INTO fees " +
                     "(student_id, booking_id, amount, payment_date, payment_method, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);

            pst.setInt(1, studentId);
            pst.setInt(2, bookingId);
            pst.setDouble(3, amount);
            pst.setString(4, paymentDate);
            pst.setString(5, paymentMethod);
            pst.setString(6, status);

            pst.executeUpdate();

            System.out.println("Fee record added successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        sc.close();
    }
}