import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Scanner;

public class UpdateTutor {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Tutor ID: ");
        int tutorId = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter New Subject: ");
        String subject = sc.nextLine();

        System.out.print("Enter New Qualification: ");
        String qualification = sc.nextLine();

        System.out.print("Enter New Experience (years): ");
        int experience = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter New Phone: ");
        String phone = sc.nextLine();

        String sql = "UPDATE tutors SET subject = ?, qualification = ?, " +
                     "experience = ?, phone = ? WHERE tutor_id = ?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);

            pst.setString(1, subject);
            pst.setString(2, qualification);
            pst.setInt(3, experience);
            pst.setString(4, phone);
            pst.setInt(5, tutorId);

            int rows = pst.executeUpdate();

            if (rows > 0) {
                System.out.println("Tutor updated successfully!");
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