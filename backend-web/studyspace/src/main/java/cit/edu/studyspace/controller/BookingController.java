package cit.edu.studyspace.controller;

import cit.edu.studyspace.dto.BookingDTO; // Import DTO
import cit.edu.studyspace.dto.BookingResponseDTO; // Import the new DTO
import cit.edu.studyspace.dto.BookingAvailabilityRequestDTO; // Import the moved DTO
import cit.edu.studyspace.dto.BookingUpdateAdminDTO; // Import new DTO
import cit.edu.studyspace.entity.BookingEntity;
import cit.edu.studyspace.entity.BookingStatus;
import cit.edu.studyspace.entity.SpaceEntity;
import cit.edu.studyspace.entity.UserEntity;
import cit.edu.studyspace.repository.SpaceRepo; // Import SpaceRepo
import cit.edu.studyspace.repository.UserRepo; // Import UserRepo
import cit.edu.studyspace.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException; // For better error handling
import org.slf4j.Logger; // Import Logger
import org.slf4j.LoggerFactory; // Import LoggerFactory
import java.time.LocalDate; // Import LocalDate
import java.time.format.DateTimeParseException; // Import DateTimeParseException

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors; // Import Collectors

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Booking API", description = "Operations related to bookings")
public class BookingController {

    // Add logger
    private static final Logger log = LoggerFactory.getLogger(BookingController.class);
    
    @Autowired
    private BookingService bookingService;

    // Inject UserRepo and SpaceRepo
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SpaceRepo spaceRepo;

    // Check
    @GetMapping("/test")
    @Operation(summary = "Test Connection", description = "Test API Connection - must return 'Hello, Booking! Test' and '200'")
    public String print() {
        return "Hello, Booking! Test";
    }

