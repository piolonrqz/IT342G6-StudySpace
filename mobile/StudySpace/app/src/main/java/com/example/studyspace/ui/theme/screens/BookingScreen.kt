package com.example.studyspace.ui.theme.screens

import android.content.Context
import android.os.Build
import android.util.Base64
import android.util.Log
import androidx.annotation.RequiresApi
import org.json.JSONObject
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import coil3.compose.AsyncImage
import com.example.studyspace.R
import com.example.studyspace.model.BookingResponseDTO
import com.example.studyspace.network.ApiService
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

// Define TAG as a file-level constant for consistent logging
private const val TAG = "BookingScreen"

@RequiresApi(Build.VERSION_CODES.O)
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookingScreen(navController: NavHostController, apiService: ApiService) {
    var selectedItem by remember { mutableStateOf(1) }  // Default to Booking tab
    var bookings by remember { mutableStateOf<List<BookingResponseDTO>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    // Function to get JWT token from SharedPreferences
    fun getJwtToken(context: Context): String? {
        val sharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        val token = sharedPreferences.getString("jwt_token", null)
        if (token != null) {
            Log.d(TAG, "Retrieved JWT Token: $token")
        } else {
            Log.d(TAG, "JWT Token not found in SharedPreferences.")
        }
        return token
    }    // Function to get user ID from SharedPreferences
    fun getUserId(context: Context): Long? {
        val sharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        val userId = sharedPreferences.getLong("user_id", -1)
        if (userId != -1L) {
            Log.d(TAG, "Retrieved user ID: $userId")
            return userId
        } else {
            Log.d(TAG, "User ID not found in SharedPreferences or has default value -1")
            return null
        }
    }

    // Load user bookings
    LaunchedEffect(Unit) {
        isLoading = true
        error = null
          val token = getJwtToken(context)
        var userId = getUserId(context)
        
        // If userId is not found in SharedPreferences, try to extract it from the JWT token
        if (token != null && userId == null) {
            try {
                userId = extractUserIdFromToken(token)
                
                // If successful, save it to SharedPreferences for future use
                if (userId != null) {
                    val editor = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE).edit()
                    editor.putLong("user_id", userId)
                    editor.apply()
                    Log.d(TAG, "Extracted and saved user ID from token: $userId")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error extracting user ID from token", e)
            }
        }
          // Store userId in a non-nullable variable to avoid smart cast issues
        val finalUserId = userId
        
        if (token != null && finalUserId != null) {
            try {
                Log.d(TAG, "Attempting to fetch bookings for user ID: $finalUserId with token")
                val response = withContext(Dispatchers.IO) {
                    apiService.getUserBookings(finalUserId, "Bearer $token")
                }
                
                if (response.isSuccessful) {
                    bookings = response.body() ?: emptyList()
                    Log.d(TAG, "Fetched ${bookings.size} bookings for user $finalUserId")
                } else {
                    error = "Failed to fetch bookings: ${response.code()} ${response.message()}"
                    Log.e(TAG, error!!)
                }
            } catch (e: Exception) {
                error = "Error fetching bookings: ${e.message}"
                Log.e(TAG, "Exception fetching bookings", e)
            }
        } else {
            error = "Authentication required. Please log in again."
            Log.e(TAG, "Missing token or userId for booking API call - token: ${token != null}, userId: $userId")
        }
        
        isLoading = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "My Bookings",
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White
                )
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = selectedItem == 0,
                    onClick = {
                        selectedItem = 0
                        navController.navigate("home") {
                            popUpTo("home") { inclusive = true }
                        }
                    },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = "Home"
                        )
                    },
                    label = { Text("Home") }
                )
                NavigationBarItem(
                    selected = selectedItem == 1,
                    onClick = {
                        // Already on booking screen, no need to navigate
                    },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.DateRange,
                            contentDescription = "Booking"
                        )
                    },
                    label = { Text("Booking") }
                )
                NavigationBarItem(
                    selected = selectedItem == 2,
                    onClick = {
                        selectedItem = 2
                        navController.navigate("profile") {
                            popUpTo("profile") { inclusive = true }
                        }
                    },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = "Profile"
                        )
                    },
                    label = { Text("Profile") }
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when {
                isLoading -> {
                    // Show loading state
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        CircularProgressIndicator(color = Color(0xFF3498DB))
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Loading your bookings...",
                            color = Color.Gray
                        )
                    }
                }
                
                error != null -> {                    // Show error state
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = "Error",
                            tint = Color.Red,
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = error ?: "Unknown error occurred",
                            color = Color.Red,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        // More helpful message if the error is about missing authentication
                        if (error?.contains("Authentication required") == true || error?.contains("Missing token") == true) {
                            Text(
                                text = "Please log out and sign in again to refresh your session",
                                color = Color.Gray,
                                textAlign = TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(
                                onClick = {
                                    // Navigate to sign in screen
                                    navController.navigate("sign_in") {
                                        popUpTo("booking") { inclusive = true }
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3498DB))
                            ) {
                                Text("Sign In")
                            }
                        } else {
                            Button(
                                onClick = {
                                    coroutineScope.launch {
                                        isLoading = true
                                        error = null
                                        
                                        val token = getJwtToken(context)
                                        var userId = getUserId(context)
                                        
                                        // Try extracting userId from token if needed
                                        if (token != null && userId == null) {
                                            userId = extractUserIdFromToken(token)
                                            if (userId != null) {
                                                val editor = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE).edit()
                                                editor.putLong("user_id", userId)
                                                editor.apply()
                                            }
                                        }
                                          // Store userId in a non-nullable variable to avoid smart cast issues
                                        val finalUserId = userId
                                        
                                        if (token != null && finalUserId != null) {
                                            try {
                                                Log.d(TAG, "Retrying: Fetching bookings for user ID: $finalUserId")
                                                val response = withContext(Dispatchers.IO) {
                                                    apiService.getUserBookings(finalUserId, "Bearer $token")
                                                }
                                                
                                                if (response.isSuccessful) {
                                                    bookings = response.body() ?: emptyList()
                                                    Log.d(TAG, "Retry successful, fetched ${bookings.size} bookings")
                                                } else {
                                                    error = "Failed to fetch bookings: ${response.code()}"
                                                    Log.e(TAG, "Retry failed: $error")
                                                }
                                            } catch (e: Exception) {
                                                error = "Error fetching bookings: ${e.message}"
                                                Log.e(TAG, "Retry exception", e)
                                            }
                                        } else {
                                            error = "Authentication required. Please log in again."
                                            Log.e(TAG, "Retry failed: Missing token or userId")
                                        }
                                        
                                        isLoading = false
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3498DB))
                            ) {
                                Text("Retry")
                            }
                        }
                    }
                }
                
                bookings.isEmpty() -> {
                    // Show empty state
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.space1), // Replace with appropriate empty state image
                            contentDescription = "No bookings",
                            modifier = Modifier.size(120.dp),
                            alpha = 0.5f
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "You don't have any bookings yet",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Explore study spaces and make your first booking",
                            color = Color.Gray,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                        Button(
                            onClick = {
                                navController.navigate("home") {
                                    popUpTo("home") { inclusive = true }
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3498DB)),
                            modifier = Modifier.fillMaxWidth(0.7f)
                        ) {
                            Text(
                                text = "Explore Study Spaces",
                                modifier = Modifier.padding(vertical = 4.dp)
                            )
                        }
                    }
                }
                
                else -> {
                    // Show bookings list
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        item {
                            Spacer(modifier = Modifier.height(8.dp))
                        }
                        
                        items(bookings) { booking ->
                            val formattedDate = try {
                                val dateTime = LocalDateTime.parse(booking.startTime)
                                dateTime.format(DateTimeFormatter.ofPattern("EEE, MMM d"))
                            } catch (e: DateTimeParseException) {
                                "Date unavailable"
                            }
                            
                            val startTime = try {
                                val dateTime = LocalDateTime.parse(booking.startTime)
                                dateTime.format(DateTimeFormatter.ofPattern("HH:mm"))
                            } catch (e: DateTimeParseException) {
                                ""
                            }
                            
                            val endTime = try {
                                val dateTime = LocalDateTime.parse(booking.endTime)
                                dateTime.format(DateTimeFormatter.ofPattern("HH:mm"))
                            } catch (e: DateTimeParseException) {
                                ""
                            }
                            
                            val defaultImageRes = R.drawable.space1 // Fallback image resource
                            
                            BookingCard(
                                booking = booking,
                                date = formattedDate,
                                startTime = startTime,
                                endTime = endTime,
                                defaultImageRes = defaultImageRes
                            )
                        }
                        
                        item {
                            Spacer(modifier = Modifier.height(16.dp))
                        }
                    }
                }
            }
        }
    }
}

