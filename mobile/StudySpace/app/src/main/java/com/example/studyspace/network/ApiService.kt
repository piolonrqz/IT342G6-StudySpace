package com.example.studyspace.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

// --- Auth & User Models ---
data class GreetingResponse(
    val message: String
)

data class RegisterRequest(
    val email: String,
    val firstName: String,
    val lastName: String,
    val password: String,
    val phoneNumber: String? = null,
    val emailVerified: Boolean = false,
    val role: String = "USER"
)

data class RegisterResponse(
    val token: String,
    val role: String,
    val userId: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String? = null,
    val role: String? = null,
    val userId: Any? = null,
    val profilePictureFilename: String? = null,
    val error: String? = null
)

// --- Space API Service ---
interface ApiService {
    @GET("api/users/print")
    suspend fun getGreeting(): Response<GreetingResponse>

    @POST("api/users/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
    
    @GET("api/users/me")
    suspend fun getCurrentUser(@Header("Authorization") token: String): Response<Map<String, Any>>

    @POST("api/users/save")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>

    @GET("api/space/getAll")
    suspend fun getAllSpaces(): Response<List<Map<String, Any>>>

    @GET("api/space/{id}")
    suspend fun getSpaceById(@Path("id") id: Int): Response<Map<String, Any>>
    
    @GET("api/bookings/user/{userId}")
    suspend fun getUserBookings(@Path("userId") userId: Long, @Header("Authorization") token: String): Response<List<com.example.studyspace.model.BookingResponseDTO>>
}