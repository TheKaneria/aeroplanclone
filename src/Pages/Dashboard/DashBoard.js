import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Helmet } from "react-helmet";
import PathHero from "../../Components/PathHeroComponent/PathHero";
import "bootstrap/dist/css/bootstrap.min.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { FaInfoCircle } from "react-icons/fa";
import ReactModal from "react-modal";
import { useLocation } from "react-router-dom";
import images from "../../Constants/images";
import { IoAirplaneSharp, IoCloseCircle } from "react-icons/io5";
import { ACCEPT_HEADER, get_booking } from "../../Utils/Constant";
import axios from "axios";
import moment from "moment";

import { map } from "rsuite/esm/internals/utils/ReactChildren";

const DashBoard = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [departureFromDate, setDepartureFromDate] = useState(null);
  const [departureToDate, setDepartureToDate] = useState(null);
  const [dep, setDep] = useState("");
  const [arr, setArr] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [getBookingData, SetbookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getBookingDataFilter, SetbookingDataFilter] = useState([]);
  const [getModalData, setModalData] = useState();

  const location = useLocation();

  console.log("getModalData", getModalData);

  const item = location.state?.item;
  const referenceId = location.state?.referanceId;

  const handleFromDateChange = (date) => {
    if (date) {
      const formattedDate = dayjs(date); // Ensure it's a dayjs object
      setFromDate(formattedDate);
      setToDate(null); // Reset "To" date when "From" date is changed
    } else {
      setFromDate(null);
    }
  };

  const handleFromDateChange2 = (date) => {
    setDepartureFromDate(date);
    setDepartureToDate(null); // Reset "To" date when "From" date is changed
  };

  const handleToDateChange = (date) => {
    if (date) {
      const formattedDate = dayjs(date); // Ensure it's a dayjs object
      setToDate(formattedDate);
    } else setToDate(null);
  };
  const handleToDateChange2 = (date) => {
    setDepartureToDate(date);
  };

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setDepartureFromDate(null);
    setDepartureToDate(null);
    setDep("");
    setArr("");
    SetbookingDataFilter(getBookingData); // Reset to original data
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // console.log("item", item);
  // console.log("referenceId", referenceId);

  const disabledDate2 = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const [modalWidth, setModalWidth] = useState(
    window.innerWidth <= 600 ? "90vw" : "80vw"
  );

  useEffect(() => {
    const handleResize = () => {
      setModalWidth(window.innerWidth <= 600 ? "90vw" : "80vw");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    GetBooking();
  }, []);

  const GetBooking = async () => {
    const token = JSON.parse(localStorage.getItem("is_token"));
    setLoading(true);
    axios
      .get(get_booking, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.data.success == 1) {
          console.log("Booking data are", res.data);

          SetbookingData(res.data.data);
          SetbookingDataFilter(res.data.data);
          setLoading(false);
        } else {
          // null;
        }
      })
      .catch((err) => {
        console.log("error11", err);
        setLoading(false);
      });
  };

  const filterFlights = () => {
    const filteredData = getBookingData.filter((item) => {
      const matchesDeparture = dep
        ? item.departure_city.toLowerCase().includes(dep.toLowerCase())
        : true;
      const matchesArrival = arr
        ? item.arrival_city.toLowerCase().includes(arr.toLowerCase())
        : true;

      const itemBookingDate = moment(item?.updated_at).format("YYYY-MM-DD");

      let matchesBookingFrom = true;
      let matchesBookingTo = true;

      if (fromDate) {
        const fromTimestamp = dayjs(fromDate).format("YYYY-MM-DD");
        matchesBookingFrom = fromTimestamp <= itemBookingDate;
      }

      if (toDate) {
        const toTimestamp = dayjs(toDate).format("YYYY-MM-DD");
        matchesBookingTo = toTimestamp >= itemBookingDate;
      }

      return (
        matchesDeparture &&
        matchesArrival &&
        matchesBookingFrom &&
        matchesBookingTo
      );
    });

    SetbookingDataFilter(filteredData);
  };

  return (
    <div>
      <Helmet>
        <title>Dashboard | Airline Booking</title>
      </Helmet>
      <PathHero name={"Dashboard"} />
      {loading === true ? (
        <>
          <div
            style={{
              width: "100%",
              height: "80vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="loader">
              <div className="spinner"></div>
              <p className="loading-text">Loading...</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <section className="container bookingsec shadow">
            <div className="row my-3 justify-content-start justify-content-lg-around justify-content-md-center dashboar_resp_gap">
              <div className="col-lg-3 col-md-5">
                <div className="text-center bkingtxt">Booking Date</div>
                <div className="d-flex justify-content-start align-items-center align-items-center mt-3">
                  <div className="frmtxt text-lg-center text-start">From</div>
                  <div className="text-center w-100">
                    <div className="custom-date-picker booking_details_date_pickers">
                      <DatePicker
                        onChange={handleFromDateChange}
                        value={fromDate}
                        inputReadOnly={true}
                        format="DD-MM-YYYY"
                        placeholder="Select Date"
                        disabledDate={disabledDate2}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-start align-items-center align-items-center mt-3">
                  <div className="frmtxt text-lg-center text-start">To</div>
                  <div className="custom-date-picker w-100 booking_details_date_pickers">
                    <DatePicker
                      onChange={handleToDateChange}
                      value={toDate}
                      inputReadOnly={true}
                      format="DD-MM-YYYY"
                      placeholder="Select Date"
                      disabledDate={(current) =>
                        fromDate
                          ? current && current.isBefore(fromDate, "day")
                          : false
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-5">
                <div className="text-center bkingtxt">City Name</div>
                <div className="my-3">
                  <div className="w-100 w-md-50">
                    <input
                      type="text"
                      className="txtinput txtinput_booking_details"
                      value={dep}
                      onChange={(e) => setDep(e.target.value)}
                      placeholder="Enter departure city name"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    className="txtinput txtinput_booking_details"
                    value={arr}
                    onChange={(e) => setArr(e.target.value)}
                    placeholder="Enter arrival city name"
                  />
                </div>
              </div>
              <div className="col-lg-3 col-md-5">
                <div className="text-center bkingtxt">Search</div>
                <div className="my-3">
                  <button
                    className="btn w-100 text-white fw-bold"
                    style={{ backgroundColor: "#ddb46b" }}
                    // onClick={()=>{filterFlights(dep,arr);}}
                    onClick={filterFlights}
                  >
                    Search
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-danger w-100"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div
              className="col-12 fs-5 mt-lg-5 fw-bold"
              style={{ color: "#dbb46b" }}
            >
              Your Booking Details
            </div>

            <div className="table-div">
              {getBookingDataFilter.length <= 0 ? (
                <p
                  style={{
                    color: "#dbb46b",
                    fontWeight: "700",
                    fontSize: "18px",
                    marginTop: "1rem",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  No Data Found.
                </p>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="text-white">S.No</th>
                      <th className="text-white">Flight Name</th>
                      <th className="text-white">Booking</th>
                      <th className="text-white">Booking Date</th>
                      <th className="text-white">No. of Persons</th>
                      <th className="text-white">Amount</th>
                      <th className="text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getBookingDataFilter.map((item, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px solid #ddb46b" }}
                      >
                        <td>{index + 1}</td>
                        <td>{item.airline_name}</td>
                        <td>
                          {item.child[0].first_name} {item.child[0].last_name}
                        </td>
                        <td>{moment(item?.updated_at).format("DD-MM-YYYY")}</td>
                        <td>{item.total_travelers}</td>
                        <td>{item.total_amount}</td>
                        <td>
                          <FaInfoCircle
                            className="infobtn"
                            size={18}
                            onClick={() => {
                              openModal();
                              setModalData(item);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </>
      )}

      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: modalWidth,
            height: "620px",
            padding: "0",
            border: "none",
            borderRadius: "10px",
            position: "relative",
            overflowY: "auto",
          },
          overlay: {
            zIndex: 10000,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <div className="maindivbookinginfo">
          <button
            className="login_modal_close"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <IoCloseCircle color="#ddb46b" size={30} />
          </button>

          <div className="p-3 resp_modal_main">
            <h4 className="fw-semibold" style={{ marginBottom: "1rem" }}>
              Traveler Details
            </h4>
            <div
              className="table-responsive"
              style={{ border: "1px solid #ddb46b" }}
            >
              <table
                className="table table-bordered custom-table"
                style={{ marginBottom: "0px" }}
              >
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Number</th>
                  </tr>
                </thead>
                <tbody>
                  {getModalData?.child?.map((itm, indx) => {
                    return (
                      <tr key={indx}>
                        {" "}
                        {/* Add a unique key */}
                        <td>{indx + 1}</td>
                        <td>{itm?.first_name}</td>
                        <td>{itm?.last_name}</td>
                        <td>{itm?.phone_no}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="row my-3 gap-1 justify-content-center">
            <div
              className="col-12 col-lg-5"
              style={{ width: getModalData?.is_return == 0 ? "97%" : "" }}
            >
              <div
                className="text-center text-white p-2 fw-bold"
                style={{
                  backgroundColor: "#ddb46b",
                  border: "2px solid #ddb46b",
                }}
              >
                Onward Details
              </div>
              <div className="" style={{ border: "2px solid #ddb46b" }}>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">
                    Departure Date
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.departure_date}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Arrival Date</div>
                  <div className="col-6 text-center">
                    {getModalData?.arrival_date}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">
                    Departure City
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.departure_city}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Arrival City</div>
                  <div className="col-6 text-center">
                    {getModalData?.arrival_city}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">
                    Departure Time
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.departure_time}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Arrival Time</div>
                  <div className="col-6 text-center">
                    {getModalData?.arrival_time}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Stop</div>
                  <div className="col-6 text-center">{getModalData?.stop}</div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Airline Name</div>
                  <div className="col-6 text-center">
                    {getModalData?.airline_name}
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-5 text-center fw-bold">Airline Code</div>
                  <div className="col-6 text-center">
                    {getModalData?.airline_name}
                  </div>
                </div>
              </div>
            </div>

            {getModalData?.is_return == 1 ? (
              <>
                <div className="col-12 col-lg-5">
                  <div
                    className="text-center text-white p-2 fw-bold"
                    style={{
                      backgroundColor: "#ddb46b",
                      border: "2px solid #ddb46b",
                    }}
                  >
                    Return Details
                  </div>
                  <div className="" style={{ border: "2px solid #ddb46b" }}>
                    <div
                      className="row gap-2 p-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Departure Date
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.return_departure_date}
                      </div>
                    </div>
                    <div
                      className="row  gap-2 p-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Arrival Date
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.return_arrival_date}
                      </div>
                    </div>
                    <div
                      className="row gap-2 p-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Departure City
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.return_departure_city}
                      </div>
                    </div>
                    <div
                      className="row gap-2 p-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Arrival City
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.return_arrival_city}
                      </div>
                    </div>
                    <div
                      className="row gap-2 p-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Departure Time
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.return_departure_time}
                      </div>
                    </div>
                    <div
                      className="row gap-2 p-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Arrival Time
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.return_arrival_time}
                      </div>
                    </div>
                    <div
                      className="row gap-2 p-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">Stop</div>
                      <div className="col-6 text-center">
                        {getModalData?.return_stop}
                      </div>
                    </div>
                    <div
                      className="row gap-2 p-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Airline Name
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.return_airline_name}
                      </div>
                    </div>
                    <div
                      className="row gap-2 p-2 align-items-center justify-content-around"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-5 text-center fw-bold">
                        Airline Code
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.return_airline_code}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <div
            className="row gap-1 justify-content-center"
            style={{ marginBottom: "1rem" }}
          >
            <div
              className="col-12 col-lg-5"
              style={{ width: getModalData?.is_return == 0 ? "97%" : "" }}
            >
              <div
                className="text-center text-white p-2 fw-bold"
                style={{ backgroundColor: "#ddb46b" }}
              >
                Flight Stop Details
              </div>
              <div className="" style={{ border: "2px solid #ddb46b" }}>
                {getModalData?.stop_details.length <= 0 ? (
                  <>
                    <p
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        marginTop: "0.7rem",
                      }}
                    >
                      Non Stop
                    </p>
                  </>
                ) : (
                  <>
                    {getModalData?.stop_details?.map((it, ind) => {
                      return (
                        <>
                          <div
                            className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                            style={{ marginLeft: "0px", marginRight: "0px" }}
                          >
                            <div className="col-5 text-center fw-bold">
                              City Name
                            </div>
                            <div className="col-6 text-center">
                              {it?.stop_city}
                            </div>
                          </div>
                          <div
                            className="row p-2 gap-2 align-items-center justify-content-around "
                            style={{ marginLeft: "0px", marginRight: "0px" }}
                          >
                            <div className="col-5 text-center fw-bold">
                              Duration
                            </div>
                            <div className="col-6 text-center">
                              {it?.stop_layover_duration}
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
            {getModalData?.is_return == 1 ? (
              <>
                <div className="col-12 col-lg-5">
                  <div
                    className="text-center text-white p-2 fw-bold"
                    style={{ backgroundColor: "#ddb46b" }}
                  >
                    Return Flight Stop Details
                  </div>

                  <div className="" style={{ border: "2px solid #ddb46b" }}>
                    {getModalData?.return_stop_data?.length > 0 ? (
                      getModalData.return_stop_data.map((item, index) => (
                        <div key={index}>
                          <>
                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-5 text-center fw-bold">
                                City Name
                              </div>
                              <div className="col-6 text-center">Agra</div>
                            </div>

                            <div
                              className="row p-2 gap-2 align-items-center justify-content-around "
                              style={{ marginLeft: "0px", marginRight: "0px" }}
                            >
                              <div className="col-5 text-center fw-bold">
                                Duration
                              </div>
                              <div className="col-6 text-center">10</div>
                            </div>
                          </>
                        </div>
                      ))
                    ) : (
                      <p
                        style={{
                          textAlign: "center",
                          fontWeight: "600",
                          marginTop: "0.7rem",
                        }}
                      >
                        Non Stop
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <div className="row gap-1 justify-content-center">
            <div
              className="col-12 col-lg-5"
              style={{ width: getModalData?.is_return == 0 ? "97%" : "" }}
            >
              <div
                className="text-center text-white p-2 fw-bold"
                style={{ backgroundColor: "#ddb46b" }}
              >
                Baggage Details
              </div>
              <div className="" style={{ border: "2px solid #ddb46b" }}>
                <div className="booking_details_baggage_head ticket_booking_details_table_border p-2">
                  Check-in
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-4 text-center">
                    <div className="fw-bold">Adult</div>
                    <div className="booking_details_age_desc">
                      (Age 12+ yrs)
                    </div>
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.check_in_adult} KG
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-4 text-center">
                    <div className="fw-bold">Children</div>
                    <div className="booking_details_age_desc">
                      (Age 2-12 yrs)
                    </div>
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.check_in_children} KG
                  </div>
                </div>
                <div className="row p-2 gap-2 align-items-center justify-content-around ">
                  <div className="col-4 text-center">
                    <div className="fw-bold">Infant</div>
                    <div className="booking_details_age_desc">(Age 2 yrs)</div>
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.check_in_infant} KG
                  </div>
                </div>
              </div>

              <div className=" mt-3" style={{ border: "2px solid #ddb46b" }}>
                <div className="booking_details_baggage_head ticket_booking_details_table_border p-2">
                  Cabin
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-4 text-center">
                    <div className="fw-bold">Adult</div>
                    <div className="booking_details_age_desc">
                      (Age 12+ yrs)
                    </div>
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.cabin_adult} KG
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-4 text-center">
                    <div className="fw-bold">Children</div>
                    <div className="booking_details_age_desc">
                      (Age 2-12 yrs)
                    </div>
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.cabin_children} KG
                  </div>
                </div>
                <div
                  className="row p-2 gap-2 align-items-center justify-content-around "
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <div className="col-4 text-center ">
                    <div className="fw-bold">Infant</div>
                    <div className="booking_details_age_desc">(Age 2 yrs)</div>
                  </div>
                  <div className="col-6 text-center">
                    {getModalData?.cabin_infant} KG
                  </div>
                </div>
              </div>
            </div>
            {getModalData?.is_return == 1 ? (
              <>
                <div className="col-12 col-lg-5">
                  <div
                    className="text-center text-white p-2 fw-bold"
                    style={{ backgroundColor: "#ddb46b" }}
                  >
                    Return Baggage Details
                  </div>
                  <div className="" style={{ border: "2px solid #ddb46b" }}>
                    <div className="booking_details_baggage_head ticket_booking_details_table_border p-2">
                      Check-in
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-4 text-center">
                        <div className="fw-bold">Adult</div>
                        <div className="booking_details_age_desc">
                          (Age 12+ yrs)
                        </div>
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.check_in_adult} KG{" "}
                      </div>
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-4 text-center">
                        <div className="fw-bold">Children</div>
                        <div className="booking_details_age_desc">
                          (Age 2-12 yrs)
                        </div>
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.check_in_children} KG
                      </div>
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around "
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-4 text-center">
                        <div className="fw-bold">Infant</div>
                        <div className="booking_details_age_desc">
                          (Age 2 yrs)
                        </div>
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.check_in_infant} KG
                      </div>
                    </div>
                  </div>
                  <div
                    className=" mt-3"
                    style={{ border: "2px solid #ddb46b" }}
                  >
                    <div className="booking_details_baggage_head p-2 ticket_booking_details_table_border">
                      Cabin
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-4 text-center">
                        <div className="fw-bold">Adult</div>
                        <div className="booking_details_age_desc">
                          (Age 12+ yrs)
                        </div>
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.cabin_adult}KG
                      </div>
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around ticket_booking_details_table_border"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-4 text-center">
                        <div className="fw-bold">Children</div>
                        <div className="booking_details_age_desc">
                          (Age 2-12 yrs)
                        </div>
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.cabin_children} KG
                      </div>
                    </div>
                    <div
                      className="row p-2 gap-2 align-items-center justify-content-around "
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <div className="col-4 text-center ">
                        <div className="fw-bold">Infant</div>
                        <div className="booking_details_age_desc">
                          (Age 2 yrs)
                        </div>
                      </div>
                      <div className="col-6 text-center">
                        {getModalData?.cabin_infant} KG
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <div
            className="row mt-4"
            style={{ marginLeft: "0px", marginRight: "0px" }}
          >
            <div
              className="col-12 pricee-tag"
              style={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
              <h2
                className="fs-4 fs-lg-2 p-2"
                style={{ backgroundColor: "var(--color-theme)", color: "#fff" }}
              >
                Price Summary
              </h2>
            </div>
            <div
              className=" mt-3"
              style={{
                border: "2px solid #ddb46b",
                marginLeft: "0px",
                marginRight: "0px",
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <div
                className="row p-2 w-100 ticket_booking_details_table_border"
                style={{ marginLeft: "0px", marginRight: "0px" }}
              >
                <div className="col-6 text-start text-black">Base Fare</div>
                <div className="col-6 text-end text-black">
                  {/* <span>&#8377;</span> {item?.price_breakup.base_fare} */}
                  <span>&#8377;</span> {getModalData?.base_fare}.00
                </div>
              </div>
              <div
                className="row p-2 w-100 ticket_booking_details_table_border"
                style={{ marginLeft: "0px", marginRight: "0px" }}
              >
                <div className="col-6 text-start text-black">Discount</div>
                <div className="col-6 text-end text-black">
                  {/* <span>&#8377;</span> {item?.price_breakup.discount} */}
                  <span>&#8377;</span> {getModalData?.discount}.00
                </div>
              </div>
              <div
                className="row p-2 w-100 ticket_booking_details_table_border"
                style={{ marginLeft: "0px", marginRight: "0px" }}
              >
                <div className="col-6 text-start text-black">
                  Taxes & Others
                </div>
                <div className="col-6 text-end text-black">
                  {/* <span>&#8377;</span> {item?.price_breakup.fee_taxes} */}
                  <span>&#8377;</span>
                  {getModalData?.taxes_and_others}.00
                </div>
              </div>
              <div
                className="row p-2 w-100 ticket_booking_details_table_border"
                style={{ marginLeft: "0px", marginRight: "0px" }}
              >
                <div className="col-6 text-start text-black">Service Fees</div>
                <div className="col-6 text-end text-black">
                  {/* <span>&#8377;</span> {item?.price_breakup.service_charge} */}
                  <span>&#8377;</span> {getModalData?.service_fees}.00
                </div>
              </div>
              <div
                className="bottomlito"
                style={{ marginBottom: "0rem" }}
              ></div>
              <div
                className="row w-100 "
                style={{
                  marginLeft: "0px",
                  marginRight: "0px",
                  marginBottom: "0.5rem",
                }}
              >
                <div className="col-6 text-start fs-4 fw-bolder text-black">
                  Total
                </div>
                <div className="col-6 text-end text-black fw-bolder fs-4">
                  {/* <span>&#8377;</span> {item?.total_payable_price} */}
                  <span>&#8377;</span> {getModalData?.total_amount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default DashBoard;
