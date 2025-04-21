package cit.edu.studyspace.controller;

import cit.edu.studyspace.dto.BookingDTO; // Import DTO
import cit.edu.studyspace.dto.BookingResponseDTO; // Import the new DTO
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

    @GetMapping("/getAll")
    @Operation(summary = "Get all bookings", description = "Fetches all bookings in the system")
    public List<BookingEntity> getAllBookings() {
        return bookingService.getAllBookings();
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

            // Set status - default to PENDING if null or invalid
            try {
                booking.setStatus(bookingDTO.getStatus() != null ? BookingStatus.valueOf(bookingDTO.getStatus().toUpperCase()) : BookingStatus.PENDING);
            } catch (IllegalArgumentException e) {
                booking.setStatus(BookingStatus.PENDING); // Default if status string is invalid
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

    // Add endpoint to cancel a booking
    @PutMapping("/{bookingId}/cancel")
    @Operation(summary = "Cancel a booking", description = "Marks a booking as cancelled")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        try {
            BookingEntity cancelledBooking = bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok(cancelledBooking);
        } catch (RuntimeException e) { // Catch specific exceptions if needed
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public String deleteBooking(@PathVariable int id){
        return bookingService.deleteBooking(id);
    }
}
