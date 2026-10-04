import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Scanner;

public class StudentManagement {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter User ID: ");
        int userId = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter Course: ");
        String course = sc.nextLine();

        System.out.print("Enter Phone: ");
        String phone = sc.nextLine();

        System.out.print("Enter Address: ");
        String address = sc.nextLine();

        String sql = "INSERT INTO students (user_id, course, phone, address) VALUES (?, ?, ?, ?)";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);

            pst.setInt(1, userId);
            pst.setString(2, course);
            pst.setString(3, phone);
            pst.setString(4, address);

            pst.executeUpdate();

            System.out.println("Student added successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        sc.close();
    }
}