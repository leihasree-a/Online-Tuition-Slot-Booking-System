import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Scanner;

public class UpdateStudent {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Student ID: ");
        int studentId = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter New Course: ");
        String course = sc.nextLine();

        System.out.print("Enter New Phone: ");
        String phone = sc.nextLine();

        System.out.print("Enter New Address: ");
        String address = sc.nextLine();

        String sql = "UPDATE students SET course = ?, phone = ?, address = ? " +
                     "WHERE student_id = ?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);

            pst.setString(1, course);
            pst.setString(2, phone);
            pst.setString(3, address);
            pst.setInt(4, studentId);

            int rows = pst.executeUpdate();

            if (rows > 0) {
                System.out.println("Student updated successfully!");
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