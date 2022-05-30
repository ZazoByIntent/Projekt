package com.example.npo_agregat

import android.app.Activity
import android.app.Activity.RESULT_OK
import android.content.ContentResolver
import android.content.ContentValues
import android.content.Intent
import android.location.Location
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.provider.OpenableColumns
import android.security.keystore.UserNotAuthenticatedException
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.npo_agregat.databinding.FragmentLoginBinding
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.lang.Exception

class LoginFragment : Fragment() {
    private var _binding: FragmentLoginBinding? = null
    lateinit var app:MyApplication
    private val binding get() = _binding!!
    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        app = activity?.application as MyApplication
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        (activity as AppCompatActivity).supportActionBar?.title = "Login"
        super.onViewCreated(view, savedInstanceState)
        binding.btnLogin.setOnClickListener() {
            val username = binding.etUsername.text.toString()
            val password = binding.etPassword.text.toString()
            sendPost(username, password)
        }
        binding.btnRegister.setOnClickListener() {
            findNavController().navigate(R.id.action_loginFragment_to_registerFragment)
        }
    }

    private fun sendPost(username: String, password: String) {
        //val actualUrl = "164.8.160.230:3001"
        //val actualUrl = "192.168.178.55:3001"
        val actualUrl = "146.212.52.90:3001"

        val requestBody = FormBody.Builder()
            .add("username", username)
            .add("password", password)
            .build()

        val request = Request.Builder()
            .url("http://$actualUrl/user/login")
            .post(requestBody)
            .build()

        try{
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful)
                {
                    Log.e("Unexpected code", response.toString())
                    Toast.makeText(context!!, "Invalid", Toast.LENGTH_LONG).show()
                }
                else {
                    val responseHeaders: Headers = response.headers
                    for (i in 0 until responseHeaders.size) {
                        println(responseHeaders.name(i).toString() + ": " + responseHeaders.value(i))
                    }
                    val responseString = response.body!!.string()
                    if("username" in responseString)
                    {
                        val json = JSONObject(responseString)
                        app.user_id = json.getString("_id")
                        app.loggedIn = true
                        app.user = username
                        print(json)
                        if(json.getString("tfa") == "true")
                        {
                            findNavController().navigate(R.id.action_loginFragment_to_tfaFragment)
                        } else {
                            findNavController().navigate(R.id.action_loginFragment_to_mainFragment)
                        }
                    } else {
                        Toast.makeText(context!!, "Invalid credentials", Toast.LENGTH_LONG).show()
                    }
                }
            }
        }   catch(ex: Exception){
            if (context != null){
                Toast.makeText(context!!,ex.localizedMessage, Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}