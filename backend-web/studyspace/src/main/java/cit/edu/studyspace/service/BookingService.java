package cit.edu.studyspace.service;

import cit.edu.studyspace.entity.Booking;
import cit.edu.studyspace.repository.BookingRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Tag(name = "Booking Service", description = "Business logic for booking operations")
public class BookingService {
    
    @Autowired
    private BookingRepo bookingRepo;

    public BookingService(){
        super();
    }

    // Retrieves all bookings from the database.
    @Operation(summary = "Get all bookings", description = "Fetches all bookings from the database")
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    // Retrieves a booking by their ID.
    @Operation(summary = "Get booking by ID", description = "Fetches a booking based on the given ID")
    public Optional<Booking> getBookingById(int id) {
        return bookingRepo.findById(id);
    }

    // Creates a new booking.
    @Operation(summary = "Create a new booking", description = "Adds a new booking to the system")
    public Booking createBooking(Booking booking) {
        return bookingRepo.save(booking);
    }

}
