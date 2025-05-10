package com.example.studyspace.ui.theme.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import coil3.compose.AsyncImage
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
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
import com.example.studyspace.R
import com.example.studyspace.network.ApiService
import com.example.studyspace.network.RetrofitClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.example.studyspace.ui.theme.components.StudySpaceCategory
import android.content.Context
import android.util.Log // Import Android's Log class
import com.example.studyspace.ui.theme.components.StudySpaceBottomNavigationBar

@Composable
fun HomeScreen(navController: NavHostController) {
    var selectedItem by remember { mutableStateOf(0) }
    var userName by remember { mutableStateOf("") }
    var profilePicture by remember { mutableStateOf<String?>(null) }
    var spaces by remember { mutableStateOf(listOf<Map<String, Any>>()) }
    var isLoading by remember { mutableStateOf(true) }
    val context = LocalContext.current
    val TAG = "HomeScreen" // Tag for logging

    // TODO: Replace with your actual JWT token retrieval logic
    fun getJwtToken(context: Context): String? {
        // Example: return context.getSharedPreferences("auth", Context.MODE_PRIVATE).getString("jwt", null)
        // Actual implementation:
        val sharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        val token = sharedPreferences.getString("jwt_token", null)
        if (token != null) {
            Log.d(TAG, "Retrieved JWT Token: $token") // Log the token if found
        } else {
            Log.d(TAG, "JWT Token not found in SharedPreferences.") // Log if not found
        }
        return token
    }    // Use the singleton RetrofitClient with proper timeout settings
    val apiService = RetrofitClient.apiService
    LaunchedEffect(Unit) {
        isLoading = true        // Fetch user name and profile picture
        val token = getJwtToken(context)
        // Get the profile picture from SharedPreferences
        val sharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        profilePicture = sharedPreferences.getString("profile_picture", null)
        Log.d(TAG, "Profile picture from SharedPreferences: $profilePicture")
        
        if (token != null && token.isNotBlank()) {
            try {
                val response = withContext(Dispatchers.IO) {
                    apiService.getCurrentUser("Bearer $token")
                }
                if (response.isSuccessful) {
                    val body = response.body()
                    userName = body?.get("firstName")?.toString() ?: "User"
                    // We're now getting profile picture from SharedPreferences above instead
                } else {
                    userName = "User"
                    Log.e(TAG, "Failed to get user data: ${response.code()} ${response.message()}")
                }
            } catch (e: Exception) {
                userName = "User"
                Log.e(TAG, "Exception fetching user data: ${e.message}")
            }
        } else {
            userName = "User"
            Log.d(TAG, "No token available to fetch user data")
        }
        // Fetch spaces
        try {
            val response = withContext(Dispatchers.IO) { apiService.getAllSpaces() }
            if (response.isSuccessful) {
                spaces = response.body() ?: emptyList()
            } else {
                spaces = emptyList()
            }
        } catch (e: Exception) {
            spaces = emptyList()
        }
        isLoading = false
    }

    val groupedSpaces = spaces.groupBy { it["spaceType"]?.toString() ?: "Unknown Type" }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(75.dp))
            }
            // Top bar with profile only (no location)
            item {                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {                    // Using Coil to load the user's profile picture
                    if (profilePicture != null) {
                        // Import Coil's AsyncImage at the top of the file
                        androidx.compose.foundation.layout.Box(
                            modifier = Modifier
                                .size(75.dp)
                                .clip(CircleShape)
                        ) {
                            Log.d(TAG, "Loading profile picture from: $profilePicture")
                            
                            AsyncImage(
                                model = profilePicture, // Use the Firebase URL directly
                                contentDescription = "Profile Picture",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop,
                                error = painterResource(id = R.drawable.momo) // Fallback image
                            )
                        }
                    } else {
                        // Fallback to default image if no profile picture is available
                        Image(
                            painter = painterResource(id = R.drawable.momo),
                            contentDescription = "Default Profile Picture",
                            modifier = Modifier
                                .size(75.dp)
                                .clip(CircleShape),
                            contentScale = ContentScale.Crop,
                        )
                    }
                }
                Spacer(modifier = Modifier.height(24.dp))
                Text(
                    text = "Hello, $userName",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "\"Find Your Perfect Study & Work Space\"",
                    fontSize = 14.sp,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(
                    value = "",
                    onValueChange = {},
                    placeholder = { Text("Search address, city, name") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    shape = RoundedCornerShape(24.dp),
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = Color.Gray
                        )
                    },
                    trailingIcon = {
                        Icon(
                            painter = painterResource(id = R.drawable.filter),
                            contentDescription = "Filter",
                            tint = Color.Gray
                        )
                    },
                    colors = TextFieldDefaults.colors(
                        unfocusedContainerColor = Color(0xFFF5F5F5),
                        focusedContainerColor = Color(0xFFF5F5F5),
                        unfocusedIndicatorColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent
                    ),
                    singleLine = true
                )
                Spacer(modifier = Modifier.height(24.dp))
            }
            // Dynamic study spaces
            if (isLoading) {
                item {
                    Text("Loading spaces...", color = Color.Gray, modifier = Modifier.padding(16.dp))
                }
            } else if (spaces.isEmpty()) {
                item {
                    Text("No spaces available.", color = Color.Gray, modifier = Modifier.padding(16.dp))
                }
            } else {
                groupedSpaces.forEach { (spaceType, spacesInGroup) ->
                    item {
                        Text(
                            text = spaceType.replace("_", " "),
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(vertical = 16.dp)
                        )
                    }
                    items(spacesInGroup.size) { idx ->
                        val space = spacesInGroup[idx]
                        val imageFilename = space["imageFilename"]?.toString() ?: "default_image.jpg"
                        StudySpaceCategory(
                            imageFilename = imageFilename,
                            spaceName = space["name"]?.toString() ?: "Space Name",
                            location = space["location"]?.toString() ?: "Location",
                            price = space["price"]?.toString() ?: "0"
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }
                item {
                    Spacer(modifier = Modifier.height(300.dp))
                }
            }
        }
        // Bottom Navigation Bar
        StudySpaceBottomNavigationBar(
            selectedItem = selectedItem,
            navController = navController,
            onItemSelected = { newItem -> selectedItem = newItem },
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}