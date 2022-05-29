package com.example.npo_agregat

import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.npo_agregat.databinding.FragmentTfaBinding
import okhttp3.OkHttpClient
import android.app.Activity.RESULT_OK
import android.content.ContentResolver
import android.location.Location
import android.provider.OpenableColumns
import android.security.keystore.UserNotAuthenticatedException
import android.util.Log
import android.widget.Toast
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

class TfaFragment : Fragment() {
    private var _binding: FragmentTfaBinding? = null
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
        _binding = FragmentTfaBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        (activity as AppCompatActivity).supportActionBar?.title = "Login"
        super.onViewCreated(view, savedInstanceState)
        binding.btnFaceRecog.setOnClickListener {
            val fileName : String = "new-photo.jpg"
            val values = ContentValues()
            values.put(MediaStore.Images.Media.TITLE, fileName)
            selectedImage = context!!.contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)

            val intent_gallery = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
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
        val us_id : RequestBody = app.user_id.toString().toRequestBody("text/plain".toMediaTypeOrNull())

        MyAPI().faceRecog(
            mpbody,
            rbid,
            us_id
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
                    findNavController().navigate(R.id.action_tfaFragment_to_mainFragment)
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

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

}