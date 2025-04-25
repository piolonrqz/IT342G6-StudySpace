package cit.edu.studyspace.dto;

import cit.edu.studyspace.entity.BookingStatus;
import java.time.LocalDateTime;

// DTO for returning booking details in lists/responses
public class BookingResponseDTO {
    private int id; // Booking ID
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int numberOfPeople;
    private Double totalPrice;
    private BookingStatus status;

    // Include necessary details from the related Space
    private Integer spaceId;
    private String spaceName;
    private String spaceLocation;
    private String spaceImageFilename;

    // Include necessary details from the related User
    private String userName;
    private String userEmail;
    private LocalDateTime createdAt;
    private String cancellationReason;

    // Getters and Setters for all fields...

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public int getNumberOfPeople() { return numberOfPeople; }
    public void setNumberOfPeople(int numberOfPeople) { this.numberOfPeople = numberOfPeople; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public Integer getSpaceId() { return spaceId; }
    public void setSpaceId(Integer spaceId) { this.spaceId = spaceId; }

    public String getSpaceName() { return spaceName; }
    public void setSpaceName(String spaceName) { this.spaceName = spaceName; }

    public String getSpaceLocation() { return spaceLocation; }
    public void setSpaceLocation(String spaceLocation) { this.spaceLocation = spaceLocation; }

    public String getSpaceImageFilename() { return spaceImageFilename; }
    public void setSpaceImageFilename(String spaceImageFilename) { this.spaceImageFilename = spaceImageFilename; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
}