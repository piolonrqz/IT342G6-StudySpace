package cit.edu.studyspace.dto;

import java.math.BigDecimal;
import cit.edu.studyspace.entity.SpaceType; // Import SpaceType

public class SpaceListDTO {
    private int id;
    private String name;
    private String description;
    private String location;
    private int capacity; 
    private String imageFilename;
    private BigDecimal price;
    private String openingTime;
    private String closingTime;
    private SpaceType spaceType; // Added spaceType
    private boolean isAvailable; // Added isAvailable
    
    // Constructor
    public SpaceListDTO() {
    }
    
    // Getters and setters
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
    
    public String getImageFilename() {
        return imageFilename;
    }
    
    public void setImageFilename(String imageFilename) {
        this.imageFilename = imageFilename;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
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

    // Getters and setters for spaceType
    public SpaceType getSpaceType() {
        return spaceType;
    }

    public void setSpaceType(SpaceType spaceType) {
        this.spaceType = spaceType;
    }

    // Getters and setters for isAvailable
    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }
}