package cit.edu.studyspace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query; // Import Query
import org.springframework.data.repository.query.Param; // Import Param

import cit.edu.studyspace.entity.BookingEntity;
import cit.edu.studyspace.entity.BookingStatus; // Import BookingStatus
import java.time.LocalDateTime; // Import LocalDateTime
import java.util.List; // Import List
import java.time.LocalDate; // Import LocalDate

@Repository
// Assuming BookingEntity ID is Integer based on the entity definition
public interface BookingRepo extends JpaRepository<BookingEntity, Integer> {

    // Add method to find bookings by user ID
    // Spring Data JPA will generate the query based on the method name
    // It assumes BookingEntity has a field 'user' which has a field 'id'
    List<BookingEntity> findByUserId(Long userId);

    // Add method to find bookings by status
    List<BookingEntity> findByStatus(cit.edu.studyspace.entity.BookingStatus status);

    // Add query to find overlapping bookings for a specific space and status
    @Query("SELECT b FROM BookingEntity b WHERE b.space.id = :spaceId AND b.status = :status AND b.startTime < :endTime AND b.endTime > :startTime")
    List<BookingEntity> findOverlappingBookings(
            @Param("spaceId") int spaceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("status") BookingStatus status
    );

    // Find bookings for a specific space that are active (BOOKED) and overlap with a given date range
    // This is useful for fetching all relevant bookings for a specific day
    @Query("SELECT b FROM BookingEntity b WHERE b.space.id = :spaceId AND b.status = :status AND b.startTime < :dayEnd AND b.endTime > :dayStart")
    List<BookingEntity> findBookingsForSpaceOnDate(
            @Param("spaceId") int spaceId,
            @Param("dayStart") LocalDateTime dayStart, // Start of the day (e.g., 00:00:00)
            @Param("dayEnd") LocalDateTime dayEnd,     // End of the day (e.g., 23:59:59.999)
            @Param("status") BookingStatus status
    );
}
