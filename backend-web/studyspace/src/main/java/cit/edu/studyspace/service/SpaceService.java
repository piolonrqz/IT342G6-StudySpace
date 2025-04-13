package cit.edu.studyspace.service;

import cit.edu.studyspace.dto.SpaceCreateDTO;
import cit.edu.studyspace.dto.SpaceUpdateDTO;
import cit.edu.studyspace.entity.SpaceEntity;
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
    public List<SpaceEntity> getAllSpaces() {
        return spaceRepo.findAll();
    }

    // Retrieves a space by its ID.
    @Operation(summary = "Get space by ID", description = "Fetches a space based on the given ID")
    public Optional<SpaceEntity> getSpaceById(int id) {
        return spaceRepo.findById(id);
    }

    // Creates a new space.
    @Operation(summary = "Create a new space", description = "Adds a new space to the system")
    public SpaceEntity createSpaceFromDTO(SpaceCreateDTO dto) {
        SpaceEntity space = new SpaceEntity();
        space.setName(dto.getName());
        space.setDescription(dto.getDescription());
        space.setLocation(dto.getLocation());
        space.setCapacity(dto.getCapacity());
        space.setSpaceType(dto.getSpaceType());
        space.setAvailable(dto.isAvailable());
        space.setOpeningTime(dto.getOpeningTime());
        space.setClosingTime(dto.getClosingTime());
        space.setImageUrl(dto.getImageUrl());

        return spaceRepo.save(space);
    }

    // Update an existing space
    @Operation(summary = "Update an existing space", description = "Updates a space based on the given ID and details")
    public SpaceEntity updateSpaceFromDTO(int id, SpaceUpdateDTO dto) {
        Optional<SpaceEntity> optionalSpace = spaceRepo.findById(id);
        if (optionalSpace.isPresent()) {
            SpaceEntity space = optionalSpace.get();

            space.setName(dto.getName());
            space.setDescription(dto.getDescription());
            space.setLocation(dto.getLocation());
            space.setCapacity(dto.getCapacity());
            space.setSpaceType(dto.getSpaceType());
            space.setAvailable(dto.isAvailable());
            space.setOpeningTime(dto.getOpeningTime());
            space.setClosingTime(dto.getClosingTime());
            space.setImageUrl(dto.getImageUrl());

            return spaceRepo.save(space);
        }
        return null;
    }

    // Deletes a user by their ID.
    // Refactored to use Optional and return clearer messages
    @Operation(summary = "Delete a space", description = "Removes a space from the database")
    public String deleteSpace(int id) {
        Optional<SpaceEntity> optionalSpace = spaceRepo.findById(id);
        if (optionalSpace.isPresent()){
            spaceRepo.deleteById(id);
            return "Space Successfully Deleted!";
        } else {
            return "Space not found";
        }
    }
}
