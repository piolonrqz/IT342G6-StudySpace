package com.example.studyspace

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Get reference to the "Get Started" button
        val getStartedButton: Button = findViewById(R.id.get_started_button)

        // Set an OnClickListener for the button
        getStartedButton.setOnClickListener {
            // Create an Intent to start the SignInSignUpActivity
            val intent = Intent(this, SignInActivity::class.java)
            // Start the activity
            startActivity(intent)
        }
    }
}