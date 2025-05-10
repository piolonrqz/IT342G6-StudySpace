package com.example.studyspace.network

import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    // Use this for local development with Spring Boot (when using the Android emulator)
    private const val BASE_URL = "http://10.0.2.2:8080"
    
    // Use this for production with your deployed backend
    // private const val BASE_URL = "https://it342g6-studyspace.onrender.com"

    val apiService: ApiService by lazy {
        val gson = GsonBuilder()
            .setLenient()
            .create()
            

        
        // Configure OkHttpClient with timeouts
        val httpClient = OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)  // Increased connection timeout
            .readTimeout(60, TimeUnit.SECONDS)     // Increased read timeout
            .writeTimeout(60, TimeUnit.SECONDS)    // Increased write timeout
//            .addInterceptor(logging)               // Add logging for debugging
            .build()

        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(httpClient)                   // Use our custom OkHttpClient with timeouts
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(ApiService::class.java)
    }
}