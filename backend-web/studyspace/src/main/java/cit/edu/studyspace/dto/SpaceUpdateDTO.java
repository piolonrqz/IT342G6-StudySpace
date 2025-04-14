package cit.edu.studyspace.dto;

import cit.edu.studyspace.entity.SpaceType;
import java.math.BigDecimal; // Import BigDecimal

public class SpaceUpdateDTO {
    private String name;
    private String description;
    private String location;
    private int capacity;
    private SpaceType spaceType;
    private boolean isAvailable; // Changed from available for consistency
    private String openingTime;
    private String closingTime;
    private String imageFilename; // Changed from imageUrl
    private BigDecimal price; // Added price

    // Getters and Setters
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

    // Getter and Setter for isAvailable (consistent field name)
    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) { // Setter name remains setAvailable
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

    // Getter and Setter for imageFilename
    public String getImageFilename() {
        return imageFilename;
    }

    public void setImageFilename(String imageFilename) {
        this.imageFilename = imageFilename;
    }

    // Getter and Setter for price (now BigDecimal)
    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
