package com.example.studyspace.ui.theme.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController

@Composable
fun StudySpaceBottomNavigationBar(
    selectedItem: Int,
    navController: NavHostController,
    onItemSelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    NavigationBar(modifier = modifier) {
        NavigationBarItem(
            selected = selectedItem == 0,
            onClick = {
                if (selectedItem != 0) {
                    onItemSelected(0)
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
                    onItemSelected(1)
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
                    onItemSelected(2)
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
