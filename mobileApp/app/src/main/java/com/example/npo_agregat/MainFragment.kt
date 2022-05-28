package com.example.npo_agregat

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.npo_agregat.databinding.FragmentMainBinding

class MainFragment : Fragment() {
    private var _binding: FragmentMainBinding? = null
    lateinit var app:MyApplication
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        app = activity?.application as MyApplication
        _binding = FragmentMainBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        (activity as AppCompatActivity).supportActionBar?.title = "Agregat"
        if(!app.loggedIn){
            // openLoginFragment()
        }

        // OnClick
        binding.btnStart.setOnClickListener {
            if(binding.tvStatus.text == getString(R.string.textview_status_idle)){
                binding.tvStatus.text = getString(R.string.textview_status_capturing)
                // Zacni zajemanje podatkov
                app.isCapturing = true
                (activity as MainActivity?)!!.setUpSensorStuff()
                (activity as MainActivity?)!!.startLocationUpdates()
            }
        }
        binding.btnStop.setOnClickListener {
            if(binding.tvStatus.text == getString(R.string.textview_status_capturing)){
                binding.tvStatus.text = getString(R.string.textview_status_idle)
                (activity as MainActivity?)!!.stopLocationUpdates()
                (activity as MainActivity?)!!.stopSensors()
                app.isCapturing = false
            }
        }
        binding.btnSettings.setOnClickListener {
            findNavController().navigate(R.id.action_mainFragment_to_settingsFragment)
        }
    }

    // stop receiving location update when activity not visible/foreground
    override fun onPause() {
        super.onPause()
        if(app.isCapturing)
            (activity as MainActivity?)!!.stopLocationUpdates()
    }

    // start receiving location update when activity  visible/foreground
    override fun onResume() {
        super.onResume()
        if(!app.loggedIn)
            findNavController().navigate(R.id.action_global_loginFragment)
        else {
            binding.tvUser.text = app.user
            if(app.isCapturing)
                (activity as MainActivity?)!!.startLocationUpdates()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

}