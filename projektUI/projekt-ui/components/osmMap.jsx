import React, { Component } from "react";
import { MapContainer, Marker, Popup, TileLayer, Polyline, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

let rezultati = [];
let koordinatePolyline = [];
let updatedArray = [];

class Test1 extends Component {
  state = {
    mapPoints: []
  };
  
  getRezultati() {
    console.log("FETCH")
    //this.setState({ mapPoints: [] });
    return fetch('http://localhost:3001/rezultat')
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson.json();
    })
    .catch((error) => {
      console.error(error);
    });
  }

  addMarker = (mapClickInfo) => {
    let updatedArray = [...this.state.mapPoints];
    updatedArray.push([mapClickInfo.latlng.lat, mapClickInfo.latlng.lng]);
    this.setState({ mapPoints: updatedArray });
  };

  getMapPoints = (markerPositions) => {
    if (markerPositions.length >= 2) return markerPositions;
    else
      return [
        [0, 0],
        [0, 0]
      ];
  };

  componentDidMount() {
    
  }

  mapaNalozena(){
    let newArray = [];

    fetch('http://localhost:3001/rezultat')
    .then((response) => response.json())
    .then((responseJson) => {
      for (var i = 0; i < responseJson.length; i++){
        var test = [];
        test = JSON.stringify(responseJson[i].koordinate);
        let koordinate = test.split(",");
        koordinate[0] = koordinate[0].replace(/['"]+/g, '');
        koordinate[1] = koordinate[1].trim();
        let test = [0,0];
        test[0] = parseFloat(koordinate[0]);
        test[1] = parseFloat(koordinate[1]);
        let result = Object.values(test);
        newArray.push(result);
        { <Marker position={result}></Marker> }        
      }
    })
    .catch((error) => {
      console.error(error);
    });

    this.setState({ mapPoints: newArray });
    console.log(this.state.mapPoints);
  }

  render() {
    return (
      <MapContainer
      center={[46.55353455753438, 15.644892773708696]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", position: "absolute" }}
      whenReady={() => {
        this.mapaNalozena()
      }}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiemF6bzIwMDAiLCJhIjoiY2wzOTlueXB0MDBkbTNkbW82azVxYXZxYSJ9.3BvSbH7qXomkevh596Kmew`}
        attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
      />
      <Polyline
          color="red"
          positions={this.getMapPoints(this.state.mapPoints)}
      />
    </MapContainer>
    );
  }
};

export default Test1