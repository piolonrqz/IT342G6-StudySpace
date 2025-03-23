package cit.edu.studyspace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cit.edu.studyspace.entity.UserEntity;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Integer>{
    
}