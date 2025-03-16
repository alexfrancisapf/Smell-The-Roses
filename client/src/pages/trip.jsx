import React, { useContext } from "react"
import { TripContext } from "../context/TripContext"
import FetchPois from "../components/fetchPois"

const Trip = () => {

  const { tripData, setTripData } = useContext(TripContext);

  return (
    <>
      <FetchPois />
      <h1>trip</h1>
      <p>Trip Data: {tripData ? JSON.stringify(tripData) : "No trip selected"}</p>
      {/* change below */}
      <button onClick={() => setTripData({ destination: "Japan", timeLimit: "2 hours" })}>
        Set Trip Data
      </button>
    </>
  )
}

export default Trip