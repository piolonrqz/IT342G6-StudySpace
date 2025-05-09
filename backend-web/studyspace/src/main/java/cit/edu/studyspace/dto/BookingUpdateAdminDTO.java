package cit.edu.studyspace.dto;

import cit.edu.studyspace.entity.BookingStatus;

public class BookingUpdateAdminDTO {
    private BookingStatus status;
    private Integer numberOfPeople; // Use Integer to allow null if not updated
    private Double totalPrice; // Added totalPrice field

    // Getters and Setters
    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public Integer getNumberOfPeople() {
        return numberOfPeople;
    }

    public void setNumberOfPeople(Integer numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
