package cit.edu.studyspace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cit.edu.studyspace.entity.BookingEntity;

@Repository
public interface BookingRepo extends JpaRepository<BookingEntity, Integer> {


}
