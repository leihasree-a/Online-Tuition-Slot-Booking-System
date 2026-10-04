import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Scanner;

public class TutorManagement {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter User ID: ");
        int userId = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter Subject: ");
        String subject = sc.nextLine();

        System.out.print("Enter Qualification: ");
        String qualification = sc.nextLine();

        System.out.print("Enter Experience (years): ");
        int experience = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter Phone: ");
        String phone = sc.nextLine();

        String sql = "INSERT INTO tutors " +
                     "(user_id, subject, qualification, experience, phone) " +
                     "VALUES (?, ?, ?, ?, ?)";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);

            pst.setInt(1, userId);
            pst.setString(2, subject);
            pst.setString(3, qualification);
            pst.setInt(4, experience);
            pst.setString(5, phone);

            pst.executeUpdate();

            System.out.println("Tutor added successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        sc.close();
    }
}