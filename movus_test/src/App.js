import { useState, useEffect } from "react"
import './App.css';
import axios from "axios";
import { Form, Card, Button, Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  // state untuk menyimpan data dari fetching
  const [carManufacture, setManufacture] = useState({})
  const [carModel, setModel] = useState({})
  const [carFetch, setCarFetch] = useState([])
  const [barData, setBardata] = useState([])
  // default state
  const carList = ["toyota", "daihatsu", "honda", "bmw", "mitsubishi", "mercedes", "mazda", "jaguar", "volkswagen", "tesla"]
  const [carYear, setCarYear] = useState(0)

  // state untuk menyimpan history
  const [carHistory, setCarHistory] = useState([])
  const [yearHistory, setYearHistory] = useState([])
  // function untuk menyimpan history
  const isiHystory = () => {
    setCarHistory([
      ...carHistory,
      { barData }
    ])
    setYearHistory([
      ...yearHistory,
      { carYear }
    ])
    setBardata([
    ])
    setCarYear(0)
  }

  // handle change dari checkbox filter
  const handleChange = (x) => {
    setBardata([
      ...barData,
      x
    ]);
  };

  //=== data untuk Bar Chart ===
  const dataChart = {
    labels: carFetch?.map((item) => (
      item?.data?.SearchCriteria?.replace('Make:', '').replace('| VehicleType:car', '').replace('| ModelYear:', ' ')
    )),
    datasets: [
      {
        label: 'Data Mobil',
        backgroundColor: 'rgba(175,25,192,1)',
        borderColor: 'rgba(0,20,0,1)',
        borderWidth: 2,
        data: carFetch?.map((item, index) => (
          item?.data?.Count
        ))
      }
    ]
  }
  // === data untuk Bar Chart end ===

  const getManufacture_Model = async () => {

    const allManufacture = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json`);
    setManufacture(allManufacture?.data);

    const allModel = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`);
    setModel(allModel?.data);

  };
  // === untuk fetch data bar chart ===

  const getAllList = async (data, year) => {
    carYear > 0 ?

      Promise.all(
        data?.map(async (x) => await
          (axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${x}/modelyear/${year}/vehicleType/car?format=json`)
          )))
        .then(result => setCarFetch(result))

      :

      Promise.all(
        data?.map(async (x) => await
          (axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${x}/vehicleType/car?format=json`)
          )))
        .then(result => setCarFetch(result))
  }
  // ==== fetch data bar chart end =====

  const Reset = async () => {
    setCarYear(0);
    await getAllList(carList)
  }

  useEffect(() => {
    getManufacture_Model()
    getAllList(carList)
  }, [])

  return (
    <div className="App">
      <div className="App-header">
        <div style={{ display: "flex" }}>
          {/* Counter Card */}
          <Card
            bg={"danger"}
            text={"white"}
            style={{ width: '18rem' }}
            className="mb-2"
          >
            <Card.Body>
              <Card.Title> Total Car Maker </Card.Title>
              <Card.Text>
                {carManufacture?.Count === undefined ? <Spinner animation="border" variant="light" /> : `${carManufacture?.Count}`}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card
            bg={"light"}
            text={"dark"}
            style={{ width: '18rem' }}
            className="mb-2"
          >
            <Card.Body>
              <Card.Title> Total Model </Card.Title>
              <Card.Text>
                {carModel?.Count === undefined ? <Spinner animation="border" variant="secondary" /> : `${carModel?.Count}`}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        {/* ====bar Chart Data=== */}
        <div style={{ width: '700px', }}>
          <Bar
            data={dataChart}
            height={"100%"}
            // width={"50%"}
            options={{
              title: {
                display: true,
                text: 'Data Mobil',
                fontSize: 20,
                color: 'white'
              },
              legend: {
                display: true,
                position: 'right'
              }
            }}
            data-testid="Bar"
          />
        </div>
        {/* ====bar Chart Data end=== */}


        {/* ======= Bagian Filter data ====== */}
        <h5>Filter</h5>

        <div className="d-flex flex-wrap justify-content-between" style={{ maxWidth: '600px' }}>
          {carList?.map((item, index) => (
            <div key={index}>
              <Form.Check className="mx-1" type="checkbox" value={item} label={item}
                onClick={(e) => {
                  if (e.target.checked) {
                    handleChange(e.target.value)
                  } else {
                    setBardata(
                      barData.filter((merek) => merek !== e.target.value),
                    );
                  }
                }} />
            </div>
          ))}

          <Form.Select value={carYear} onChange={(e) => setCarYear(e.target.value)}>
            <option>Select Year</option>
            {Array.from({ length: 2022 - 1995 + 1 }, (_, index) => 2022 - index)
              .map(year => <option value={`${year}`}>{year}</option>)
            }

          </Form.Select>
        </div>
        <div className="d-flex justify-content-between" style={{ width: '600px' }}>
          <Button variant="danger" onClick={() => Reset()}>Reset</Button>

          <Button className={`${barData?.length > 0 && carYear > 0 ? null : "disabled"}`} onClick={() => { getAllList(barData, carYear); isiHystory() }}>Update Data</Button>

        </div>

        <h5>Click to see previous data</h5>
        <div className="d-flex ">
          {carHistory?.map((item, index) => (
            <Button className={'mx-2'} onClick={() => { setCarYear(yearHistory[index]?.carYear); getAllList(item?.barData, yearHistory[index]?.carYear) }}>History &nbsp; {index + 1}</Button>
          ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;