// BookingTabs function has been removed as it's no longer needed

@Composable
fun BookingCard(
    booking: BookingResponseDTO,
    date: String,
    startTime: String,
    endTime: String,
    defaultImageRes: Int
) {
    // Get colorful status indicator based on booking status
    val statusColor = when (booking.status?.uppercase()) {
        "BOOKED" -> Color(0xFF4CAF50) // Green
        "COMPLETED" -> Color(0xFF2196F3) // Blue
        "CANCELLED" -> Color(0xFFF44336) // Red
        else -> Color(0xFF9E9E9E) // Grey for unknown status
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(4.dp, RoundedCornerShape(16.dp)),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Space info row
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Space image - use AsyncImage for loading from URL if available
                if (booking.spaceImageFilename != null) {
                    AsyncImage(
                        model = booking.spaceImageFilename,
                        contentDescription = booking.spaceName,
                        modifier = Modifier
                            .size(80.dp)
                            .clip(RoundedCornerShape(8.dp)),
                        contentScale = ContentScale.Crop,
                        error = painterResource(id = defaultImageRes)
                    )
                } else {
                    // Fallback to default image if no image is available
                    Image(
                        painter = painterResource(id = defaultImageRes),
                        contentDescription = booking.spaceName,
                        modifier = Modifier
                            .size(80.dp)
                            .clip(RoundedCornerShape(8.dp)),
                        contentScale = ContentScale.Crop
                    )
                }

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .padding(start = 12.dp)
                ) {
                    // Status indicator
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(statusColor, CircleShape)
                        )
                        Text(
                            text = booking.status ?: "Unknown",
                            fontSize = 14.sp,
                            color = statusColor,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(start = 4.dp)
                        )
                    }

                    // Space name
                    Text(
                        text = booking.spaceName ?: "Unknown Space",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )

                    // Location
                    Text(
                        text = booking.spaceLocation ?: "Location not available",
                        fontSize = 14.sp,
                        color = Color.Gray,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Divider(
                modifier = Modifier
                    .padding(vertical = 12.dp)
                    .fillMaxWidth()
                    .background(Color(0xFFF0F0F0)),
                thickness = 1.dp
            )

            // Date and time info
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = null,
                    tint = Color(0xFF3498DB),
                    modifier = Modifier.size(18.dp)
                )
                Text(
                    text = date,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(start = 8.dp)
                )
                Text(
                    text = "•",
                    fontSize = 14.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(horizontal = 6.dp)
                )
                Text(
                    text = if (startTime.isNotEmpty() && endTime.isNotEmpty()) "$startTime - $endTime" else "Time not available",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )

                Spacer(modifier = Modifier.weight(1f))

                // People count
                Row(
                    verticalAlignment = Alignment.Bottom
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "Number of People",
                        tint = Color.Gray,
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        text = "${booking.numberOfPeople ?: "?"} people",
                        fontSize = 14.sp,
                        color = Color.Gray
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Show price 
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Total:",
                    fontSize = 14.sp,
                    color = Color.Gray
                )
                
                Spacer(modifier = Modifier.weight(1f))
                
                // Price
                Row(
                    verticalAlignment = Alignment.Bottom
                ) {
                    Text(
                        text = "₮",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${booking.totalPrice?.toInt() ?: 0}",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Action button
            Button(
                onClick = { /* Handle booking details click */ },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = when (booking.status?.uppercase()) {
                        "CANCELLED" -> Color.Gray
                        else -> Color(0xFF3498DB)
                    }
                ),
                enabled = booking.status?.uppercase() != "CANCELLED"
            ) {
                Text(
                    text = when (booking.status?.uppercase()) {
                        "BOOKED" -> "View Details"
                        "COMPLETED" -> "View Receipt"
                        "CANCELLED" -> "Cancelled"
                        else -> "View Details"
                    },
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(vertical = 4.dp)
                )
                Spacer(modifier = Modifier.size(8.dp))
                Icon(
                    imageVector = Icons.Default.AddCircle,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp)
                )
            }
            
            // Show cancellation reason if applicable
            if (!booking.cancellationReason.isNullOrEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Reason: ${booking.cancellationReason}",
                    fontSize = 14.sp,
                    color = Color.Gray,
                    fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                )
            }
        }
    }
}    // Function to extract user ID from JWT token
    private fun extractUserIdFromToken(jwtToken: String): Long? {
        try {
            val parts = jwtToken.split(".")
            if (parts.size != 3) {
                Log.e(TAG, "Invalid JWT token format")
                return null
            }
            
            val payload = parts[1]
            val decodedBytes = Base64.decode(payload, Base64.URL_SAFE)
            val decodedString = String(decodedBytes, Charsets.UTF_8)
            
            val jsonObject = JSONObject(decodedString)
            
            // The "sub" claim usually contains the subject (user ID) in JWT
            return if (jsonObject.has("sub")) {
                val subjectId = jsonObject.getString("sub")
                Log.d(TAG, "Found user ID in token payload: $subjectId")
                subjectId.toLongOrNull()
            } else {
                Log.e(TAG, "No subject claim (sub) found in JWT payload")
                null
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing JWT token", e)
            return null
        }
    }