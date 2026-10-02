import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Scanner;

public class DeleteStudent {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Student ID: ");
        int studentId = sc.nextInt();

        String sql = "DELETE FROM students WHERE student_id = ?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);
            pst.setInt(1, studentId);

            int rows = pst.executeUpdate();

            if (rows > 0) {
                System.out.println("Student deleted successfully!");
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