package cit.edu.studyspace.service;

import cit.edu.studyspace.entity.BookingEntity;
import cit.edu.studyspace.entity.BookingStatus; // Import the enum
import cit.edu.studyspace.repository.BookingRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional
import org.springframework.web.server.ResponseStatusException; // Import ResponseStatusException

import java.time.LocalDateTime; // Import LocalDateTime
import java.time.LocalTime; // Import LocalTime
import java.time.format.DateTimeFormatter; // Import DateTimeFormatter
import java.time.format.DateTimeParseException; // Import DateTimeParseException
import java.util.List;
import java.util.Optional;
import java.time.LocalDate; // Import LocalDate

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

    // Make method public to be used by controller
    public boolean isTimeSlotAvailable(int spaceId, LocalDateTime startTime, LocalDateTime endTime) {
        List<BookingEntity> overlappingBookings = bookingRepo.findOverlappingBookings(spaceId, startTime, endTime, BookingStatus.BOOKED);
        return overlappingBookings.isEmpty();
    }

    // Creates a new booking
    @Transactional // Make save operation transactional
    @Operation(summary = "Create a new booking", description = "Adds a new booking to the system and Google Calendar after checking availability and closing time")
    public BookingEntity saveBooking(BookingEntity booking) {
        // 0. Basic validation
        if (booking.getSpace() == null || booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required booking details (space, start time, end time).");
        }
        if (booking.getEndTime().isBefore(booking.getStartTime())) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time cannot be before start time.");
        }
        if (booking.getStartTime().isBefore(LocalDateTime.now())) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking start time cannot be in the past.");
        }

        // 1. Check against Space Closing Time
        String closingTimeString = booking.getSpace().getClosingTime();
        if (closingTimeString != null && !closingTimeString.isEmpty()) {
            try {
                // Assuming closingTime is stored as "HH:mm"
                LocalTime closingLocalTime = LocalTime.parse(closingTimeString, DateTimeFormatter.ofPattern("HH:mm"));
                LocalTime bookingEndLocalTime = booking.getEndTime().toLocalTime();

                // Booking end time must be less than or equal to closing time
                if (bookingEndLocalTime.isAfter(closingLocalTime)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking duration exceeds space closing time.");
                }
            } catch (DateTimeParseException e) {
                // Handle case where closingTime string is invalid format
                System.err.println("Could not parse closing time for space " + booking.getSpace().getId() + ": " + closingTimeString);
                // Depending on policy, you might throw an error or log and continue
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid closing time format configured for the space.");
            }
        } else {
             // Handle case where closingTime is not set for the space
             System.err.println("Closing time not set for space " + booking.getSpace().getId());
             // Depending on policy, you might throw an error or log and continue
             throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Closing time not configured for the space.");
        }


        // 2. Check for availability (overlapping bookings)
        if (!isTimeSlotAvailable(booking.getSpace().getId(), booking.getStartTime(), booking.getEndTime())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The selected time slot is no longer available.");
        }

        // 3. Save the booking if available and within closing time
        BookingEntity savedBooking = bookingRepo.save(booking);
        
        // 4. Try to sync with Google Calendar
        try {
            calendarService.createCalendarEvent(savedBooking);
        } catch (Exception e) {
            // Log the error but don't fail the booking if calendar sync fails
            System.err.println("Google Calendar integration failed: " + e.getMessage()); 
            // Consider using a proper logger here instead of System.err
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
            // Compare with the enum constant - changed to BOOKED
            if (BookingStatus.BOOKED == booking.getStatus()) { 
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

    // Add method to cancel a booking with reason
    @Transactional // Ensure the operation is atomic
    @Operation(summary = "Cancel a booking", description = "Marks a booking as cancelled with an optional reason")
    public BookingEntity cancelBooking(Long bookingId, String reason) {
        // Find the booking by ID. Use Long if your ID is Long.
        Optional<BookingEntity> bookingOpt = bookingRepo.findById(bookingId.intValue()); // Convert Long to int if ID is int
        
        if (bookingOpt.isPresent()) {
            BookingEntity booking = bookingOpt.get();
            // Compare with the enum constant - changed to BOOKED
            if (BookingStatus.BOOKED == booking.getStatus()) { 
                // Set status using the enum constant
                booking.setStatus(BookingStatus.CANCELLED);
                // Set cancellation reason if provided
                if (reason != null && !reason.trim().isEmpty()) {
                    booking.setCancellationReason(reason.trim());
                }
                // Set cancelledAt timestamp
                booking.setCancelledAt(java.time.LocalDateTime.now());
                return bookingRepo.save(booking);
            } else {
                throw new RuntimeException("Booking cannot be cancelled in its current state: " + booking.getStatus());
            }
        } else {
            throw new RuntimeException("Booking not found with ID: " + bookingId);
        }
    }

    // Updates bookings that are past their end time to COMPLETED status
    @Transactional
    @Operation(summary = "Update completed bookings", description = "Marks bookings as COMPLETED if their end time has passed")
    public void updateCompletedBookings() {
        // Get all BOOKED bookings
        List<BookingEntity> bookedBookings = bookingRepo.findByStatus(BookingStatus.BOOKED);
        
        // Current time for comparison
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
        // Loop through bookings and update those that have ended
        for (BookingEntity booking : bookedBookings) {
            if (booking.getEndTime() != null && booking.getEndTime().isBefore(now)) {
                booking.setStatus(BookingStatus.COMPLETED);
                bookingRepo.save(booking);
            }
        }
    }

    // Add method to get bookings for a specific space on a given date
    @Operation(summary = "Get bookings for space on date", description = "Fetches all BOOKED bookings for a specific space on a given date")
    public List<BookingEntity> getBookingsForSpaceOnDate(int spaceId, LocalDate date) {
        LocalDateTime dayStart = date.atStartOfDay(); // Start of the day (00:00:00)
        LocalDateTime dayEnd = date.atTime(LocalTime.MAX);   // End of the day (23:59:59.999...)
        return bookingRepo.findBookingsForSpaceOnDate(spaceId, dayStart, dayEnd, BookingStatus.BOOKED);
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
