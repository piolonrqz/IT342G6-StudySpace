package com.example.studyspace.ui.theme.screens

import android.content.Context
import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import coil3.compose.AsyncImage
import com.example.studyspace.R
import com.example.studyspace.network.RetrofitClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment


@Composable
fun CustomDivider() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(1.dp)
            .padding(vertical = 8.dp)
            .background(Color.LightGray)
    )
}

@Composable
fun ProfileScreen(navController: NavHostController) {
    var selectedItem by remember { mutableStateOf(2) } // Default to Profile tab
    var userEmail by remember { mutableStateOf("") }
    var userName by remember { mutableStateOf("User") }
    var profilePicture by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val TAG = "ProfileScreen"
    
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
    }
    
    // Use the singleton RetrofitClient with proper timeout settings
    val apiService = RetrofitClient.apiService
    
    // Load user data on composition
    LaunchedEffect(Unit) {
        isLoading = true
        
        // Get profile picture from SharedPreferences
        val sharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        profilePicture = sharedPreferences.getString("profile_picture", null)
        Log.d(TAG, "Profile picture from SharedPreferences: $profilePicture")
        
        // Get JWT token and fetch user data
        val token = getJwtToken(context)
        if (token != null && token.isNotBlank()) {
            try {
                val response = withContext(Dispatchers.IO) {
                    apiService.getCurrentUser("Bearer $token")
                }
                if (response.isSuccessful) {
                    val body = response.body()
                    userName = "${body?.get("firstName")} ${body?.get("lastName")}".trim()
                    userEmail = body?.get("email")?.toString() ?: ""
                    Log.d(TAG, "User email from API: $userEmail")
                } else {
                    Log.e(TAG, "Failed to get user data: ${response.code()} ${response.message()}")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception fetching user data: ${e.message}")
            }
        } else {
            Log.d(TAG, "No token available to fetch user data")
        }
        
        isLoading = false
    }

    Scaffold(
        bottomBar = {
            NavigationBar(
                // Consistent with HomeScreen and BookingScreen
            ) {
                NavigationBarItem(
                    selected = selectedItem == 0,
                    onClick = {
                        if (selectedItem != 0) {
                            selectedItem = 0
                            navController.navigate("home") {
                                popUpTo("home") { inclusive = true }
                            }
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
                        if (selectedItem != 1) {
                            selectedItem = 1
                            navController.navigate("booking") {
                                popUpTo("booking") { inclusive = true }
                            }
                        }
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
                        // Already on profile, do nothing
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
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Profile",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(vertical = 16.dp)
            )            // Profile Picture using AsyncImage
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .clip(CircleShape)
            ) {
                if (profilePicture != null) {
                    Log.d(TAG, "Loading profile picture from: $profilePicture")
                    
                    AsyncImage(
                        model = profilePicture,
                        contentDescription = "Profile Picture",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop,
                        error = painterResource(id = R.drawable.momo) // Fallback image
                    )
                } else {
                    // Fallback to default image if no profile picture is available
                    Image(
                        painter = painterResource(id = R.drawable.momo),
                        contentDescription = "Default Profile Picture",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                }
            }
            
            // User name - display fetched name or placeholder
            Text(
                text = if (userName.isNotBlank()) userName else "User",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(top = 16.dp)
            )
            
            // Email - display fetched email or placeholder
            Text(
                text = if (userEmail.isNotBlank()) userEmail else "No email available",
                fontSize = 14.sp,
                color = Color.Gray,
                modifier = Modifier.padding(bottom = 16.dp)
            )
            CustomDivider()
            ProfileMenuItem(
                icon = R.drawable.profile,
                title = "Personal details",
                onClick = { /* Handle personal details click */ }
            )
            ProfileMenuItem(
                icon = R.drawable.settings,
                title = "Settings",
                onClick = { /* Handle settings click */ }
            )
            ProfileMenuItem(
                icon = R.drawable.faq,
                title = "FAQ",
                onClick = { /* Handle FAQ click */ }
            )
            CustomDivider()
            Spacer(modifier = Modifier.weight(1f))
            Button(
                onClick = {
                    // Handle logout by clearing SharedPreferences and navigating to landing page
                    coroutineScope.launch {
                        try {
                            // Clear the auth preferences
                            val editor = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE).edit()
                            editor.clear()
                            editor.apply()
                            
                            // Show success message and navigate to landing page
                            withContext(Dispatchers.Main) {
                                Toast.makeText(context, "Logged out successfully", Toast.LENGTH_SHORT).show()
                                navController.navigate("landing") {
                                    // Pop everything up to landing and make it the only destination
                                    popUpTo("landing") { inclusive = true }
                                }
                            }
                        } catch (e: Exception) {
                            Log.e(TAG, "Error during logout: ${e.message}")
                            withContext(Dispatchers.Main) {
                                Toast.makeText(context, "Error logging out", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF3498DB)
                ),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = "Log Out",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun ProfileMenuItem(icon: Int, title: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Image(
            painter = painterResource(id = icon),
            contentDescription = title,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Text(text = title, fontSize = 16.sp)
    }
}
