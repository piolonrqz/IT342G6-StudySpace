package cit.edu.studyspace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cit.edu.studyspace.entity.Space;

@Repository
public interface SpaceRepo extends JpaRepository<Space, Integer>{
    
}