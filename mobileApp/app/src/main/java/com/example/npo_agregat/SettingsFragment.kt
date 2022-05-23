package com.example.npo_agregat

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.DialogFragment
import com.example.npo_agregat.databinding.FragmentSettingsBinding
import java.lang.Exception
import androidx.core.app.ActivityCompat.startActivityForResult

import android.content.Intent
import androidx.activity.result.registerForActivityResult
import android.app.Activity
import android.content.ContentResolver
import android.database.Cursor
import android.net.Uri
import android.provider.MediaStore.MediaColumns
import android.provider.OpenableColumns
import androidx.core.app.ActivityCompat.getCodeCacheDir
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import javax.security.auth.callback.Callback


class SettingsFragment : DialogFragment(), UploadRequestBody.UploadCallback {
    private var _binding: FragmentSettingsBinding? = null
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
        _binding = FragmentSettingsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        (activity as AppCompatActivity).supportActionBar?.title = "Login"
        super.onViewCreated(view, savedInstanceState)
        binding.button.setOnClickListener() {
            openImageChooser()
        }
        binding.button4.setOnClickListener{
            uploadImage()
            (activity as MainActivity?)!!.closeSettingsFragment()
        }
    }

    private fun openImageChooser() {
        Intent(Intent.ACTION_PICK).also {
            it.type = "image/*"
            val mimeTypes = arrayOf("image/jpeg", "image/png")
            it.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes)
            startActivityForResult(it, 100)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?){
        super.onActivityResult(requestCode, resultCode, data)
        if(resultCode == Activity.RESULT_OK){
            when(requestCode){
                100 -> {
                    selectedImage = data?.data

                }
            }
        }
    }

    private fun uploadImage() {
        if(selectedImage == null){
            Toast.makeText(context, "Select image first!", Toast.LENGTH_LONG).show()
            return;
        }

        val parcelFileDescriptor = context!!.contentResolver.openFileDescriptor(selectedImage!!, "r", null) ?: return
        val file = File(context!!.cacheDir, context!!.contentResolver.getFileName(selectedImage!!))
        val inputStream = FileInputStream(parcelFileDescriptor.fileDescriptor)
        val outputStream = FileOutputStream(file)
        inputStream.copyTo(outputStream)

        binding.progressBar.progress = 0


        val jsonObject = JSONObject()
        jsonObject.put("user_id",app.user_id.toString())


        val body = UploadRequestBody(file, "image", this)
        val reqBody = file.asRequestBody("image/*".toMediaTypeOrNull())
        val requestFile : RequestBody = file.asRequestBody("image/*".toMediaTypeOrNull())

        jsonObject.put("path", requestFile)

        val jsonBody = jsonObject.toString()
            .toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())

        val mpbody : MultipartBody.Part = MultipartBody.Part.createFormData("myFile", file.name, reqBody)
        val rbid : RequestBody = "myFile".toRequestBody("text/plain".toMediaTypeOrNull())
        val us_id : RequestBody = app.user_id.toString().toRequestBody("text/plain".toMediaTypeOrNull())

        MyAPI().uploadImage(
            mpbody,
            rbid,
            us_id
        ).enqueue(object : retrofit2.Callback<ResponseBody> {
            override fun onFailure(call: retrofit2.Call<ResponseBody>, t: Throwable) {
                if(t.message != null)
                    Toast.makeText(context!!, t.message, Toast.LENGTH_LONG).show()
                binding.progressBar.progress = 0
            }

            override fun onResponse(
                call: retrofit2.Call<ResponseBody>,
                response: retrofit2.Response<ResponseBody>
            ) {
                response.body()?.let {
                    binding.progressBar.progress = 100
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

    override fun onProgressUpdate(percentage: Int) {
        binding.progressBar.progress = percentage
    }

    private fun sendPost(username: String, email: String, password: String) {
        val actualUrl = "192.168.178.55:3001"

        val requestBody = FormBody.Builder()
            .add("username", username)
            .add("password", password)
            .add("email", email)
            .build()

        val request = Request.Builder()
            .url("http://$actualUrl/user")
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
                    System.out.println(response.body!!.string())
                }
            }
        } catch (ex: Exception){
            if (context != null){
                Toast.makeText(context!!,ex.localizedMessage, Toast.LENGTH_SHORT).show()
            }
        }


    }

}