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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
//import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.studyspace.R

@Composable
fun HomeScreen(navController: NavHostController) {
    var selectedItem by remember { mutableStateOf(0) }  // Default to Home tab

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
        ) {
            // Add more space at the top
            item {
                Spacer(modifier = Modifier.height(75.dp))
            }

            // Top bar with profile and location - side by side but larger
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Profile image - made larger
                    Image(
                        painter = painterResource(id = R.drawable.momo),
                        contentDescription = "Profile Picture",
                        modifier = Modifier
                            .size(75.dp)
                            .clip(CircleShape),
                        contentScale = ContentScale.Crop,
                    )

                    // Location info - made larger
                    Column(
                        horizontalAlignment = Alignment.Start
                    ) {
                        Text(
                            text = "Tokyo, Japan",
                            fontSize = 14.sp,  // Increased from 12sp to 14sp
                            color = Color.Gray,
                            modifier = Modifier.padding(start = 10.dp)
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = Color(0xFF3498DB),
                                modifier = Modifier.size(20.dp)  // Increased from 16dp to 20dp
                            )
                            Text(
                                text = "North Europe Luzon",
                                fontSize = 16.sp,  // Increased from 14sp to 16sp
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
                Text(
                    text = "Hello, Heaven",
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
            }

            item {
                Spacer(modifier = Modifier.height(80.dp))
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
                    if (selectedItem != 0) {  // Only navigate if not already on Home
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
                    if (selectedItem != 1) {  // Only navigate if not already on Booking
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
                    if (selectedItem != 2) {  // Only navigate if not already on Profile
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
