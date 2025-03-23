package cit.edu.studyspace.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "Space")
@Schema(description = "Space entity representing available co-working spaces")
public class Space {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INTEGER")
    private int id;
    
    @Column(nullable = false)
    @Schema(description = "Name of the co-working space", example = "Quiet Corner")
    private String name;
    
    @Column(nullable = false, length = 1000)
    @Schema(description = "Detailed description of the space", example = "A quiet corner perfect for focused work...")
    private String description;
    
    @Column(nullable = false)
    @Schema(description = "Location of the space", example = "LRAC")
    private String location;
    
    @Column(nullable = false)
    @Schema(description = "Maximum capacity of the space", example = "10")
    private int capacity;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "Type of space", example = "CONFERENCE_ROOM")
    private SpaceType spaceType;
    
    @Column(nullable = false)
    @Schema(description = "Indicates if the space is currently available for booking", example = "true")
    private boolean isAvailable;
    
    @Column(nullable = false)
    @Schema(description = "Opening time of the space", example = "08:00")
    private String openingTime;
    
    @Column(nullable = false)
    @Schema(description = "Closing time of the space", example = "20:00")
    private String closingTime;
    
    @Column(nullable = false)
    @Schema(description = "Creation timestamp of the space listing")
    private LocalDateTime createdAt;
    
    @Column
    @Schema(description = "Last update timestamp of the space listing")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL)
    private Set<Booking> bookings = new HashSet<>();
    
    // Constructors
    public Space() {
    }
    
    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public SpaceType getSpaceType() {
        return spaceType;
    }

    public void setSpaceType(SpaceType spaceType) {
        this.spaceType = spaceType;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public String getOpeningTime() {
        return openingTime;
    }

    public void setOpeningTime(String openingTime) {
        this.openingTime = openingTime;
    }

    public String getClosingTime() {
        return closingTime;
    }

    public void setClosingTime(String closingTime) {
        this.closingTime = closingTime;
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

    public Set<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(Set<Booking> bookings) {
        this.bookings = bookings;
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