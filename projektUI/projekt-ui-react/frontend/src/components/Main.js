import Map from "./Map";
import Chart from "./Chart";


const Main = () => { 

    return (
        <>
            <div className="my-container">
                <div className="chart">
                    <Chart/>
                </div>
                <div className="map">
                    <Map/>
                </div>
            </div>
        </>
    );
};

export default Main;
