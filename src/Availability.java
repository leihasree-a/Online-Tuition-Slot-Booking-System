import java.sql.Date;
import java.sql.Time;

public class Availability {

    private int availabilityId;
    private int tutorId;
    private Date availableDate;
    private Time startTime;
    private Time endTime;
    private String status;

    // Constructor for creating new availability
    public Availability(int tutorId, Date availableDate,Time startTime, Time endTime) {

        this.tutorId = tutorId;
        this.availableDate = availableDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = "AVAILABLE";
    }

    // Empty constructor
    public Availability() {
    }

    public int getAvailabilityId() {
        return availabilityId;
    }

    public void setAvailabilityId(int availabilityId) {
        this.availabilityId = availabilityId;
    }

    public int getTutorId() {
        return tutorId;
    }

    public void setTutorId(int tutorId) {
        this.tutorId = tutorId;
    }

    public Date getAvailableDate() {
        return availableDate;
    }

    public void setAvailableDate(Date availableDate) {
        this.availableDate = availableDate;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}