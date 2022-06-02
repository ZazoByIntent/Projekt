package com.example.npo_agregat

import android.Manifest
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.location.Location
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Looper
import android.util.Half.EPSILON
import android.util.Log
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.npo_agregat.databinding.ActivityMainBinding
import com.google.android.gms.location.*
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt
import android.os.StrictMode
import android.os.StrictMode.ThreadPolicy
import okhttp3.*
import java.lang.Exception


class MainActivity : AppCompatActivity(){
    private lateinit var binding: ActivityMainBinding
    lateinit var app:MyApplication
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private lateinit var locationCallback: LocationCallback
    private lateinit var sensorManager: SensorManager
    private var loginFragment = LoginFragment()
    private var registerFragment = RegisterFragment()
    private var settingsFragment = SettingsFragment()
    var fragmentManager = supportFragmentManager
    private val NS2S = 1.0f / 1000000000.0f
    private val deltaRotationVector = FloatArray(4) { 0f }
    private var timestamp: Float = 0f
    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        app = application as MyApplication
        val policy = ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)

        if ((ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) && (ContextCompat.checkSelfPermission(this, Manifest.permission.HIGH_SAMPLING_RATE_SENSORS) != PackageManager.PERMISSION_GRANTED)) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.HIGH_SAMPLING_RATE_SENSORS), 2)
        }
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createLocationRequest()
    }

    private fun sendPost(location: Location) {
        val latitudeString = location.latitude.toString()
        val longitudeString = location.longitude.toString()
        //val actualUrl = "192.168.178.55:3001"
        //val actualUrl = "164.8.160.230:3001"
        val actualUrl = "146.212.52.90:3001"

        if(app.gyroscopeX == 0.0f || app.accelerationX == 0.0){
            Log.e("Error:", "Sensors not ready")
            return
        }

        val requestBody = FormBody.Builder()
            .add("x_rotacija", app.gyroscopeX.toString())
            .add("y_rotacija", app.gyroscopeY.toString())
            .add("z_rotacija", app.gyroscopeZ.toString())
            .add("x_pospesek", app.accelerationX.toString())
            .add("y_pospesek", app.accelerationY.toString())
            .add("z_pospesek", app.accelerationZ.toString())
            .add("latitude", latitudeString)
            .add("longitude", longitudeString)
            .add("user_id", app.user_id)
            .build()

        val request = Request.Builder()
            .url("http://$actualUrl/neobdelaniPodatki")
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
        } catch(ex:Exception){
            if (applicationContext != null){
                Toast.makeText(applicationContext!!,ex.localizedMessage, Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun setUpSensorStuff() {
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager

        sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)?.also { accelerometer ->
            sensorManager.registerListener(
                mAcceleratorSensorListener,
                accelerometer,
                SensorManager.SENSOR_DELAY_UI,
                SensorManager.SENSOR_DELAY_UI
            )
        }

        sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)?.also { gyroscope ->
            sensorManager.registerListener(
                mGyroscopeSensorListener,
                gyroscope,
                SensorManager.SENSOR_DELAY_UI,
                SensorManager.SENSOR_DELAY_UI
            )
        }
    }

    fun stopSensors() {
        //sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
            sensorManager.unregisterListener(mAcceleratorSensorListener);
            sensorManager.unregisterListener(mGyroscopeSensorListener);
    }

    // Pospeškometer
    private val mAcceleratorSensorListener: SensorEventListener = object : SensorEventListener {
        override fun onSensorChanged(event: SensorEvent) {
            // In this example, alpha is calculated as t / (t + dT),
            // where t is the low-pass filter's time-constant and
            // dT is the event delivery rate.

            val alpha: Float = 0.8f
            // Isolate the force of gravity with the low-pass filter.
            val gravity = arrayOf(0.0, 0.0, 0.0)
            val linear_acceleration = arrayOf(0.0, 0.0, 0.0)
            gravity[0] = alpha * gravity[0] + (1 - alpha) * event.values[0]
            gravity[1] = alpha * gravity[1] + (1 - alpha) * event.values[1]
            gravity[2] = alpha * gravity[2] + (1 - alpha) * event.values[2]
            // Remove the gravity contribution with the high-pass filter.
            linear_acceleration[0] = event.values[0] - gravity[0]
            linear_acceleration[1] = event.values[1] - gravity[1]
            linear_acceleration[2] = event.values[2] - gravity[2]
            // Prireditev aplikacijskih vrednosti, vrednosti senzorja
            app.accelerationX=linear_acceleration[0]
            app.accelerationY=linear_acceleration[1]
            app.accelerationZ=linear_acceleration[2]

        }

        override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) {

        }
    }


    // Rotacija
    private val mGyroscopeSensorListener: SensorEventListener = object : SensorEventListener {
        override fun onSensorChanged(event: SensorEvent) {
            // This timestep's delta rotation to be multiplied by the current rotation
            // after computing it from the gyro sample data.
            if (timestamp != 0f && event != null) {
                val dT = (event.timestamp - timestamp) * NS2S
                // Axis of the rotation sample, not normalized yet.
                var axisX: Float = event.values[0]
                var axisY: Float = event.values[1]
                var axisZ: Float = event.values[2]

                // Calculate the angular speed of the sample
                val omegaMagnitude: Float = sqrt(axisX * axisX + axisY * axisY + axisZ * axisZ)

                // Normalize the rotation vector if it's big enough to get the axis
                // (that is, EPSILON should represent your maximum allowable margin of error)
                if (omegaMagnitude > EPSILON) {
                    axisX /= omegaMagnitude
                    axisY /= omegaMagnitude
                    axisZ /= omegaMagnitude
                }

                // Integrate around this axis with the angular speed by the timestep
                // in order to get a delta rotation from this sample over the timestep
                // We will convert this axis-angle representation of the delta rotation
                // into a quaternion before turning it into the rotation matrix.
                val thetaOverTwo: Float = omegaMagnitude * dT / 2.0f
                val sinThetaOverTwo: Float = sin(thetaOverTwo)
                val cosThetaOverTwo: Float = cos(thetaOverTwo)
                deltaRotationVector[0] = sinThetaOverTwo * axisX
                deltaRotationVector[1] = sinThetaOverTwo * axisY
                deltaRotationVector[2] = sinThetaOverTwo * axisZ
                deltaRotationVector[3] = cosThetaOverTwo
            }
            timestamp = event?.timestamp?.toFloat() ?: 0f
            val deltaRotationMatrix = FloatArray(9) { 0f }
            SensorManager.getRotationMatrixFromVector(deltaRotationMatrix, deltaRotationVector)
            // User code should concatenate the delta rotation we computed with the current rotation
            // in order to get the updated rotation.
            // rotationCurrent = rotationCurrent * deltaRotationMatrix;
            app.gyroscopeX = deltaRotationVector[0]
            app.gyroscopeY = deltaRotationVector[1]
            app.gyroscopeZ = deltaRotationVector[2]
        }
        override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) {

        }
    }

    private fun createLocationRequest()
    {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        locationRequest = LocationRequest()
        locationRequest.interval = 5000
        locationRequest.fastestInterval = 500
        locationRequest.smallestDisplacement = 5f // 170 m = 0.1 mile
        locationRequest.priority = LocationRequest.PRIORITY_HIGH_ACCURACY //set according to your app function
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult?) {
                locationResult ?: return
                if (locationResult.locations.isNotEmpty()) {
                    val location = locationResult.lastLocation
                    sendPost(location)
                    Toast.makeText(applicationContext, "Location updated " + location.longitude.toString() + " " + location.latitude.toString(), Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    fun startLocationUpdates() {
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }

        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            locationCallback,
            Looper.getMainLooper()
        )
    }

    fun stopLocationUpdates() {
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }
}