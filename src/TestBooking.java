import java.sql.Date;
import java.sql.Time;

public class TestBooking {

    public static void main(String[] args) {

        Booking booking = new Booking(
                1, // student ID
                1, // tutor ID
                4, // availability ID - ALREADY BOOKED
                Date.valueOf("2026-10-06"),
                Time.valueOf("18:00:00"),
                Time.valueOf("19:00:00")
        );

        System.out.println(
                "Availability ID = " + booking.getAvailabilityId()
        );

        boolean result = BookingManager.bookSlot(booking);

        if (result) {
            System.out.println("Booking completed successfully!");
        } else {
            System.out.println("Booking failed.");
        }
    }
}