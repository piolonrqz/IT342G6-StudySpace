package com.example.studyspace.ui.theme.screens

import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.studyspace.R
import com.example.studyspace.network.ApiService
import com.example.studyspace.network.LoginRequest
import kotlinx.coroutines.launch

@Composable
fun SignInScreen(navController: NavHostController, apiService: ApiService) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // App Logo
            Image(
                painter = painterResource(id = R.drawable.logo),
                contentDescription = "App Logo",
                modifier = Modifier
                    .size(80.dp)
                    .padding(bottom = 32.dp)
            )

            // Header
            Text(
                text = "Sign in your account",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 32.dp)
            )

            // Email Field
            Text("Email", color = Color.Gray, modifier = Modifier.align(Alignment.Start))
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                placeholder = { Text("ex: jon.smith@email.com", color = Color.LightGray) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .background(Color(0xFFF5F5F5), RoundedCornerShape(4.dp)),
                colors = TextFieldDefaults.colors(
                    unfocusedContainerColor = Color(0xFFF5F5F5),
                    focusedContainerColor = Color(0xFFF5F5F5),
                    unfocusedIndicatorColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent
                )
            )

            // Password Field
            Text("Password", color = Color.Gray, modifier = Modifier.align(Alignment.Start))
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                placeholder = { Text("your password", color = Color.LightGray) },
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .background(Color(0xFFF5F5F5), RoundedCornerShape(4.dp)),
                colors = TextFieldDefaults.colors(
                    unfocusedContainerColor = Color(0xFFF5F5F5),
                    focusedContainerColor = Color(0xFFF5F5F5),
                    unfocusedIndicatorColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent
                )
            )

            // Sign In Button
            Button(
                onClick = {
                    if (email.isBlank() || password.isBlank()) {
                        errorMessage = "Please fill all fields."
                        return@Button
                    }

                    isLoading = true
                    errorMessage = null

                    coroutineScope.launch {
                        try {                            val response = apiService.login(LoginRequest(email, password))
                            if (response.isSuccessful) {                                
                                val body = response.body()
                                if (body?.token?.isNotBlank() == true) {                                    // Save the JWT token and profile info to SharedPreferences
                                    val editor = context.getSharedPreferences("auth_prefs", android.content.Context.MODE_PRIVATE).edit()
                                    editor.putString("jwt_token", body.token)
                                    
                                    // Save profile picture filename if it exists
                                    body.profilePictureFilename?.let { profilePic ->
                                        editor.putString("profile_picture", profilePic)
                                        Log.d("SignInScreen", "Saved profile picture: $profilePic")
                                    }
                                    
                                    // Save the userId
                                    body.userId?.let { userId ->
                                        when (userId) {
                                            is Int -> editor.putLong("user_id", userId.toLong())
                                            is Long -> editor.putLong("user_id", userId)
                                            is String -> {
                                                try {
                                                    editor.putLong("user_id", userId.toLong())
                                                    Log.d("SignInScreen", "Saved user ID from string: $userId")
                                                } catch (e: NumberFormatException) {
                                                    Log.e("SignInScreen", "Failed to parse user ID: $userId", e)
                                                }
                                            }
                                            else -> {
                                                Log.e("SignInScreen", "Unexpected userId type: ${userId::class.java.name}")
                                                try {
                                                    editor.putLong("user_id", userId.toString().toLong())
                                                    Log.d("SignInScreen", "Saved user ID after conversion: $userId")
                                                } catch (e: Exception) {
                                                    Log.e("SignInScreen", "Failed to convert and save user ID", e)
                                                }
                                            }
                                        }
                                    }
                                    
                                    editor.apply()
                                    
                                    // Use the main thread to show Toast and navigate
                                    withContext(Dispatchers.Main) {
                                        Toast.makeText(context, "Login successful!", Toast.LENGTH_SHORT).show()
                                        navController.navigate("home") {
                                            popUpTo("landing") { inclusive = true }
                                        }
                                    }
                                } else {
                                    errorMessage = "Login failed: Unexpected response."
                                }
                            } else {
                                val errorBody = response.errorBody()?.string()
                                errorMessage = errorBody ?: "Login failed: ${response.message()}"
                            }                        } catch (e: Exception) {
                            // Provide more helpful error messages based on exception type
                            errorMessage = when {
                                e.message?.contains("timeout", ignoreCase = true) == true -> 
                                    "Connection timed out. The server may be busy or experiencing slow response times. Please try again later."
                                e.message?.contains("Unable to resolve host") == true -> 
                                    "Network error: Unable to connect to the server. Please check your internet connection."
                                else -> "Error: ${e.localizedMessage ?: "Unknown error occurred"}"
                            }
                            // Log the exception for debugging
                            e.printStackTrace()
                        } finally {
                            isLoading = false
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3498DB)),
                shape = RoundedCornerShape(4.dp)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("SIGN IN", fontSize = 16.sp, fontWeight = FontWeight.Medium)
                }
            }

            // Error Message
            errorMessage?.let {
                Text(
                    text = it,
                    color = Color.Red,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            // Divider
            Text(
                text = "or sign in with",
                color = Color.Gray,
                modifier = Modifier.padding(vertical = 24.dp)
            )

            // Google Sign-In (Placeholder)
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(Color(0xFFF5F5F5))
                    .padding(12.dp),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.google_icon),
                    contentDescription = "Sign in with Google",
                    modifier = Modifier.size(24.dp)
                )
            }

            // Navigate to Sign Up
            Row(
                modifier = Modifier.padding(top = 32.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Don't have an account? ", color = Color.Gray)
                Text(
                    text = "SIGN UP",
                    color = Color(0xFF3498DB),
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.clickable { navController.navigate("signup") }
                )
            }
        }
    }
}
