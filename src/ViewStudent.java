import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Scanner;

public class ViewStudent {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Student ID: ");
        int studentId = sc.nextInt();

        String sql = "SELECT s.student_id, u.name, u.email, " +
                     "s.course, s.phone, s.address " +
                     "FROM students s " +
                     "JOIN users u ON s.user_id = u.user_id " +
                     "WHERE s.student_id = ?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);
            pst.setInt(1, studentId);

            ResultSet rs = pst.executeQuery();

            if (rs.next()) {
                System.out.println("\n--- Student Details ---");
                System.out.println("Student ID: " + rs.getInt("student_id"));
                System.out.println("Name: " + rs.getString("name"));
                System.out.println("Email: " + rs.getString("email"));
                System.out.println("Course: " + rs.getString("course"));
                System.out.println("Phone: " + rs.getString("phone"));
                System.out.println("Address: " + rs.getString("address"));
            } else {
                System.out.println("Student not found!");
            }

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        sc.close();
    }
}