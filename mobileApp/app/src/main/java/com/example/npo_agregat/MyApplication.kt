package com.example.npo_agregat

import android.app.Application

class MyApplication : Application() {
    var isCapturing : Boolean = false
    var gyroscopeX: Float = 0.0f
    var gyroscopeY: Float = 0.0f
    var gyroscopeZ: Float = 0.0f
    var accelerationX: Double = 0.0
    var accelerationY: Double = 0.0
    var accelerationZ: Double = 0.0
    var loggedIn : Boolean = false
    var user : String = "username"
}