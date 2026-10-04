public class TestRescheduleBooking {

    public static void main(String[] args) {

        boolean result =
                BookingManager.rescheduleBooking(
                        2,  // BOOKED booking ID
                        4   // new availability ID
                );

        if (result) {
            System.out.println(
                    "Reschedule operation completed!"
            );
        } else {
            System.out.println(
                    "Reschedule operation failed."
            );
        }
    }
}