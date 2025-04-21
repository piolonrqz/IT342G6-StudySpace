package cit.edu.studyspace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cit.edu.studyspace.entity.BookingEntity;
import java.util.List; // Import List

@Repository
// Assuming BookingEntity ID is Integer based on the entity definition
public interface BookingRepo extends JpaRepository<BookingEntity, Integer> {

    // Add method to find bookings by user ID
    // Spring Data JPA will generate the query based on the method name
    // It assumes BookingEntity has a field 'user' which has a field 'id'
    List<BookingEntity> findByUserId(Long userId);

}
