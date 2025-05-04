package com.example.studyspace.network

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.DELETE
import retrofit2.http.Path
import retrofit2.http.Query
import com.example.studyspace.model.*

data class GreetingResponse(
    val message: String
)

data class RegisterRequest(
    val email: String,
    val fname: String,
    val lname: String,
    val password: String
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
    val token: String,
    val role: String,
    val userId: String
)

interface ApiService {
    @GET("api/users/print")
    suspend fun getGreeting(): Response<GreetingResponse>

    @POST("api/users/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("api/users/save")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>

    // --- User Endpoints ---
    @GET("api/users/me")
    suspend fun getCurrentUser(): Response<Map<String, Any>>

    @GET("api/users/check-email")
    suspend fun checkEmailUnique(@Query("email") email: String): Response<Boolean>

    @GET("api/users/getAll")
    suspend fun getAllUsers(): Response<List<UserEntity>>

    @PUT("api/users/update/{id}")
    suspend fun updateUser(
        @Path("id") id: Int,
        @Body userData: UserUpdateDTO
    ): Response<UserEntity>

    @DELETE("api/users/delete/{id}")
    suspend fun deleteUser(@Path("id") id: Int): Response<String>

    @PUT("api/users/change-password/{id}")
    suspend fun changePassword(
        @Path("id") id: Int,
        @Body passwordChange: PasswordChangeDTO
    ): Response<Map<String, String>>

    @POST("api/users/set-password/{id}")
    suspend fun setPassword(
        @Path("id") id: Int,
        @Body passwordSet: PasswordSetDTO
    ): Response<Map<String, String>>

    // --- Booking Endpoints ---
    @GET("api/bookings/test")
    suspend fun bookingTest(): Response<String>

    @GET("api/bookings/detailed")
    suspend fun getAllBookingsDetailed(): Response<List<BookingResponseDTO>>

    @PUT("api/bookings/updateAdmin/{id}")
    suspend fun updateBookingByAdmin(
        @Path("id") id: Int,
        @Body updateDTO: BookingUpdateAdminDTO
    ): Response<BookingResponseDTO>

    @GET("api/bookings/user/{userId}")
    suspend fun getBookingsByUserId(@Path("userId") userId: Long): Response<List<BookingResponseDTO>>

    @POST("api/bookings/save")
    suspend fun saveBooking(@Body bookingDTO: BookingDTO): Response<BookingResponseDTO>

    @PUT("api/bookings/{bookingId}/cancel")
    suspend fun cancelBooking(
        @Path("bookingId") bookingId: Long,
        @Body reason: Map<String, String>?
    ): Response<BookingResponseDTO>

    @DELETE("api/bookings/delete/{id}")
    suspend fun deleteBooking(@Path("id") id: Int): Response<Map<String, String>>

    @POST("api/bookings/update-completed")
    suspend fun updateCompletedBookings(): Response<Map<String, Any>>

    @GET("api/bookings/space/{spaceId}/date/{dateString}")
    suspend fun getBookingsForSpaceOnDate(
        @Path("spaceId") spaceId: Int,
        @Path("dateString") dateString: String
    ): Response<List<BookingResponseDTO>>

    @POST("api/bookings/check-availability")
    suspend fun checkAvailability(@Body requestDTO: BookingAvailabilityRequestDTO): Response<Map<String, Any>>

    // --- Space Endpoints ---
    @GET("api/space/test")
    suspend fun spaceTest(): Response<String>

    @GET("api/space/getAll")
    suspend fun getAllSpaces(): Response<List<SpaceListDTO>>

    @GET("api/space/{id}")
    suspend fun getSpaceById(@Path("id") id: Int): Response<SpaceListDTO>

    // For file upload endpoints, use @Multipart in Retrofit and implement as needed:
    // @Multipart
    // @POST("api/space/save")
    // suspend fun saveSpace(
    //     @Part("spaceData") spaceData: RequestBody,
    //     @Part imageFile: MultipartBody.Part?
    // ): Response<Any>

    // @Multipart
    // @PUT("api/space/update/{id}")
    // suspend fun updateSpace(
    //     @Path("id") id: Int,
    //     @Part("spaceData") spaceData: RequestBody,
    //     @Part imageFile: MultipartBody.Part?
    // ): Response<Any>

    @DELETE("api/space/delete/{id}")
    suspend fun deleteSpace(@Path("id") id: Int): Response<String>

    // --- OAuth Endpoints ---
    @GET("api/auth/google")
    suspend fun initiateGoogleOAuth(): Response<Void> // This will redirect, handle accordingly

    @GET("api/auth/user-exists")
    suspend fun checkUserExists(@Query("email") email: String): Response<Map<String, Boolean>>
}