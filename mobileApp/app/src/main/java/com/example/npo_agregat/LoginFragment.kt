package com.example.npo_agregat

import android.location.Location
import android.os.Bundle
import android.security.keystore.UserNotAuthenticatedException
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.Fragment
import com.example.npo_agregat.databinding.FragmentLoginBinding
import okhttp3.FormBody
import okhttp3.Headers
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.lang.Exception

class LoginFragment : DialogFragment() {
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
        binding.button.setOnClickListener() {
            val username = binding.etUsername.text.toString()
            val password = binding.etPassword.text.toString()
            sendPost(username, password)
            (activity as MainActivity?)!!.closeLoginFragment()
        }
        binding.button2.setOnClickListener() {
            (activity as MainActivity?)!!.openRegisterFragment()
        }
    }

    private fun sendPost(username: String, password: String) {
        val actualUrl = "164.8.162.110:3001"
        //val actualUrl = "192.168.178.55:3001"

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
                if (!response.isSuccessful) Log.e("Unexpected code", response.toString())
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
                    } else {
                        System.out.println("false")
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