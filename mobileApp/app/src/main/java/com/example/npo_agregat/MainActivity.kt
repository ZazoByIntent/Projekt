package com.example.npo_agregat

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.location.Location
import android.location.LocationManager
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
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import android.os.StrictMode
import android.os.StrictMode.ThreadPolicy
import okhttp3.*

import java.io.IOException
import java.net.Proxy


class MainActivity : AppCompatActivity(){
    private lateinit var binding: ActivityMainBinding
    lateinit var app:MyApplication
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private lateinit var locationCallback: LocationCallback
    private lateinit var sensorManager: SensorManager
    private val NS2S = 1.0f / 1000000000.0f
    private val deltaRotationVector = FloatArray(4) { 0f }
    private var timestamp: Float = 0f
    private val client = OkHttpClient()
    //private var mAccelerometer : Sensor ?= null
    //private var mGyroscope : Sensor ?= null
    private var tmp1: Float=0.0f
    private var tmp2: Float=0.0f
    private var tmp3: Float=0.0f
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        app = application as MyApplication

        val policy = ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)

        // Dovoljenja
        if ((ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) && (ContextCompat.checkSelfPermission(this, Manifest.permission.HIGH_SAMPLING_RATE_SENSORS) != PackageManager.PERMISSION_GRANTED)) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.HIGH_SAMPLING_RATE_SENSORS), 2)
        }
        // Google location provider
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createLocationRequest()


        // OnClick
        binding.btnStart.setOnClickListener {
            if(binding.tvStatus.text == getString(R.string.textview_status_idle)){
                binding.tvStatus.text = getString(R.string.textview_status_capturing)
                // Zacni zajemanje podatkov
                app.isCapturing = true
                startLocationUpdates()
                setUpSensorStuff()
                Log.e("x_pospesek",app.accelerationX.toString())

            }
        }
        binding.btnStop.setOnClickListener {
            if(binding.tvStatus.text == getString(R.string.textview_status_capturing)){
                binding.tvStatus.text = getString(R.string.textview_status_idle)
                // Prenehaj zajemanje podatkov
                Log.e("x_pospesek",app.accelerationX.toString())
                app.isCapturing = false
            }
        }
    }

    private fun sendPost(location: Location) {
        val locationString = location.latitude.toString() + ", " + location.longitude.toString()
        // Spremeni na pravilen IP od API (za testiranje more bit local IP, na localhost/127.0.0.1 se ne poveze)
        //val actualUrl = "192.168.178.55:3000"
        //val actualUrl = "192.168.1.27:3000"
        val actualUrl = "localhost:3000"
        val requestBody = FormBody.Builder()
            .add("x_rotacija", app.gyroscopeX.toString())
            .add("y_rotacija", app.gyroscopeY.toString())
            .add("z_rotacija", app.gyroscopeZ.toString())
            .add("x_pospesek", app.accelerationX.toString())
            .add("y_pospesek", app.accelerationY.toString())
            .add("z_pospesek", app.accelerationZ.toString())
            .add("koordinate", locationString)
            .build()

        val request = Request.Builder()
            .url("http://$actualUrl/neobdelaniPodatki")
            .post(requestBody)
            .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            val responseHeaders: Headers = response.headers
            for (i in 0 until responseHeaders.size) {
                Log.e("x_pospesek",app.accelerationX.toString())
                println(responseHeaders.name(i).toString() + ": " + responseHeaders.value(i))
            }
            System.out.println(response.body!!.string())
        }

        /*
        var reqParam = URLEncoder.encode("?stanje_ceste=10&koordinate=32123,32123", "UTF-8")
        val mURL = URL("http://192.168.178.55:3000/rezultat")

        with(mURL.openConnection() as HttpURLConnection) {
            setRequestProperty("Content-Type", "application/json; charset=utf-8")
            requestMethod = "POST"
            doOutput = true

            val wr = OutputStreamWriter(outputStream)
            wr.write(reqParam)
            wr.flush()

            println("URL : $url")
            println("Response Code : $responseCode")
            println("Response message : $responseMessage")*/
            /*
            BufferedReader(InputStreamReader(inputStream)).use {
                val response = StringBuffer()

                var inputLine = it.readLine()
                while (inputLine != null) {
                    response.append(inputLine)
                    inputLine = it.readLine()
                }
                println("Response : $response")
            }
            disconnect()*/

    }

    private fun setUpSensorStuff() {
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
            //Log.e("X Speed: ", linear_acceleration[0].toString())
            //Log.e("Acceleration 1: ", linear_acceleration[1].toString())
            //Log.e("Acceleration 2: ", linear_acceleration[2].toString())
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

            /*Log.e("Rotation------x:", deltaRotationVector[0].toString())//,deltaRotationVector[1].toString(),deltaRotationVector[2].toString())
            Log.e("Rotationy:", deltaRotationVector[1].toString())
            Log.e("Rotationz:", deltaRotationVector[2].toString())*/
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
        locationRequest.smallestDisplacement = 50f // 170 m = 0.1 mile
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

    private fun startLocationUpdates() {
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

    // stop location updates
    private fun stopLocationUpdates() {
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }

    // stop receiving location update when activity not visible/foreground
    override fun onPause() {
        super.onPause()
        if(app.isCapturing)
            stopLocationUpdates()
    }

    // start receiving location update when activity  visible/foreground
    override fun onResume() {
        super.onResume()
        if(app.isCapturing)
            startLocationUpdates()
    }

}