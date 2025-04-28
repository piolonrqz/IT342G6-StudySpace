package com.example.studyspace.Network

import com.google.gson.Gson
import com.google.gson.GsonBuilder

import com.google.gson.stream.JsonReader
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:8080/"  // Change this to your actual backend URL

    val apiService: ApiService by lazy {
        val gson = GsonBuilder()
            .setLenient()
            .create()

        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create(gson))  // Use the lenient Gson
            .build()
            .create(ApiService::class.java)
    }
}