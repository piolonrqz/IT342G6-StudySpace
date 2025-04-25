package cit.edu.studyspace.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Request to check booking availability")
public class BookingAvailabilityRequestDTO {

    @Schema(description = "ID of the space to check", example = "1")
    private Integer spaceId;

    @Schema(description = "Desired start time", example = "2025-04-15T10:00:00")
    private LocalDateTime startTime;

    @Schema(description = "Desired end time", example = "2025-04-15T12:00:00")
    private LocalDateTime endTime;

    // Getters and Setters
    public Integer getSpaceId() { return spaceId; }
    public void setSpaceId(Integer spaceId) { this.spaceId = spaceId; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
}
