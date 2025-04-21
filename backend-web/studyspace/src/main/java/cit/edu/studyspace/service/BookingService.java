package cit.edu.studyspace.service;

import cit.edu.studyspace.entity.BookingEntity;
import cit.edu.studyspace.entity.BookingStatus; // Import the enum
import cit.edu.studyspace.repository.BookingRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional

import java.util.List;
import java.util.Optional;

@Service
@Tag(name = "Booking Service", description = "Business logic for booking operations")
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private GoogleCalendarService calendarService;

    public BookingService() {
        super();
    }

    // Retrieves all bookings from the database.
    @Operation(summary = "Get all bookings", description = "Fetches all bookings from the database")
    public List<BookingEntity> getAllBookings() {
        return bookingRepo.findAll();
    }

    // Retrieves a booking by their ID.
    @Operation(summary = "Get booking by ID", description = "Fetches a booking based on the given ID")
    public Optional<BookingEntity> getBookingById(int id) {
        return bookingRepo.findById(id);
    }

    // Add method to get bookings by user ID
    @Operation(summary = "Get bookings by user ID", description = "Fetches all bookings for a specific user")
    public List<BookingEntity> getBookingsByUserId(Long userId) {
        // This now relies on the method added to BookingRepo
        return bookingRepo.findByUserId(userId); 
    }

    // Creates a new booking and syncs it with Google Calendar.
    @Operation(summary = "Create a new booking", description = "Adds a new booking to the system and Google Calendar")
    public BookingEntity saveBooking(BookingEntity booking) {
        BookingEntity savedBooking = bookingRepo.save(booking);
        try {
            calendarService.createCalendarEvent(savedBooking);
        } catch (Exception e) {
            System.out.println("Google Calendar integration failed: " + e.getMessage());
        }
        return savedBooking;
    }

    // Add method to cancel a booking
    @Transactional // Ensure the operation is atomic
    @Operation(summary = "Cancel a booking", description = "Marks a booking as cancelled")
    public BookingEntity cancelBooking(Long bookingId) {
        // Find the booking by ID. Use Long if your ID is Long.
        Optional<BookingEntity> bookingOpt = bookingRepo.findById(bookingId.intValue()); // Convert Long to int if ID is int
        
        if (bookingOpt.isPresent()) {
            BookingEntity booking = bookingOpt.get();
            // Compare with the enum constant
            if (BookingStatus.CONFIRMED == booking.getStatus()) { 
                // Set status using the enum constant
                booking.setStatus(BookingStatus.CANCELLED);
                // Optionally set cancelledAt timestamp
                // booking.setCancelledAt(LocalDateTime.now());
                return bookingRepo.save(booking);
            } else {
                throw new RuntimeException("Booking cannot be cancelled in its current state: " + booking.getStatus());
            }
        } else {
            throw new RuntimeException("Booking not found with ID: " + bookingId);
        }
    }

    // Deletes a booking by their ID.
    @Operation(summary = "Delete a booking", description = "Removes a booking from the database")
    public String deleteBooking(int id) {
        String msg;
        if (bookingRepo.findById(id).isPresent()) {
            bookingRepo.deleteById(id);
            msg = "Booking record successfully deleted!";
        } else {
            msg = id + " NOT FOUND!";
        }
        return msg;
    }
}
