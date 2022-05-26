package com.example.npo_agregat

import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

interface MyAPI {
    @Multipart
    @POST("/upload_image")
    fun uploadImage(
        @Part image : MultipartBody.Part,
        @Part("myFile") name : RequestBody,
        @Part("user_id") user_id : RequestBody
    ): Call<ResponseBody>

    companion object {
        operator fun invoke(): MyAPI {
            return Retrofit.Builder()
                .baseUrl("http://192.168.178.55:3001")
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(MyAPI::class.java)
        }
    }
}