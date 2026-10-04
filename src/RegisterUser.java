import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Scanner;

public class RegisterUser {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Name: ");
        String name = sc.nextLine();

        System.out.print("Enter Email: ");
        String email = sc.nextLine();

        System.out.print("Enter Password: ");
        String password = sc.nextLine();

        System.out.print("Enter Role (STUDENT/TUTOR/ADMIN): ");
        String role = sc.nextLine().toUpperCase();

        String sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement pst = con.prepareStatement(sql);

            pst.setString(1, name);
            pst.setString(2, email);
            pst.setString(3, password);
            pst.setString(4, role);

            pst.executeUpdate();

            System.out.println("User registered successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        sc.close();
    }
}