package cit.edu.studyspace.controller;

import cit.edu.studyspace.entity.Booking;
import cit.edu.studyspace.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Booking API", description = "Operations related to bookings")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;

    // Check
    @GetMapping("/test")
    @Operation(summary = "Test Connection", description = "Test API Connection - must return 'Hello, Booking! Test' and '200'")
    public String print() {
        return "Hello, Booking! Test";
    }

    @GetMapping("/getAll")
    @Operation(summary = "Get all bookings", description = "Fetches all bookings in the system")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping("/save")
    @Operation(summary = "Create a new booking", description = "Adds a new booking to the system")
    public Booking saveBooking(@RequestBody Booking booking) {

        Booking savedBooking = booking;
        
        return savedBooking;
    }
}
