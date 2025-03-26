package cit.edu.studyspace.service;

import cit.edu.studyspace.entity.Space;
import cit.edu.studyspace.repository.SpaceRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Tag(name = "Space Service", description = "Business logic for space operations")
public class SpaceService {
    
    @Autowired
    private SpaceRepo spaceRepo;

    public SpaceService(){
        super();
    }

    // Retrieves all spaces from the database.
    @Operation(summary = "Get all spaces", description = "Fetches all spaces from the database")
    public List<Space> getAllSpaces() {
        return spaceRepo.findAll();
    }

    // Retrieves a space by its ID.
    @Operation(summary = "Get space by ID", description = "Fetches a space based on the given ID")
    public Optional<Space> getSpaceById(int id) {
        return spaceRepo.findById(id);
    }

    // Creates a new space.
    @Operation(summary = "Create a new space", description = "Adds a new space to the system")
    public Space createSpace(Space space) {
        return spaceRepo.save(space);
    }

}
