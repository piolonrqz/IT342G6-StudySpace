package com.example.studyspace.ui.theme.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.studyspace.R
import androidx.compose.foundation.background
import androidx.compose.ui.text.style.TextAlign

@Composable
fun StudySpaceScreen(navController: NavHostController) {
    Box(
        modifier = Modifier.fillMaxSize(),
    ) {
        // Background Image
        Image(
            painter = painterResource(id = R.drawable.landing_page),
            contentDescription = "Background Image",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop // This will crop the image to fill the screen
        )

        // Semi-transparent overlay to ensure text visibility
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.4f))
        )

        // Content
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "Study Space",
                    fontSize = 40.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(32.dp))
                // App logo or welcome image
                Image(
                    painter = painterResource(id = R.drawable.logo),
                    contentDescription = "App Logo",
                    modifier = Modifier.size(150.dp)
                )

                Spacer(modifier = Modifier.height(200.dp))

                Text(
                    text = "Unleash Your Productivity Potential",
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier
                        .padding(vertical = 12.dp)
                        .fillMaxWidth(),
                    color = Color.White,
                    textAlign = TextAlign.Center
                )

                // Extra padding above the button (in addition to the existing 48dp Spacer)
                Spacer(modifier = Modifier.height(100.dp))

                // Button with custom colors
                Button(
                    onClick = { navController.navigate("signin") },
                    modifier = Modifier
                        .width(200.dp)
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF2F9FE5), // Custom blue color
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(10.dp) // Optional: rounded corners for the button
                ) {
                    Text(
                        "Get Started",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
    }
}