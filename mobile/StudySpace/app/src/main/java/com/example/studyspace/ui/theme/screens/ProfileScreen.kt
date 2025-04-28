package com.example.studyspace.ui.theme.screens

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
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.studyspace.R
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
    var selectedItem by remember { mutableIntStateOf(2) } // Default to Profile tab

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Profile heading
        Text(
            text = "Profile",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier
                .align(Alignment.Start)
                .padding(vertical = 16.dp)
        )

        // Profile picture
        Image(
            painter = painterResource(id = R.drawable.momo),
            contentDescription = "Profile Picture",
            modifier = Modifier
                .size(100.dp)
                .clip(CircleShape),
            contentScale = ContentScale.Crop
        )

        // Name
        Text(
            text = "Damon Fine",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(top = 16.dp)
        )

        // Email
        Text(
            text = "yunyun619@gmail.com",
            fontSize = 14.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // First custom divider
        CustomDivider()

        // Menu items
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

        // Second custom divider
        CustomDivider()

        // Log out button
        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = { /* Handle logout click */ },
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

        // Navigation Bar with correct navigation
        NavigationBar(
            modifier = Modifier
                .align(Alignment.CenterHorizontally)
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
                    // Prevent redundant navigation to the same profile screen
                    if (selectedItem != 2) {
                        selectedItem = 2
                        navController.navigate("profile") {
                            popUpTo("profile") { inclusive = false }
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
