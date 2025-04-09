package cit.edu.studyspace.service;

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
    public SpaceEntity saveSpace(SpaceEntity space) {
        return spaceRepo.save(space);
    }

    // Update an existing space
    @Operation(summary = "Update an existing space", description = "Updates a space based on the given ID and details")
    public SpaceEntity updateSpace(int id, SpaceEntity spaceDetails) {
        Optional<SpaceEntity> optionalSpace = spaceRepo.findById(id);
        if (optionalSpace.isPresent()) {
            SpaceEntity existingSpace = optionalSpace.get();
            
            // Update fields from spaceDetails
            existingSpace.setName(spaceDetails.getName());
            existingSpace.setDescription(spaceDetails.getDescription());
            existingSpace.setLocation(spaceDetails.getLocation());
            existingSpace.setCapacity(spaceDetails.getCapacity());
            existingSpace.setSpaceType(spaceDetails.getSpaceType());
            existingSpace.setAvailable(spaceDetails.isAvailable());
            existingSpace.setOpeningTime(spaceDetails.getOpeningTime());
            existingSpace.setClosingTime(spaceDetails.getClosingTime());
            existingSpace.setImageUrl(spaceDetails.getImageUrl());
            existingSpace.setPrice(spaceDetails.getPrice());
            
            // The @PreUpdate annotation in SpaceEntity handles updatedAt
            return spaceRepo.save(existingSpace); // Save the updated entity
        } else {
            // Return null or throw an exception if the space is not found
            return null; 
        }
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
