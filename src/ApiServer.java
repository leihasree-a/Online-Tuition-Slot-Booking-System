import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Time;
import java.util.HashMap;
import java.util.Map;

public class ApiServer {

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(
                new InetSocketAddress(8080),
                0
        );

        // Availability API
        server.createContext(
                "/api/availability",
                ApiServer::handleAvailability
        );

        // Booking APIs
        server.createContext(
                "/api/bookings",
                ApiServer::handleBookings
        );

        server.setExecutor(null);

        System.out.println("=================================");
        System.out.println("TuitionHub API Server Started");
        System.out.println("http://localhost:8080");
        System.out.println("=================================");

        server.start();
    }


    // =====================================================
    // AVAILABILITY API
    // GET /api/availability?tutorId=1
    // =====================================================

    private static void handleAvailability(
            HttpExchange exchange) throws IOException {

        addCorsHeaders(exchange);

        // Handle browser preflight request
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            sendResponse(exchange, 200, "");
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        try {

            Map<String, String> params =
                    getQueryParams(exchange.getRequestURI());

            int tutorId =
                    Integer.parseInt(params.getOrDefault("tutorId", "1"));

            String sql =
                    "SELECT availability_id, tutor_id, available_date, " +
                    "start_time, end_time, status " +
                    "FROM availability " +
                    "WHERE tutor_id = ? " +
                    "ORDER BY available_date, start_time";

            Connection con = DBConnection.getConnection();

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, tutorId);

            ResultSet rs = ps.executeQuery();

            StringBuilder json = new StringBuilder();

            json.append("[");

            boolean first = true;

            while (rs.next()) {

                if (!first) {
                    json.append(",");
                }

                first = false;

                json.append("{");

                json.append("\"availabilityId\":")
                        .append(rs.getInt("availability_id"))
                        .append(",");

                json.append("\"tutorId\":")
                        .append(rs.getInt("tutor_id"))
                        .append(",");

                json.append("\"date\":\"")
                        .append(rs.getDate("available_date"))
                        .append("\",");

                json.append("\"startTime\":\"")
                        .append(rs.getTime("start_time"))
                        .append("\",");

                json.append("\"endTime\":\"")
                        .append(rs.getTime("end_time"))
                        .append("\",");

                json.append("\"status\":\"")
                        .append(rs.getString("status"))
                        .append("\"");

                json.append("}");
            }

            json.append("]");

            rs.close();
            ps.close();
            con.close();

            sendResponse(
                    exchange,
                    200,
                    json.toString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    500,
                    "{\"error\":\"Failed to load availability\"}"
            );
        }
    }


    // =====================================================
    // BOOKING API
    //
    // POST /api/bookings
    // ?studentId=1&tutorId=1&availabilityId=2
    //
    // GET /api/bookings?studentId=1
    //
    // POST /api/bookings/cancel?bookingId=1
    //
    // POST /api/bookings/reschedule
    // ?bookingId=2&newAvailabilityId=4
    // =====================================================

    private static void handleBookings(
            HttpExchange exchange) throws IOException {

        addCorsHeaders(exchange);

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            sendResponse(exchange, 200, "");
            return;
        }

        try {

            String method =
                    exchange.getRequestMethod();

            URI uri =
                    exchange.getRequestURI();

            String path =
                    uri.getPath();

            Map<String, String> params =
                    getQueryParams(uri);


            // ---------------------------------------------
            // GET BOOKINGS
            // ---------------------------------------------

            if (method.equalsIgnoreCase("GET")) {

                int studentId =
                        Integer.parseInt(
                                params.getOrDefault(
                                        "studentId",
                                        "1"
                                )
                        );

                getStudentBookings(
                        exchange,
                        studentId
                );

                return;
            }


            // ---------------------------------------------
            // CANCEL BOOKING
            // ---------------------------------------------

            if (
                    method.equalsIgnoreCase("POST")
                    && path.endsWith("/cancel")
            ) {

                int bookingId =
                        Integer.parseInt(
                                params.get("bookingId")
                        );

                boolean success =
                        BookingManager.cancelBooking(
                                bookingId
                        );

                if (success) {

                    sendResponse(
                            exchange,
                            200,
                            "{\"success\":true,\"message\":\"Booking cancelled successfully\"}"
                    );

                } else {

                    sendResponse(
                            exchange,
                            400,
                            "{\"success\":false,\"message\":\"Booking cancellation failed\"}"
                    );
                }

                return;
            }


            // ---------------------------------------------
            // RESCHEDULE BOOKING
            // ---------------------------------------------

            if (
                    method.equalsIgnoreCase("POST")
                    && path.endsWith("/reschedule")
            ) {

                int bookingId =
                        Integer.parseInt(
                                params.get("bookingId")
                        );

                int newAvailabilityId =
                        Integer.parseInt(
                                params.get("newAvailabilityId")
                        );

                boolean success =
                        BookingManager.rescheduleBooking(
                                bookingId,
                                newAvailabilityId
                        );

                if (success) {

                    sendResponse(
                            exchange,
                            200,
                            "{\"success\":true,\"message\":\"Booking rescheduled successfully\"}"
                    );

                } else {

                    sendResponse(
                            exchange,
                            400,
                            "{\"success\":false,\"message\":\"Booking rescheduling failed\"}"
                    );
                }

                return;
            }


            // ---------------------------------------------
            // CREATE BOOKING
            // ---------------------------------------------

            if (
                    method.equalsIgnoreCase("POST")
                    && path.equals("/api/bookings")
            ) {

                int studentId =
                        Integer.parseInt(
                                params.get("studentId")
                        );

                int tutorId =
                        Integer.parseInt(
                                params.get("tutorId")
                        );

                int availabilityId =
                        Integer.parseInt(
                                params.get("availabilityId")
                        );

                // Get date and time from availability
                String sql =
                        "SELECT available_date, start_time, end_time " +
                        "FROM availability " +
                        "WHERE availability_id = ?";

                Connection con =
                        DBConnection.getConnection();

                PreparedStatement ps =
                        con.prepareStatement(sql);

                ps.setInt(1, availabilityId);

                ResultSet rs =
                        ps.executeQuery();

                if (!rs.next()) {

                    rs.close();
                    ps.close();
                    con.close();

                    sendResponse(
                            exchange,
                            404,
                            "{\"success\":false,\"message\":\"Availability not found\"}"
                    );

                    return;
                }

                Date date =
                        rs.getDate("available_date");

                Time startTime =
                        rs.getTime("start_time");

                Time endTime =
                        rs.getTime("end_time");

                rs.close();
                ps.close();
                con.close();

                Booking booking =
                        new Booking(
                                studentId,
                                tutorId,
                                availabilityId,
                                date,
                                startTime,
                                endTime
                        );

                boolean success =
                        BookingManager.bookSlot(
                                booking
                        );

                if (success) {

                    sendResponse(
                            exchange,
                            200,
                            "{\"success\":true,\"message\":\"Booking successful\"}"
                    );

                } else {

                    sendResponse(
                            exchange,
                            400,
                            "{\"success\":false,\"message\":\"Slot is not available\"}"
                    );
                }

                return;
            }


            sendResponse(
                    exchange,
                    404,
                    "{\"error\":\"Endpoint not found\"}"
            );

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    500,
                    "{\"error\":\"Server error\"}"
            );
        }
    }


    // =====================================================
    // GET STUDENT BOOKINGS
    // =====================================================

    private static void getStudentBookings(
            HttpExchange exchange,
            int studentId) throws IOException {

        try {

            String sql =
                    "SELECT booking_id, student_id, tutor_id, " +
                    "availability_id, booking_date, start_time, " +
                    "end_time, status " +
                    "FROM bookings " +
                    "WHERE student_id = ? " +
                    "ORDER BY booking_date, start_time";

            Connection con =
                    DBConnection.getConnection();

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, studentId);

            ResultSet rs =
                    ps.executeQuery();

            StringBuilder json =
                    new StringBuilder("[");

            boolean first = true;

            while (rs.next()) {

                if (!first) {
                    json.append(",");
                }

                first = false;

                json.append("{");

                json.append("\"bookingId\":")
                        .append(rs.getInt("booking_id"))
                        .append(",");

                json.append("\"studentId\":")
                        .append(rs.getInt("student_id"))
                        .append(",");

                json.append("\"tutorId\":")
                        .append(rs.getInt("tutor_id"))
                        .append(",");

                json.append("\"availabilityId\":")
                        .append(rs.getInt("availability_id"))
                        .append(",");

                json.append("\"date\":\"")
                        .append(rs.getDate("booking_date"))
                        .append("\",");

                json.append("\"startTime\":\"")
                        .append(rs.getTime("start_time"))
                        .append("\",");

                json.append("\"endTime\":\"")
                        .append(rs.getTime("end_time"))
                        .append("\",");

                json.append("\"status\":\"")
                        .append(rs.getString("status"))
                        .append("\"");

                json.append("}");
            }

            json.append("]");

            rs.close();
            ps.close();
            con.close();

            sendResponse(
                    exchange,
                    200,
                    json.toString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    500,
                    "{\"error\":\"Failed to load bookings\"}"
            );
        }
    }


    // =====================================================
    // QUERY PARAMETER PARSER
    // =====================================================

    private static Map<String, String> getQueryParams(
            URI uri) {

        Map<String, String> params =
                new HashMap<>();

        String query =
                uri.getRawQuery();

        if (query == null || query.isEmpty()) {
            return params;
        }

        for (String pair : query.split("&")) {

            String[] parts =
                    pair.split("=", 2);

            if (parts.length == 2) {

                String key =
                        URLDecoder.decode(
                                parts[0],
                                StandardCharsets.UTF_8
                        );

                String value =
                        URLDecoder.decode(
                                parts[1],
                                StandardCharsets.UTF_8
                        );

                params.put(key, value);
            }
        }

        return params;
    }


    // =====================================================
    // CORS
    // =====================================================

    private static void addCorsHeaders(
            HttpExchange exchange) {

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin",
                "http://localhost:5173"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );
    }


    // =====================================================
    // SEND RESPONSE
    // =====================================================

    private static void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response) throws IOException {

        byte[] bytes =
                response.getBytes(
                        StandardCharsets.UTF_8
                );

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json"
        );

        exchange.sendResponseHeaders(
                statusCode,
                bytes.length
        );

        try (OutputStream os =
                     exchange.getResponseBody()) {

            os.write(bytes);
        }
    }
}