package com.example.studyspace.ui.theme.Screens

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.studyspace.R

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SignInScreen()
        }
    }
}

@Composable
fun SignInScreen() {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

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

            // Sign in header
            Text(
                text = "Sign in your account",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 32.dp)
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
                placeholder = { Text("your password", color = Color.LightGray) },
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

            // Sign In Button
            Button(
                onClick = { /* Implement sign in logic */ },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF3498DB)
                ),
                shape = RoundedCornerShape(4.dp)
            ) {
                Text(
                    text = "SIGN IN",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            // Or sign in with text
            Text(
                text = "or sign in with",
                modifier = Modifier.padding(vertical = 24.dp),
                color = Color.Gray
            )

            // Google sign in button
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
                    contentDescription = "Sign in with Google",
                    modifier = Modifier.size(24.dp)
                )
            }

            // Sign up text
            Row(
                modifier = Modifier.padding(top = 32.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Don't have an account? ",
                    color = Color.Gray
                )
                Text(
                    text = "SIGN UP",
                    color = Color(0xFF3498DB),
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}