package com.example.studyspace.network

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.studyspace.ui.theme.screens.*

@Composable
fun NavGraph(navController: NavHostController) {    // Use the singleton RetrofitClient with proper timeout settings
    val apiService = RetrofitClient.apiService

    NavHost(
        navController = navController,
        startDestination = "landing"
    ) {
        composable("landing") {
            StudySpaceScreen(navController = navController)
        }

        composable("signin") {
            SignInScreen(navController = navController, apiService = apiService)
        }

        composable("signup") {
            SignUpScreen(navController = navController, apiService = apiService)
        }

        composable("home") {
            HomeScreen(navController = navController)
        }

        composable("booking") {
            BookingScreen(navController = navController, apiService = apiService)
        }

        composable("profile") {
            ProfileScreen(navController = navController)
        }
    }
}
