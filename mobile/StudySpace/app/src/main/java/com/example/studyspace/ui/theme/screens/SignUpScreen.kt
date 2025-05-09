package com.example.studyspace.ui.theme.screens

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
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.studyspace.R
import com.example.studyspace.network.ApiService
import com.example.studyspace.network.RegisterRequest
import com.example.studyspace.network.RetrofitClient
import kotlinx.coroutines.launch

@Composable
fun SignUpScreen(navController: NavHostController, apiService: ApiService) {
    var fname by remember { mutableStateOf("") }
    var lname by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var acceptedTerms by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()
    val context = LocalContext.current

    fun validateFields(): Boolean {
        if (fname.isBlank() || lname.isBlank() || email.isBlank() || password.isBlank() || confirmPassword.isBlank()) {
            errorMessage = "All fields are required."
            return false
        }
        if (password != confirmPassword) {
            errorMessage = "Passwords do not match."
            return false
        }
        if (!acceptedTerms) {
            errorMessage = "You must accept the terms & policy."
            return false
        }
        errorMessage = ""
        return true
    }

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
            // Top bar with back button and logo
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 32.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Back button
                Icon(
                    painter = painterResource(id = R.drawable.arrow_right),
                    contentDescription = "Back",
                    modifier = Modifier
                        .size(24.dp)
                        .clickable {
                            navController.navigateUp()
                        },
                    tint = Color.Black
                )

                // App Logo
                Image(
                    painter = painterResource(id = R.drawable.logo),
                    contentDescription = "App Logo",
                    modifier = Modifier.size(40.dp),
                    alignment = Alignment.CenterEnd
                )
            }

            // Create account header
            Text(
                text = "Create your account",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(bottom = 24.dp)
            )

            // First Name field
            Text(
                text = "First Name",
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(bottom = 8.dp),
                color = Color.Gray
            )
            OutlinedTextField(
                value = fname,
                onValueChange = { fname = it },
                placeholder = { Text("ex: John", color = Color.LightGray) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
                    .background(Color(0xFFF5F5F5), RoundedCornerShape(4.dp)),
                colors = TextFieldDefaults.colors(
                    unfocusedContainerColor = Color(0xFFF5F5F5),
                    focusedContainerColor = Color(0xFFF5F5F5),
                    unfocusedIndicatorColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent
                )
            )
            // Second Name
            Text(
                text = "Last Name",
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(bottom = 8.dp),
                color = Color.Gray
            )
            OutlinedTextField(
                value = lname,
                onValueChange = { lname = it },
                placeholder = { Text("ex: Doe", color = Color.LightGray) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
                    .background(Color(0xFFF5F5F5), RoundedCornerShape(4.dp)),
                colors = TextFieldDefaults.colors(
                    unfocusedContainerColor = Color(0xFFF5F5F5),
                    focusedContainerColor = Color(0xFFF5F5F5),
                    unfocusedIndicatorColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent
                )
            )
            // Email field
            Text(
                text = "Email",
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(bottom = 8.dp),
                color = Color.Gray
            )
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                placeholder = { Text("ex: jon.smith@email.com", color = Color.LightGray) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
                    .background(Color(0xFFF5F5F5), RoundedCornerShape(4.dp)),
                colors = TextFieldDefaults.colors(
                    unfocusedContainerColor = Color(0xFFF5F5F5),
                    focusedContainerColor = Color(0xFFF5F5F5),
                    unfocusedIndicatorColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent
                )
            )

            // Password field
            Text(
                text = "Password",
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(bottom = 8.dp),
                color = Color.Gray
            )
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                placeholder = { Text("••••••••", color = Color.LightGray) },
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
                    .background(Color(0xFFF5F5F5), RoundedCornerShape(4.dp)),
                colors = TextFieldDefaults.colors(
                    unfocusedContainerColor = Color(0xFFF5F5F5),
                    focusedContainerColor = Color(0xFFF5F5F5),
                    unfocusedIndicatorColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent
                )
            )

            // Confirm Password field
            Text(
                text = "Confirm password",
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(bottom = 8.dp),
                color = Color.Gray
            )
            OutlinedTextField(
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                placeholder = { Text("••••••••", color = Color.LightGray) },
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 24.dp)
                    .background(Color(0xFFF5F5F5), RoundedCornerShape(4.dp)),
                colors = TextFieldDefaults.colors(
                    unfocusedContainerColor = Color(0xFFF5F5F5),
                    focusedContainerColor = Color(0xFFF5F5F5),
                    unfocusedIndicatorColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent
                )
            )

            // Terms and policy checkbox
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 24.dp)
            ) {
                Checkbox(
                    checked = acceptedTerms,
                    onCheckedChange = { acceptedTerms = it },
                    colors = CheckboxDefaults.colors(
                        checkedColor = Color(0xFF3498DB),
                        uncheckedColor = Color.Gray
                    )
                )
                Text(text = "I understood the ", color = Color.Gray)
                Text(
                    text = "terms & policy",
                    color = Color(0xFF3498DB),
                    textDecoration = TextDecoration.Underline
                )
                Text(text = ".", color = Color.Gray)
            }

            // Error message display
            if (errorMessage.isNotEmpty()) {
                Text(
                    text = errorMessage,
                    color = Color.Red,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }

            // Sign Up Button
            Button(
                onClick = {
                    if (!validateFields()) return@Button
                    isLoading = true
                    coroutineScope.launch {
                        try {                           
                            val response = RetrofitClient.apiService.register(
                                RegisterRequest(
                                    email = email,
                                    firstName = fname,
                                    lastName = lname,
                                    password = password
                                )
                            )
                            if (response.isSuccessful) {                                val registerResponse = response.body()
                                if (registerResponse != null) {
                                    // Save the JWT token to SharedPreferences
                                    val editor = context.getSharedPreferences("auth_prefs", android.content.Context.MODE_PRIVATE).edit()
                                    editor.putString("jwt_token", registerResponse.token)
                                    // No profile picture for new registrations usually, but could set default if needed                                    editor.apply()
                                    
                                    // Use the main thread to show Toast and navigate
                                    withContext(Dispatchers.Main) {
                                        Toast.makeText(context, "Registration successful!", Toast.LENGTH_SHORT).show()
                                        navController.navigate("home") {
                                            popUpTo("landing") { inclusive = true }
                                        }
                                    }
                                } else {
                                    errorMessage = "Registration failed: Empty response."
                                }
                            } else {
                                // Try to extract error message from backend
                                val errorBody = response.errorBody()?.string()
                                errorMessage = errorBody ?: "Registration failed: ${response.message()}"
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
                enabled = !isLoading,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF3498DB)
                ),
                shape = RoundedCornerShape(4.dp)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        color = Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                } else {
                    Text(
                        text = "SIGN UP",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            // Or sign up with text
            Text(
                text = "or sign up with",
                modifier = Modifier.padding(vertical = 24.dp),
                color = Color.Gray
            )

            // Google sign up button
            Box(
                modifier = Modifier
                    .size(width = 48.dp, height = 48.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(Color(0xFFF5F5F5))
                    .padding(12.dp),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.google_icon),
                    contentDescription = "Sign up with Google",
                    modifier = Modifier.size(24.dp)
                )
            }

            // Sign in text
            Row(
                modifier = Modifier.padding(top = 32.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Have an account? ",
                    color = Color.Gray
                )
                Text(
                    text = "SIGN IN",
                    color = Color(0xFF3498DB),
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.clickable {
                        navController.navigate("signin") {
                            // Pop up to the start destination of the graph to
                            // avoid building up a large stack of destinations
                            popUpTo("signin") {
                                inclusive = true
                            }
                        }
                    }
                )
            }
        }
    }
}
