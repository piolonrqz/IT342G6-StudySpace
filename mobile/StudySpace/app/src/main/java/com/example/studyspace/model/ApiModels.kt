package com.example.studyspace.model

import java.time.LocalDateTime

// User entity model
data class UserEntity(
    val id: Int,
    val firstName: String?,
    val lastName: String?,
    val email: String?,
    val password: String?,
    val phoneNumber: String?,
    val emailVerified: Boolean?,
    val createdAt: String?,
    val updatedAt: String?,
    val lastLogin: String?,
    val role: String?,
    val profilePictureFilename: String?
)

// DTO for updating user
data class UserUpdateDTO(
    val firstName: String?,
    val lastName: String?,
    val email: String?,
    val phoneNumber: String?,
    val role: String?,
    val password: String?
)

// DTO for password change
data class PasswordChangeDTO(
    val currentPassword: String,
    val newPassword: String
)

data class PasswordSetDTO(
    val newPassword: String
)

// Booking response DTO
 data class BookingResponseDTO(
    val id: Int?,
    val startTime: String?,
    val endTime: String?,
    val numberOfPeople: Int?,
    val totalPrice: Double?,
    val status: String?,
    val spaceId: Int?,
    val spaceName: String?,
    val spaceLocation: String?,
    val spaceImageFilename: String?,
    val userName: String?,
    val userEmail: String?,
    val createdAt: String?,
    val cancellationReason: String?
)

// DTO for admin booking update
 data class BookingUpdateAdminDTO(
    val status: String?,
    val numberOfPeople: Int?
)

// Booking DTO for creating a booking
 data class BookingDTO(
    val userId: Int?,
    val spaceId: Int?,
    val startTime: String?,
    val endTime: String?,
    val duration: Int?,
    val participants: Int?,
    val purpose: String?,
    val totalPrice: Double?,
    val status: String?
)

// DTO for checking booking availability
 data class BookingAvailabilityRequestDTO(
    val spaceId: Int?,
    val startTime: String?,
    val endTime: String?
)

// Space list DTO
 data class SpaceListDTO(
    val id: Int?,
    val name: String?,
    val description: String?,
    val location: String?,
    val capacity: Int?,
    val spaceType: String?,
    val isAvailable: Boolean?,
    val openingTime: String?,
    val closingTime: String?,
    val imageFilename: String?,
    val price: Double?
)
