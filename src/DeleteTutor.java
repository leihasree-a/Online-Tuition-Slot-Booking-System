import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Scanner;

public class DeleteTutor {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Tutor ID: ");
        int tutorId = sc.nextInt();

        String sql = "DELETE FROM tutors WHERE tutor_id = ?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);
            pst.setInt(1, tutorId);

            int rows = pst.executeUpdate();

            if (rows > 0) {
                System.out.println("Tutor deleted successfully!");
            } else {
                System.out.println("Tutor not found!");
            }

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        sc.close();
    }
}