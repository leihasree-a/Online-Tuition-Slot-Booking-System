import java.sql.Date;
import java.sql.Time;

public class TestAvailability {

    public static void main(String[] args) {

        Availability availability = new Availability(
                1,
                Date.valueOf("2026-10-05"),
                Time.valueOf("17:00:00"),
                Time.valueOf("18:00:00")
        );

        boolean result =
                AvailabilityManager.addAvailability(availability);

        if (result) {
            System.out.println("Availability added successfully!");
        } else {
            System.out.println("Failed to add availability.");
        }
    }
}