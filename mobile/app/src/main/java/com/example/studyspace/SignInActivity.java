package com.example.studyspace;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.studyspace.SignUpActivity;

public class SignInActivity extends AppCompatActivity {

    private EditText emailEditText, passwordEditText;
    private Button signInButton;
    private TextView signUpTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        // Initialize UI elements
        emailEditText = findViewById(R.id.inputEmail);
        passwordEditText = findViewById(R.id.inputPassword);
        signInButton = findViewById(R.id.btnSignIn);
        signUpTextView = findViewById(R.id.txtNoAccount);

        // Set click listener for sign in button
        signInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = emailEditText.getText().toString().trim();
                String password = passwordEditText.getText().toString().trim();

                if (validateInput(email, password)) {
                    // Implement your sign-in logic here
                    // For now, just show a success message
                    Toast.makeText(SignInActivity.this, "Sign in successful!", Toast.LENGTH_SHORT).show();

                    // Navigate to main activity after successful login
                    // Intent intent = new Intent(SignInActivity.this, MainActivity.class);
                    // startActivity(intent);
                    // finish();
                }
            }
        });

        // Set click listener for sign up text
        signUpTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(SignInActivity.this, SignUpActivity.class);
                startActivity(intent);
            }
        });

        // Initialize social media sign-in buttons
        findViewById(R.id.btnGoogle).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(SignInActivity.this, "Google Sign-In clicked", Toast.LENGTH_SHORT).show();
                // Implement Google Sign-In
            }
        });
    }

    private boolean validateInput(String email, String password) {
        if (email.isEmpty()) {
            emailEditText.setError("Email cannot be empty");
            emailEditText.requestFocus();
            return false;
        }

        if (password.isEmpty()) {
            passwordEditText.setError("Password cannot be empty");
            passwordEditText.requestFocus();
            return false;
        }

        // Add more validation as needed (e.g., email format check)

        return true;
    }
}