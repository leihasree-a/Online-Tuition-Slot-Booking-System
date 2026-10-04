import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Scanner;

public class ViewTutor {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Tutor ID: ");
        int tutorId = sc.nextInt();

        String sql = "SELECT t.tutor_id, u.name, u.email, " +
                     "t.subject, t.qualification, t.experience, t.phone " +
                     "FROM tutors t " +
                     "JOIN users u ON t.user_id = u.user_id " +
                     "WHERE t.tutor_id = ?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);
            pst.setInt(1, tutorId);

            ResultSet rs = pst.executeQuery();

            if (rs.next()) {
                System.out.println("\n--- Tutor Details ---");
                System.out.println("Tutor ID: " + rs.getInt("tutor_id"));
                System.out.println("Name: " + rs.getString("name"));
                System.out.println("Email: " + rs.getString("email"));
                System.out.println("Subject: " + rs.getString("subject"));
                System.out.println("Qualification: " + rs.getString("qualification"));
                System.out.println("Experience: " + rs.getInt("experience") + " years");
                System.out.println("Phone: " + rs.getString("phone"));
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