    // --- Admin/Detailed Endpoint ---
    @GetMapping("/detailed")
    @Operation(summary = "Get all detailed bookings", description = "Fetches all bookings with detailed user/space info, suitable for admin panel")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookingsDetailed() {
        try {
            List<BookingResponseDTO> bookings = bookingService.getAllBookingsDetailed();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            log.error("Error fetching all detailed bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Or return an error DTO
        }
    }

    // --- Admin Update Endpoint ---
    @PutMapping("/updateAdmin/{id}")
    @Operation(summary = "Update booking by Admin", description = "Allows admin to update status and participant count of a booking")
    public ResponseEntity<?> updateBookingByAdmin(@PathVariable int id, @RequestBody BookingUpdateAdminDTO updateDTO) {
        try {
            log.info("Admin updating booking ID: {} with Status: {}, Participants: {}", id, updateDTO.getStatus(), updateDTO.getNumberOfPeople());
            BookingResponseDTO updatedBooking = bookingService.updateBookingByAdmin(id, updateDTO);
            return ResponseEntity.ok(updatedBooking);
        } catch (ResponseStatusException e) {
            log.error("Error updating booking {} by admin ({}): {}", id, e.getStatusCode(), e.getReason(), e);
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            log.error("Unexpected error updating booking {} by admin", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update booking", "message", e.getMessage()));
        }
    }

    // Helper method to convert BookingEntity to BookingResponseDTO
    private BookingResponseDTO convertToResponseDTO(BookingEntity booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setNumberOfPeople(booking.getNumberOfPeople());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());

        // Safely access Space details
        if (booking.getSpace() != null) {
            dto.setSpaceId(booking.getSpace().getId());
            dto.setSpaceName(booking.getSpace().getName());
            dto.setSpaceLocation(booking.getSpace().getLocation());
            dto.setSpaceImageFilename(booking.getSpace().getImageFilename());
        } else {
            // Handle cases where space might be null (e.g., if deleted)
             dto.setSpaceId(null);
             dto.setSpaceName("Space Deleted");
             dto.setSpaceLocation("");
             dto.setSpaceImageFilename(null);
        }

        return dto;
    }

    // Add logging to fetching method too
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get bookings by user ID", description = "Fetches all bookings for a specific user as DTOs")
    // Change return type to List<BookingResponseDTO>
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByUserId(@PathVariable Long userId) {
        log.info("Fetching bookings for user ID: {}", userId);
        List<BookingEntity> bookings = bookingService.getBookingsByUserId(userId);
        log.info("Found {} bookings for user ID: {}", bookings.size(), userId);

        // Map the list of entities to a list of DTOs
        List<BookingResponseDTO> bookingDTOs = bookings.stream()
                .map(this::convertToResponseDTO) // Use the helper method
                .collect(Collectors.toList());

        // Log details of the first DTO if available
        if (!bookingDTOs.isEmpty()) {
            BookingResponseDTO firstDto = bookingDTOs.get(0);
             log.debug("First booking DTO details: ID={}, StartTime={}, People={}, Price={}, Status={}, SpaceName={}",
                firstDto.getId(),
                firstDto.getStartTime(),
                firstDto.getNumberOfPeople(),
                firstDto.getTotalPrice(),
                firstDto.getStatus(),
                firstDto.getSpaceName()
            );
        }
        // Return the list of DTOs
        return ResponseEntity.ok(bookingDTOs);
    }

    @PostMapping("/save")
    @Operation(summary = "Create a new booking", description = "Adds a new booking to the system using DTO")
    // Change return type to ResponseEntity<?> to handle both DTO and error maps
    public ResponseEntity<?> saveBooking(@RequestBody BookingDTO bookingDTO) {
        try {
            // 1. Fetch User and Space entities
            UserEntity user = userRepo.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + bookingDTO.getUserId()));
            
            SpaceEntity space = spaceRepo.findById(bookingDTO.getSpaceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Space not found with ID: " + bookingDTO.getSpaceId()));

            // 2. Create and populate BookingEntity from DTO
            BookingEntity booking = new BookingEntity();
            booking.setUser(user);
            booking.setSpace(space);
            booking.setStartTime(bookingDTO.getStartTime());
            booking.setEndTime(bookingDTO.getEndTime());
            // Ensure this field name matches your BookingEntity
            booking.setNumberOfPeople(bookingDTO.getParticipants()); 
            // booking.setPurpose(bookingDTO.getPurpose()); // Uncomment if needed in BookingEntity
            booking.setTotalPrice(bookingDTO.getTotalPrice()); // Map totalPrice from DTO

            // Set status - default to BOOKED if null or invalid
            try {
                // If a status is provided in the DTO and it's valid, use it. Otherwise, default to BOOKED.
                booking.setStatus(bookingDTO.getStatus() != null ? BookingStatus.valueOf(bookingDTO.getStatus().toUpperCase()) : BookingStatus.BOOKED);
            } catch (IllegalArgumentException e) {
                booking.setStatus(BookingStatus.BOOKED); // Default to BOOKED if the provided status string is invalid
            }

            // *** Add Logging Here ***
            log.info("Attempting to save booking entity: User={}, Space={}, StartTime={}, EndTime={}, People={}, Price={}, Status={}",
                booking.getUser().getId(),
                booking.getSpace().getId(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getNumberOfPeople(), // Log the value being saved
                booking.getTotalPrice(),     // Log the value being saved
                booking.getStatus()          // Log the value being saved
            );

            // 3. Save the booking using the service
            BookingEntity savedBooking = bookingService.saveBooking(booking);
            log.info("Booking saved successfully with ID: {}", savedBooking.getId());
            
            // 4. Map the saved BookingEntity back to a BookingDTO for the response
            BookingDTO responseDTO = new BookingDTO();
            responseDTO.setUserId(savedBooking.getUser().getId());
            responseDTO.setSpaceId(savedBooking.getSpace().getId());
            responseDTO.setStartTime(savedBooking.getStartTime());
            responseDTO.setEndTime(savedBooking.getEndTime());
            responseDTO.setParticipants(savedBooking.getNumberOfPeople());
            // responseDTO.setPurpose(savedBooking.getPurpose()); // Uncomment if needed
            responseDTO.setTotalPrice(savedBooking.getTotalPrice()); // Include totalPrice in response DTO
            responseDTO.setStatus(savedBooking.getStatus().name());
            // Optionally add the booking ID to the response DTO if needed by the frontend
            // responseDTO.setId(savedBooking.getId()); 

            // Return the DTO
            return ResponseEntity.ok(responseDTO);

        } catch (ResponseStatusException e) {
            log.error("Error creating booking ({}): {}", e.getStatusCode(), e.getReason(), e);
            // Handle specific 404 errors
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            log.error("Unexpected error creating booking", e);
            // Handle other potential errors during conversion or saving
            e.printStackTrace(); // Log the full error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create booking", "message", e.getMessage()));
        }
    }

    // Add request body class for cancellation
    static class CancellationRequest {
        private String reason;
        
        public String getReason() {
            return reason;
        }
        
        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    // Add endpoint to cancel a booking with reason
    @PutMapping("/{bookingId}/cancel")
    @Operation(summary = "Cancel a booking", description = "Marks a booking as cancelled with optional reason")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId, @RequestBody(required = false) CancellationRequest request) {
        try {
            String reason = (request != null) ? request.getReason() : null;
            log.info("Cancelling booking ID: {} with reason: {}", bookingId, reason != null ? reason : "No reason provided");
            
            BookingEntity cancelledBooking = bookingService.cancelBooking(bookingId, reason);
            // Convert cancelled entity to the detailed response DTO
            BookingResponseDTO responseDTO = bookingService.convertToResponseDTO(cancelledBooking); // Requires convertToResponseDTO to be accessible
            return ResponseEntity.ok(responseDTO); // Return the detailed DTO
        } catch (RuntimeException e) {
            log.error("Error cancelling booking: {}", e.getMessage());
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete a booking", description = "Removes a booking from the database by its ID")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable int id){ // Return JSON map
        try {
            log.info("Attempting to delete booking ID: {}", id);
            String result = bookingService.deleteBooking(id);
            if (result.contains("NOT FOUND")) {
                 log.warn("Booking ID {} not found for deletion.", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", result));
            } else {
                 log.info("Booking ID {} deleted successfully.", id);
                return ResponseEntity.ok(Map.of("message", result));
            }
        } catch (Exception e) {
             log.error("Error deleting booking ID: {}", id, e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to delete booking.", "message", e.getMessage()));
        }
    }

    // Add endpoint to manually update completed bookings
    @PostMapping("/update-completed")
    @Operation(summary = "Manually update completed bookings", description = "Marks past bookings as COMPLETED")
    public ResponseEntity<Map<String, Object>> updateCompletedBookings() {
        try {
            log.info("Manually triggering update of completed bookings");
            bookingService.updateCompletedBookings();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Completed bookings have been updated"
            ));
        } catch (Exception e) {
            log.error("Error updating completed bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "error", "Failed to update completed bookings",
                    "message", e.getMessage()
                ));
        }
    }

    // New endpoint to get bookings for a specific space and date
    @GetMapping("/space/{spaceId}/date/{dateString}")
    @Operation(summary = "Get bookings for space on date", description = "Fetches all BOOKED bookings for a specific space on a given date (YYYY-MM-DD)")
    public ResponseEntity<?> getBookingsForSpaceOnDate(
            @PathVariable int spaceId,
            @PathVariable String dateString) {
        try {
            LocalDate date = LocalDate.parse(dateString); // Expecting YYYY-MM-DD format
            log.info("Fetching bookings for Space ID: {} on Date: {}", spaceId, dateString);
            List<BookingEntity> bookings = bookingService.getBookingsForSpaceOnDate(spaceId, date);
            
            // Convert to Response DTOs for consistency (optional, but good practice)
            List<BookingResponseDTO> bookingDTOs = bookings.stream()
                .map(this::convertToResponseDTO) 
                .collect(Collectors.toList());
                
            log.info("Found {} bookings for Space ID: {} on Date: {}", bookingDTOs.size(), spaceId, dateString);
            return ResponseEntity.ok(bookingDTOs);
        } catch (DateTimeParseException e) {
            log.error("Invalid date format provided: {}", dateString, e);
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format. Please use YYYY-MM-DD."));
        } catch (Exception e) {
            log.error("Error fetching bookings for space {} on date {}: {}", spaceId, dateString, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch bookings for the specified space and date."));
        }
    }

    @PostMapping("/check-availability")
    @Operation(summary = "Check booking availability", description = "Checks if a specific time slot for a space is available")
    public ResponseEntity<?> checkAvailability(@RequestBody BookingAvailabilityRequestDTO requestDTO) {
        log.info("Checking availability for Space ID: {}, Start: {}, End: {}", 
                 requestDTO.getSpaceId(), requestDTO.getStartTime(), requestDTO.getEndTime());
                 
        if (requestDTO.getSpaceId() == null || requestDTO.getStartTime() == null || requestDTO.getEndTime() == null) {
             return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields: spaceId, startTime, endTime"));
        }

        boolean available = bookingService.isTimeSlotAvailable(
            requestDTO.getSpaceId(),
            requestDTO.getStartTime(),
            requestDTO.getEndTime()
        );

        if (available) {
            log.info("Time slot is available.");
            return ResponseEntity.ok().body(Map.of("available", true)); // Return JSON object
        } else {
            log.warn("Time slot is NOT available.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("available", false)); // Return JSON object
        }
    }
}
