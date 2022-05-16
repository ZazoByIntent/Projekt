import React from "react";
import dynamic from "next/dynamic";
import MyChart from "../components/chart"

export default function Home() {
  const MapWithNoSSR = dynamic(() => import("../components/osmMap"), {
    ssr: false
  });


  return (
    <main>
        <div className="my-container">
            <div className="map">
                <MapWithNoSSR/>
            </div>
            <div className="chart">
                <MyChart/>
            </div>
        </div>
    </main>

  );
}