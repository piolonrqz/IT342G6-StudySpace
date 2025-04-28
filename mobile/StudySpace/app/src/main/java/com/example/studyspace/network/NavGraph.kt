package com.example.studyspace.network

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.studyspace.ui.theme.screens.HomeScreen
import com.example.studyspace.ui.theme.screens.ProfileScreen
import com.example.studyspace.ui.theme.screens.SignInScreen
import com.example.studyspace.ui.theme.screens.SignUpScreen
import com.example.studyspace.ui.theme.screens.StudySpaceScreen
import com.example.studyspace.ui.theme.screens.BookingScreen

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = "landing" // Start with landing page
    ) {
        composable("landing") {
            StudySpaceScreen(navController = navController)
        }

        composable("signin") {
            SignInScreen(navController = navController)
        }

        composable("signup") {
            SignUpScreen(navController = navController)
        }

        composable("home") {
            HomeScreen(navController = navController)
        }

        // Uncomment and use BookingScreen when you're ready
        composable("booking") {
            BookingScreen(navController = navController)
        }

        composable("profile") {
            ProfileScreen(navController = navController)
        }
    }
}