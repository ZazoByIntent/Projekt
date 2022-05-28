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
    var selectedImage : Uri? = null

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
            activity!!.onBackPressed()
        }
        binding.btnRegister.setOnClickListener() {
            findNavController().navigate(R.id.action_loginFragment_to_registerFragment)
        }
        binding.btnFaceRecog.setOnClickListener {
            val fileName : String = "new-photo.jpg"
            val values = ContentValues()
            values.put(MediaStore.Images.Media.TITLE, fileName)
            selectedImage = context!!.contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)

            val intent_gallery = Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE)
            intent_gallery.putExtra(MediaStore.EXTRA_OUTPUT, selectedImage)
            startActivityForResult(intent_gallery, 100)
        }
        binding.btnSendFaceId.setOnClickListener {
            uploadImage()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if(resultCode == Activity.RESULT_OK) {
            when(requestCode){
                100 -> {
                    print("Success")
                }
            }
        }
        else {
            selectedImage = null
        }
    }

    private fun uploadImage() {
        if(selectedImage == null){
            Toast.makeText(context, "Incorrect image selection", Toast.LENGTH_LONG).show()
            return;
        }

        val parcelFileDescriptor = context!!.contentResolver.openFileDescriptor(selectedImage!!, "r", null) ?: return
        val file = File(context!!.cacheDir, context!!.contentResolver.getFileName(selectedImage!!))
        val inputStream = FileInputStream(parcelFileDescriptor.fileDescriptor)
        val outputStream = FileOutputStream(file)
        inputStream.copyTo(outputStream)

        val reqBody = file.asRequestBody("image/*".toMediaTypeOrNull())
        val mpbody : MultipartBody.Part = MultipartBody.Part.createFormData("myFile", file.name, reqBody)
        val rbid : RequestBody = "myFile".toRequestBody("text/plain".toMediaTypeOrNull())

        MyAPI().faceRecog(
            mpbody,
            rbid
        ).enqueue(object : retrofit2.Callback<ResponseBody> {
            override fun onFailure(call: retrofit2.Call<ResponseBody>, t: Throwable) {
                if(t.message != null)
                    Toast.makeText(context!!, t.message, Toast.LENGTH_LONG).show()
            }

            override fun onResponse(
                call: retrofit2.Call<ResponseBody>,
                response: retrofit2.Response<ResponseBody>
            ) {
                response.body()?.let {
                    Toast.makeText(context!!, it.string(), Toast.LENGTH_LONG).show()
                    app.loggedIn = true
                    activity!!.onBackPressed()
                }
            }
        })
    }

    fun ContentResolver.getFileName(uri: Uri): String {
        var name = ""
        val returnCursor = this.query(uri, null, null, null, null)
        if (returnCursor != null) {
            val nameIndex = returnCursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            returnCursor.moveToFirst()
            name = returnCursor.getString(nameIndex)
            returnCursor.close()
        }
        return name
    }


    private fun sendPost(username: String, password: String) {
        //val actualUrl = "164.8.160.230:3001"
        val actualUrl = "192.168.178.55:3001"

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