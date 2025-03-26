package cit.edu.studyspace.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "Booking")
@Schema(description = "Booking entity representing space reservations made by users")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier for the booking", example = "1")
    private int id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @Schema(description = "User who made the booking")
    private UserEntity user;
    
    @ManyToOne
    @JoinColumn(name = "space_id", nullable = true)
    @Schema(description = "Space that was booked")
    private Space space;
    
    @Column(nullable = false)
    @Schema(description = "Start time of the booking", example = "2025-04-01T09:00:00")
    private LocalDateTime startTime;
    
    @Column(nullable = false)
    @Schema(description = "End time of the booking", example = "2025-04-01T17:00:00")
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "Current status of the booking", example = "CONFIRMED")
    private BookingStatus status;
    
    @Column(nullable = false)
    @Schema(description = "Creation timestamp of the booking")
    private LocalDateTime createdAt;
    
    @Column
    @Schema(description = "Last update timestamp of the booking")
    private LocalDateTime updatedAt;
    
    @Column
    @Schema(description = "Timestamp when the booking was cancelled (if applicable)")
    private LocalDateTime cancelledAt;
    
    @Column
    @Schema(description = "Reason for cancellation (if applicable)")
    private String cancellationReason;
    
    @Column(nullable = false)
    @Schema(description = "Number of people for the booking", example = "3")
    private int numberOfPeople;
    
    // Constructors
    public Booking() {
    }
    
    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public Space getSpace() {
        return space;
    }

    public void setSpace(Space space) {
        this.space = space;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public int getNumberOfPeople() {
        return numberOfPeople;
    }

    public void setNumberOfPeople(int numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}