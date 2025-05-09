package com.example.studyspace.network

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.studyspace.ui.theme.screens.*
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

@Composable
fun NavGraph(navController: NavHostController) {

    // Create Retrofit API instance
    val apiService = Retrofit.Builder()
        .baseUrl("https://it342g6-studyspace.onrender.com") // Localhost for emulator
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(ApiService::class.java)

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
