package cit.edu.studyspace.service;

import cit.edu.studyspace.dto.BookingResponseDTO; // Import enhanced DTO
import cit.edu.studyspace.dto.BookingUpdateAdminDTO; // Import new DTO
import cit.edu.studyspace.entity.BookingEntity;
import cit.edu.studyspace.entity.BookingStatus; // Import the enum
import cit.edu.studyspace.entity.SpaceEntity; // Import SpaceEntity
import cit.edu.studyspace.entity.UserEntity; // Import UserEntity
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
import java.util.stream.Collectors; // Import Collectors
import java.math.BigDecimal;
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

    // Helper to convert BookingEntity to the enhanced BookingResponseDTO
    // Change visibility from private to public
    public BookingResponseDTO convertToResponseDTO(BookingEntity booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setNumberOfPeople(booking.getNumberOfPeople());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setCancellationReason(booking.getCancellationReason());

        // Safely access Space details
        SpaceEntity space = booking.getSpace();
        if (space != null) {
            dto.setSpaceId(space.getId());
            dto.setSpaceName(space.getName());
            dto.setSpaceLocation(space.getLocation());
            dto.setSpaceImageFilename(space.getImageFilename());
        } else {
             dto.setSpaceId(null);
             dto.setSpaceName("Space Deleted");
             dto.setSpaceLocation("");
             dto.setSpaceImageFilename(null);
        }

        // Safely access User details
        UserEntity user = booking.getUser();
        if (user != null) {
            dto.setUserName(user.getFirstName() + " " + user.getLastName());
            dto.setUserEmail(user.getEmail());
        } else {
            dto.setUserName("User Deleted");
            dto.setUserEmail("N/A");
        }

        return dto;
    }

    // Get all bookings with details for Admin view (using enhanced DTO)
    @Operation(summary = "Get all detailed bookings", description = "Fetches all bookings with user and space details")
    public List<BookingResponseDTO> getAllBookingsDetailed() {
        return bookingRepo.findAll().stream()
                .map(this::convertToResponseDTO) // Use the updated helper
                .collect(Collectors.toList());
    }

    // Update booking details (Status, Participants, Price) by Admin
    @Transactional
    @Operation(summary = "Update booking by admin", description = "Updates status, number of people, and/or total price for a booking")
    public BookingResponseDTO updateBookingByAdmin(int bookingId, BookingUpdateAdminDTO updateDTO) {
        // Find booking or throw 404
        BookingEntity booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found with ID: " + bookingId));

        boolean updated = false;

        // Update Status if provided and different
        if (updateDTO.getStatus() != null && updateDTO.getStatus() != booking.getStatus()) {
            // Add validation if needed (e.g., prevent changing from CANCELLED/COMPLETED back to BOOKED?)
            // Example: Allow changing TO Cancelled/Completed, but not FROM them easily by admin?
            // if (booking.getStatus() == BookingStatus.CANCELLED || BookingStatus.COMPLETED) {
            //     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot change status from CANCELLED or COMPLETED via this method.");
            // }

            booking.setStatus(updateDTO.getStatus());

            // Handle cancellation timestamp and reason logic
            if (updateDTO.getStatus() == BookingStatus.CANCELLED && booking.getCancelledAt() == null) {
                 booking.setCancelledAt(LocalDateTime.now());
                 // Optionally set a default reason if none provided in DTO (DTO doesn't have reason field)
                 // if (booking.getCancellationReason() == null || booking.getCancellationReason().isEmpty()) {
                 //    booking.setCancellationReason("Cancelled by Admin");
                 // }
            } else if (updateDTO.getStatus() != BookingStatus.CANCELLED) {
                 // Clear cancellation details if status changes away from CANCELLED
                 booking.setCancelledAt(null);
                 booking.setCancellationReason(null);
            }
            updated = true;
        }

        // Update Number of People if provided and different
        if (updateDTO.getNumberOfPeople() != null && !updateDTO.getNumberOfPeople().equals(booking.getNumberOfPeople())) { // Use equals for Integer comparison
            // Validate against space capacity
            if (booking.getSpace() != null && updateDTO.getNumberOfPeople() > booking.getSpace().getCapacity()) {
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Number of participants (" + updateDTO.getNumberOfPeople() + ") exceeds space capacity (" + booking.getSpace().getCapacity() + ").");
            }
            if (updateDTO.getNumberOfPeople() <= 0) {
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Number of participants must be positive.");
            }
            booking.setNumberOfPeople(updateDTO.getNumberOfPeople());
            updated = true;
        }

        // Update Total Price if provided and different
        // Use Double comparison (handle potential nulls and floating point comparison carefully)
        if (updateDTO.getTotalPrice() != null) {
            // Check if the booking's current price is different or null
            // Note: Direct comparison of doubles can be tricky due to precision.
            // For this update logic, checking if the new value is provided and differs significantly might be enough.
            // A simple check for difference: (handle null case for booking.getTotalPrice())
            boolean priceChanged = booking.getTotalPrice() == null || !booking.getTotalPrice().equals(updateDTO.getTotalPrice());

            if (priceChanged) {
                // Add validation if needed (e.g., price must be non-negative)
                if (updateDTO.getTotalPrice() < 0.0) { // Compare Double with 0.0
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Total price cannot be negative.");
                }
                booking.setTotalPrice(updateDTO.getTotalPrice()); // Pass the Double
                updated = true;
            }
        }

        if (updated) {
            BookingEntity savedBooking = bookingRepo.save(booking);
            return convertToResponseDTO(savedBooking); // Return updated DTO
        } else {
            // If nothing changed, just return the current state as DTO
            return convertToResponseDTO(booking);
        }
    }
}
