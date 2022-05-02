package com.example.npo_agregat

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.npo_agregat.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    lateinit var app:MyApplication

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        app = application as MyApplication

        binding.btnStart.setOnClickListener {
            if(binding.tvStatus.text == getString(R.string.textview_status_idle)){
                binding.tvStatus.text = getString(R.string.textview_status_capturing)
                // Zacni zajemanje podatkov
            }
        }
        binding.btnStop.setOnClickListener {
            if(binding.tvStatus.text == getString(R.string.textview_status_capturing)){
                binding.tvStatus.text = getString(R.string.textview_status_idle)
                // Prenehaj zajemanje podatkov
            }
        }
    }
}