package com.example.studyspace;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class SignUpActivity extends AppCompatActivity {

    private EditText nameEditText, emailEditText, passwordEditText, confirmPasswordEditText;
    private CheckBox termsCheckBox;
    private Button signUpButton;
    private TextView signInTextView;
    private ImageButton backButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);

        // Initialize UI elements
        nameEditText = findViewById(R.id.inputName);
        emailEditText = findViewById(R.id.inputEmail);
        passwordEditText = findViewById(R.id.inputPassword);
        confirmPasswordEditText = findViewById(R.id.inputConfirmPassword);
        termsCheckBox = findViewById(R.id.chkTerms);
        signUpButton = findViewById(R.id.btnSignUp);
        signInTextView = findViewById(R.id.txtHaveAccount);
        backButton = findViewById(R.id.btnBack);

        // Set click listener for back button
        backButton.setOnClickListener(v -> onBackPressed());

        // Set click listener for sign up button
        signUpButton.setOnClickListener(v -> {
            String name = nameEditText.getText().toString().trim();
            String email = emailEditText.getText().toString().trim();
            String password = passwordEditText.getText().toString().trim();
            String confirmPassword = confirmPasswordEditText.getText().toString().trim();
            boolean termsAccepted = termsCheckBox.isChecked();

            if (validateInput(name, email, password, confirmPassword, termsAccepted)) {
                // Implement your sign-up logic here (e.g., database interaction, network request)
                // For now, just show a success message
                Toast.makeText(SignUpActivity.this, "Sign up successful!", Toast.LENGTH_SHORT).show();

                // Navigate to sign in activity after successful registration
                Intent intent = new Intent(SignUpActivity.this, SignInActivity.class);
                startActivity(intent);
                finish();
            }
        });

        // Set click listener for sign in text
        signInTextView.setOnClickListener(v -> {
            Intent intent = new Intent(SignUpActivity.this, SignInActivity.class);
            startActivity(intent);
            finish();
        });

        // Initialize social media sign-up buttons
        findViewById(R.id.btnGoogle).setOnClickListener(v -> {
            Toast.makeText(SignUpActivity.this, "Google Sign-Up clicked", Toast.LENGTH_SHORT).show();
            // Implement Google Sign-Up
        });
    }

    private boolean validateInput(String name, String email, String password,
                                  String confirmPassword, boolean termsAccepted) {
        // Validate name
        if (TextUtils.isEmpty(name)) {
            nameEditText.setError("Name cannot be empty");
            nameEditText.requestFocus();
            return false;
        }

        // Validate email
        if (TextUtils.isEmpty(email)) {
            emailEditText.setError("Email cannot be empty");
            emailEditText.requestFocus();
            return false;
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailEditText.setError("Invalid email format");
            emailEditText.requestFocus();
            return false;
        }

        // Validate password
        if (TextUtils.isEmpty(password)) {
            passwordEditText.setError("Password cannot be empty");
            passwordEditText.requestFocus();
            return false;
        } else if (password.length() < 6) { // Example: Minimum password length
            passwordEditText.setError("Password must be at least 6 characters long");
            passwordEditText.requestFocus();
            return false;
        }

        // Validate confirm password
        if (TextUtils.isEmpty(confirmPassword)) {
            confirmPasswordEditText.setError("Confirm password cannot be empty");
            confirmPasswordEditText.requestFocus();
            return false;
        } else if (!password.equals(confirmPassword)) {
            confirmPasswordEditText.setError("Passwords do not match");
            confirmPasswordEditText.requestFocus();
            return false;
        }

        // Validate terms acceptance
        if (!termsAccepted) {
            Toast.makeText(this, "Please accept the Terms & Policy", Toast.LENGTH_SHORT).show();
            return false;
        }

        return true;
    }
}