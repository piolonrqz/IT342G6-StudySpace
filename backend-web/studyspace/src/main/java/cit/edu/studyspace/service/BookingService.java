package cit.edu.studyspace.service;

import cit.edu.studyspace.entity.BookingEntity;
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
    public List<BookingEntity> getAllBookings() {
        return bookingRepo.findAll();
    }

    // Retrieves a booking by their ID.
    @Operation(summary = "Get booking by ID", description = "Fetches a booking based on the given ID")
    public Optional<BookingEntity> getBookingById(int id) {
        return bookingRepo.findById(id);
    }

    // Creates a new booking.
    @Operation(summary = "Create a new booking", description = "Adds a new booking to the system")
    public BookingEntity saveBooking(BookingEntity booking) {
        return bookingRepo.save(booking);
    }

    // Deletes a booking by their ID.
    @Operation(summary = "Delete a booking", description = "Removes a booking from the database")
    public String deleteBooking(int id) {
        String msg = " ";
        if (bookingRepo.findById(id)!=null){
            bookingRepo.deleteById(id);
            msg = "Booking record successfully deleted!";
        }else
            msg = id + "NOT FOUND!";
        return msg;
    }
}
