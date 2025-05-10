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

@Composable
fun HomeScreen(navController: NavHostController) {
    var selectedItem by remember { mutableStateOf(0) }
    var userName by remember { mutableStateOf("") }
    var spaces by remember { mutableStateOf(listOf<Map<String, Any>>()) }
    var isLoading by remember { mutableStateOf(true) }
    val context = LocalContext.current

    // TODO: Replace with your actual JWT token retrieval logic
    fun getJwtToken(context: Context): String? {
        // Example: return context.getSharedPreferences("auth", Context.MODE_PRIVATE).getString("jwt", null)
        return null // Replace with actual implementation
    }    // Use the singleton RetrofitClient with proper timeout settings
    val apiService = RetrofitClient.apiService

    LaunchedEffect(Unit) {
        isLoading = true
        // Fetch user name
        val token = getJwtToken(context)
        if (token != null && token.isNotBlank()) {
            try {
                val response = withContext(Dispatchers.IO) {
                    apiService.getCurrentUser("Bearer $token")
                }
                if (response.isSuccessful) {
                    val body = response.body()
                    userName = body?.get("firstName")?.toString() ?: "User"
                } else {
                    userName = "User"
                }
            } catch (e: Exception) {
                userName = "User"
            }
        } else {
            userName = "User"
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
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.momo),
                        contentDescription = "Profile Picture",
                        modifier = Modifier
                            .size(75.dp)
                            .clip(CircleShape),
                        contentScale = ContentScale.Crop,
                    )
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
        NavigationBar(
            modifier = Modifier
                .align(Alignment.BottomCenter)
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
                    if (selectedItem != 2) {
                        selectedItem = 2
                        navController.navigate("profile") {
                            popUpTo("profile") { inclusive = true }
                        }
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
}