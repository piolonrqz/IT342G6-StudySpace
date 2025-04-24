package cit.edu.studyspace.scheduling;

import cit.edu.studyspace.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class BookingScheduler {

    @Autowired
    private BookingService bookingService;

    // Run every hour to check for completed bookings
    @Scheduled(cron = "0 0 * * * *")
    public void checkCompletedBookings() {
        bookingService.updateCompletedBookings();
    }
}