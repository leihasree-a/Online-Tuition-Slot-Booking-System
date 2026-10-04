public class TestCancelBooking {

    public static void main(String[] args) {

        boolean result =
                BookingManager.cancelBooking(1);

        if (result) {
            System.out.println(
                    "Cancel operation completed!"
            );
        } else {
            System.out.println(
                    "Cancel operation failed."
            );
        }
    }
}