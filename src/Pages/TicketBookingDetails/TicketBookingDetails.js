import React, { useEffect, useState } from "react";
import "./TicketBookingDetails.css";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";
import PathHero from "../../Components/PathHeroComponent/PathHero";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Helmet } from "react-helmet";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import axios from "axios";
import Notification from "../../Utils/Notification";
import ReactModal from "react-modal";
import { IoAirplaneSharp } from "react-icons/io5";
import { ACCEPT_HEADER, booking } from "../../Utils/Constant";
import Item from "antd/es/list/Item";
import { DateRangePicker } from "rsuite";

const TicketBookingDetails = () => {
  const location = useLocation();
  const [item, setItem] = useState(location.state?.item || null);
  const [ttltraveller, setttltraveller] = useState(
    location.state?.totaltraveller || 1
  );

  const [adulttraveler, setadulttraveler] = useState(
    location.state?.adulttraveler
  );
  const [childtraveler, setchildtraveler] = useState(
    location.state?.childtraveler
  );
  const [infanttraveler, setinfanttraveler] = useState(
    location.state?.infanttraveler
  );
  const [bookingtokenid, setbookingtokenid] = useState(
    location.state?.bookingtokenid
  );

  const animatedComponents = makeAnimated();
  const [age, setAge] = useState(null);
  const [login, SetLogin] = useState("");
  const [getBookingData, setBookingData] = useState();
  const [getBookingData2, setBookingData2] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    var islogin = localStorage.getItem("is_login");
    SetLogin(islogin);

    window.scroll(0, 0);
  }, []);

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };
  const disabledDate2 = (current) => {
    return current && current > dayjs().endOf("day");
  };

  let navigate = useNavigate();

  const [travelers, setTravelers] = useState(
    Array.from({ length: ttltraveller }, () => ({
      fname: "",
      lname: "",
      email: "",
      number: "",
      gender: null,
      dob: null,
      age: "",
      passport_expire_date: null,
      passport_no: "",
    }))
  );
  const [check, setCheck] = useState(false);

  console.log("travelers", travelers);

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    const publicIP = "183.83.43.117";

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    // Check if the user is logged in
    if (!login || login === "null") {
      alert("Please Login first before booking the flight.");
      return; // Stop execution
    }

    if (!Array.isArray(travelers) || travelers.length === 0) {
      alert("Please add at least one traveler.");
      return;
    }

    // Validation for travelers
    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];
      if (!traveler.fname.trim()) {
        alert(`Please enter the First Name for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.lname.trim()) {
        alert(`Please enter the Last Name for Traveler ${i + 1}.`);
        return;
      }
      if (
        !traveler.passport_expire_date &&
        item?.international_flight_staus == 1
      ) {
        alert(
          `Please select the expiry date of passport for Traveler ${i + 1}.`
        );
        return;
      }
      if (
        !traveler.passport_no.trim() &&
        item?.international_flight_staus == 1
      ) {
        alert(`Please enter the passport number for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.email.trim()) {
        alert(`Please enter the Email for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.number.trim()) {
        alert(`Please enter the Phone Number for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.gender) {
        alert(`Please select the Gender for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.dob) {
        alert(`Please enter the Date of Birth for Traveler ${i + 1}.`);
        return;
      }
    }

    if (!check) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    // Age Validation
    const currentDate = new Date();
    let hasValidAdult = false,
      hasValidChild = false,
      hasValidInfant = false;

    travelers.forEach((traveler) => {
      const dob = new Date(traveler.dob);
      const age = (currentDate - dob) / (1000 * 60 * 60 * 24 * 365.25);

      if (age >= 12) hasValidAdult = true;
      if (age >= 2 && age < 12) hasValidChild = true;
      if (age >= 0 && age < 2) hasValidInfant = true;
    });

    if (adulttraveler > 0 && !hasValidAdult) {
      alert(
        "At least one traveler must be 12 years or older if an adult traveler is selected."
      );
      return;
    }

    if (childtraveler > 0 && !hasValidChild) {
      alert(
        "At least one traveler must be between 2 and 12 years old if a child traveler is selected."
      );
      return;
    }

    if (infanttraveler > 0 && !hasValidInfant) {
      alert(
        "At least one traveler must be between 0 and 2 years old if an infant traveler is selected."
      );
      return;
    }
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  const getPublicIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip; // Returns the public IP
    } catch (error) {
      console.error("Error fetching public IP:", error);
      return null; // Handle errors by returning null or a default value
    }
  };

  const handleDateChange = (index, date) => {
    if (date) {
      const birthYear = date.year();
      const currentYear = dayjs().year();
      const travelerAge = currentYear - birthYear;

      const updatedTravelers = [...travelers];
      updatedTravelers[index].dob = date.format("YYYY-MM-DD"); // Store formatted date
      updatedTravelers[index].age = travelerAge;
      setTravelers(updatedTravelers);
    }
  };
  const handleDateChange2 = (index, date) => {
    if (date) {
      const updatedTravelers = [...travelers];
      updatedTravelers[index].passport_expire_date = date.format("YYYY-MM-DD"); // Store formatted date
      setTravelers(updatedTravelers);
    }
  };

  const togglecheck = () => {
    setCheck(!check);
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };

  const handleGenderChange = (index, selectedOption) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index].gender = selectedOption;
    setTravelers(updatedTravelers);
  };

  const handleSubmit = async () => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = "183.83.43.117";

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    if (!login || login === "null") {
      alert("Please Login first before booking the flight.");
      return;
    }

    // Validation for travelers
    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];
      if (!traveler.fname.trim()) {
        alert(`Please enter the First Name for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.lname.trim()) {
        alert(`Please enter the Last Name for Traveler ${i + 1}.`);
        return;
      }
      if (
        !traveler.passport_expire_date &&
        item?.international_flight_staus == 1
      ) {
        alert(
          `Please select the expiry date of passport for Traveler ${i + 1}.`
        );
        return;
      }
      if (
        !traveler.passport_no.trim() &&
        item?.international_flight_staus == 1
      ) {
        alert(`Please enter the passport number for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.email.trim()) {
        alert(`Please enter the Email for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.number.trim()) {
        alert(`Please enter the Phone Number for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.gender) {
        alert(`Please select the Gender for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.dob) {
        alert(`Please enter the Date of Birth for Traveler ${i + 1}.`);
        return;
      }
    }

    if (!check) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    // Age Validation
    const currentDate = new Date();
    let hasValidAdult = false;
    let hasValidChild = false;
    let hasValidInfant = false;

    travelers.forEach((traveler) => {
      const dob = new Date(traveler.dob);
      const age = (currentDate - dob) / (1000 * 60 * 60 * 24 * 365.25); // Calculate age in years

      if (age >= 12) hasValidAdult = true;
      if (age >= 2 && age < 12) hasValidChild = true;
      if (age >= 0 && age < 2) hasValidInfant = true;
    });

    if (adulttraveler > 0 && !hasValidAdult) {
      alert(
        "At least one traveler must be 12 years or older if an adult traveler is selected."
      );
      return;
    }

    if (childtraveler > 0 && !hasValidChild) {
      alert(
        "At least one traveler must be between 2 and 12 years old if a child traveler is selected."
      );
      return;
    }

    if (infanttraveler > 0 && !hasValidInfant) {
      alert(
        "At least one traveler must be between 0 and 2 years old if an infant traveler is selected."
      );
      return;
    }

    // Constructing traveler details as an array
    const flight_traveller_details = travelers.map((traveler) => ({
      gender:
        traveler.gender.value === "male"
          ? "Mr"
          : traveler.gender.value === "female"
          ? "Miss"
          : "",
      first_name: traveler.fname,
      middle_name: "",
      last_name: traveler.lname,
      age: traveler.age,
      dob: traveler.dob,
      passport_no: traveler.passport_no,
      passport_expire_date: traveler.passport_expire_date,
    }));

    // Constructing JSON payload
    const payload = {
      id: item.id,
      onward_date: item?.onward_date,
      return_date:
        item?.trip_type == 0 ? "" : item?.return_flight_data?.return_dep_date,
      adult: adulttraveler,
      children: childtraveler,
      infant: infanttraveler,
      dep_city_code: item?.dep_city_code,
      arr_city_code: item?.arr_city_code,
      total_book_seats: ttltraveller,
      contact_name: travelers[0].fname,
      contact_email: travelers[0].email,
      contact_number: travelers[0].number,
      flight_traveller_details,
      booking_token_id: bookingtokenid,
      total_amount: item?.total_payable_price,
      partner_user_id: "0",
      static: item?.static,
      end_user_ip: publicIP,
      token: token,
    };

    console.log("Payload:", payload);
    setLoading(true);

    const url = "https://devapi.fareboutique.com/v1/fbapi/book";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);
        setBookingData(data);
        setLoading(false);
        // Notification("success", "Success", "Ticket has been booked successfully");
        // openModal();
        closeModal();
      } else {
        console.error("API call failed:", response.status, response.statusText);
        alert("Failed to submit the form. Please try again later.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
      alert("An error occurred. Please try again later.");
      setLoading(false);
    }
  };

  const handleSubmit2 = async () => {
    const token = JSON.parse(localStorage.getItem("is_token"));
    const publicIP = "183.83.43.117"; // This seems hardcoded; fetch dynamically if needed

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    if (!login || login === "null") {
      alert("Please Login first before booking the flight.");
      return;
    }

    if (!Array.isArray(travelers) || travelers.length === 0) {
      alert("Please add at least one traveler.");
      return;
    }

    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];
      if (!traveler.fname.trim()) {
        alert(`Please enter the First Name for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.lname.trim()) {
        alert(`Please enter the Last Name for Traveler ${i + 1}.`);
        return;
      }
      if (
        !traveler.passport_expire_date &&
        item?.international_flight_staus == 1
      ) {
        alert(
          `Please select the expiry date of passport for Traveler ${i + 1}.`
        );
        return;
      }
      if (
        !traveler.passport_no.trim() &&
        item?.international_flight_staus == 1
      ) {
        alert(`Please enter the passport number for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.email.trim()) {
        alert(`Please enter the Email for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.number.trim()) {
        alert(`Please enter the Phone Number for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.gender) {
        alert(`Please select the Gender for Traveler ${i + 1}.`);
        return;
      }
      if (!traveler.dob) {
        alert(`Please enter the Date of Birth for Traveler ${i + 1}.`);
        return;
      }
    }

    if (!check) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    // Age Validation
    const currentDate = new Date();
    let hasValidAdult = false,
      hasValidChild = false,
      hasValidInfant = false;

    travelers.forEach((traveler) => {
      const dob = new Date(traveler.dob);
      const age = (currentDate - dob) / (1000 * 60 * 60 * 24 * 365.25);

      if (age >= 12) hasValidAdult = true;
      if (age >= 2 && age < 12) hasValidChild = true;
      if (age >= 0 && age < 2) hasValidInfant = true;
    });

    if (adulttraveler > 0 && !hasValidAdult) {
      alert(
        "At least one traveler must be 12 years or older if an adult traveler is selected."
      );
      return;
    }

    if (childtraveler > 0 && !hasValidChild) {
      alert(
        "At least one traveler must be between 2 and 12 years old if a child traveler is selected."
      );
      return;
    }

    if (infanttraveler > 0 && !hasValidInfant) {
      alert(
        "At least one traveler must be between 0 and 2 years old if an infant traveler is selected."
      );
      return;
    }
    setLoading(true);

    const formdata = new FormData();
    formdata.append("airline_name", item?.airline_name);
    formdata.append("airline_code", item?.flight_number);
    formdata.append("departure_date", item?.onward_date);
    formdata.append("arrival_date", item?.arr_date);
    formdata.append("departure_time", item?.dep_time);
    formdata.append("arrival_time", item?.arr_time);
    formdata.append("departure_city", item?.dep_city_name);
    formdata.append("arrival_city", item?.arr_city_name);
    formdata.append("stop", item?.no_of_stop);
    if (item?.stop_data.length > 0) {
      for (let j = 0; j < item?.stop_data.length; j++) {
        formdata.append(`stop_city[${j}]`, item?.stop_data[j].city_name);
        formdata.append(`stop_arrival[${j}]`, item?.stop_data[j].arrival_time);
        formdata.append(
          `stop_layover_duration[${j}]`,
          item?.stop_data[j].stop_duration
        );
        formdata.append(
          `stop_departure[${j}]`,
          item?.stop_data[j].departure_time
        );
      }
    }
    formdata.append("is_return", item?.trip_type == 0 ? 0 : 1);
    if (item?.trip_type == 1) {
      formdata.append("return_airline_name", item?.airline_name);
      formdata.append("return_airline_code", item?.return_flight_number);
      formdata.append(
        "return_departure_date",
        item?.return_flight_data?.return_dep_date
      );
      formdata.append(
        "return_arrival_date",
        item?.return_flight_data?.return_arr_date
      );
      formdata.append(
        "return_departure_time",
        item?.return_flight_data?.return_dep_time
      );
      formdata.append(
        "return_arrival_time",
        item?.return_flight_data?.return_arr_time
      );
      formdata.append(
        "return_departure_city",
        item?.return_flight_data?.return_dep_city_name
      );
      formdata.append(
        "return_arrival_city",
        item?.return_flight_data?.return_arr_city_name
      );
      formdata.append("return_stop", item?.return_no_of_stop);
      if (item?.return_stop_data.length > 0) {
        for (let k = 0; k < item?.return_stop_data.length; k++) {
          formdata.append(
            `return_stop_city[${k}]`,
            item?.return_stop_data[k].city_name
          );
          formdata.append(
            `return_stop_arrival[${k}]`,
            item?.return_stop_data[k].arrival_time
          );
          formdata.append(
            `return_stop_layover_duration[${k}]`,
            item?.return_stop_data[k].stop_duration
          );
          formdata.append(
            `return_stop_departure[${k}]`,
            item?.return_stop_data[k].departure_time
          );
        }
      }
    }
    formdata.append(
      "is_refundable",
      item?.FareClasses[0].Class_Desc == "Non Refundable (LIVE Booking)" ? 0 : 1
    );
    formdata.append("available_seats", item?.available_seats);
    formdata.append("total_baggage", item?.check_in_baggage_adult);
    formdata.append("check_in_adult", item?.check_in_baggage_adult);
    formdata.append("check_in_children", item?.check_in_baggage_children);
    formdata.append("check_in_infant", item?.check_in_baggage_infant);
    formdata.append("cabin_adult", item?.cabin_baggage_adult);
    formdata.append("cabin_children", item?.cabin_baggage_children);
    formdata.append("cabin_infant", item?.cabin_baggage_infant);
    formdata.append("adult_travelers", adulttraveler);
    formdata.append("child_travelers", childtraveler);
    formdata.append("infant_travelers", infanttraveler);
    formdata.append("total_travelers", ttltraveller);
    formdata.append("total_amount", item?.total_payable_price);
    formdata.append("base_fare", item?.price_breakup?.base_fare);
    formdata.append("discount", item?.price_breakup?.discount);
    formdata.append("taxes_and_others", item?.price_breakup?.fee_taxes);
    formdata.append("service_fees", item?.price_breakup?.service_charge);
    formdata.append(
      "is_international",
      item?.international_flight_staus == 0
        ? "0"
        : item?.international_flight_staus == 1
        ? "1"
        : ""
    );

    for (let i = 0; i < travelers.length; i++) {
      formdata.append(`first_name[${i}]`, travelers[i].fname);
      formdata.append(`last_name[${i}]`, travelers[i].lname);
      formdata.append(
        `gender[${i}]`,
        travelers[i].gender?.value === "male"
          ? 1
          : travelers[i].gender?.value === "female"
          ? 2
          : travelers[i].gender?.value === "other"
          ? 3
          : ""
      );
      formdata.append(`dob[${i}]`, travelers[i].dob);
      formdata.append(`age[${i}]`, travelers[i].age);
      if (item?.international_flight_staus == 1) {
        formdata.append(
          `passport_expiry_date[${i}]`,
          travelers[i].passport_expire_date
        );
        formdata.append(`passport_no[${i}]`, travelers[i].passport_no);
      }
      formdata.append(`email[${i}]`, travelers[i].email);
      formdata.append(`phone_no[${i}]`, travelers[i].number);
    }

    try {
      const response = await fetch(booking, {
        method: "POST",
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: "Bearer " + token,
        },
        body: formdata,
      });

      if (response.ok) {
        const data = await response.json();
        setBookingData2(data);
        setLoading(false);
        Notification(
          "success",
          "Success",
          "Ticket has been booked successfully"
        );
        // openModal();
        closeModal();
        navigate("/");
        setTravelers(
          Array.from({ length: ttltraveller }, () => ({
            fname: "",
            lname: "",
            email: "",
            number: "",
            gender: null,
            dob: null,
            age: "",
            passport_expire_date: null,
            passport_no: "",
          }))
        );
        setCheck(false);
      } else {
        alert("Failed to submit the form. Please try again later.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Booking</title>
      </Helmet>

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
          <PathHero name={"Flight Booking"} />

          <div className="container-fluid details-contt py-4">
            <div className="bg-cont">
              <div className="row justify-content-center">
                <div className="col-12 col-lg-7 order-2 order-lg-1">
                  <div className="row mt-3">
                    <div className="col-12">
                      <h2 className="fw-bold fs-4 fs-lg-3 text-white">
                        Enter Your Details
                      </h2>
                      <p className="text-white">
                        Enter required information for each traveler and be sure
                        that it exactly matches the government-issued ID
                        presented at the airport.
                      </p>
                    </div>
                  </div>
                  <div className="row mt-4 gap-2 align-items-center">
                    <div className="col-12 col-lg-4 d-flex gap-2 align-items-center">
                      <h5 className="fw-bold fs-5 fs-lg-4 text-white">
                        Total Traveler(s){" "}
                      </h5>
                      <h5 className="fw-semibold text-white">{ttltraveller}</h5>
                    </div>
                  </div>
                  {travelers.map((traveler, index) => (
                    <div
                      key={index}
                      className="traveler-details mt-4"
                      style={{
                        borderBottom:
                          travelers.length > 1 ? "1px solid #fff" : "",
                        paddingBottom: travelers.length > 1 ? "1rem" : "",
                      }}
                    >
                      <div className="row align-items-center gap-2 mt-3 mb-3">
                        <div className="col-md-5">
                          <h5 className="fs-5 text-white">
                            Traveler {index + 1}
                          </h5>
                        </div>
                        <div className="col-12 col-md-5">
                          <h4 className="fw-bold fs-5 text-white">Gender</h4>
                          <Select
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            isMulti={false}
                            options={genderOptions}
                            value={traveler.gender}
                            onChange={(selectedOption) =>
                              handleGenderChange(index, selectedOption)
                            }
                            styles={{
                              container: (provided) => ({
                                ...provided,
                                backgroundColor: "#fffbdb",
                                borderRadius: "10px",
                              }),
                              control: (provided) => ({
                                ...provided,
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                borderRadius: "10px",
                              }),
                              menu: (provided) => ({
                                ...provided,
                                backgroundColor: "#fff",
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isFocused
                                  ? "#dbb46b"
                                  : "transparent",
                                color: state.isFocused ? "#fff" : "#000",
                              }),
                            }}
                          />
                        </div>
                      </div>
                      <div className="row gap-2">
                        <div className="col-12 col-md-5">
                          <h4 className="fw-bold fs-5 text-white">
                            First Name
                          </h4>
                          <input
                            type="text"
                            value={traveler.fname}
                            onChange={(e) =>
                              handleInputChange(index, "fname", e.target.value)
                            }
                            className="w-100 p-2  inpttticket"
                          />
                        </div>
                        <div className="col-12 col-md-5">
                          <h4 className="fw-bold fs-5 text-white">Last Name</h4>
                          <input
                            type="text"
                            value={traveler.lname}
                            onChange={(e) =>
                              handleInputChange(index, "lname", e.target.value)
                            }
                            className="w-100 p-2 inpttticket"
                          />
                        </div>
                        <div className="col-12 col-md-5">
                          <h4 className="fw-bold fs-5 text-white">
                            Date Of Birth
                          </h4>
                          <DatePicker
                            onChange={(date) => handleDateChange(index, date)}
                            format="DD-MM-YYYY"
                            className="w-100 booking_details_datepicker_padding"
                            disabledDate={disabledDate2}
                            style={{ padding: "0.6rem !important" }}
                          />
                        </div>

                        <div className="col-12 col-md-5">
                          <h4 className="fw-bold fs-5 text-white">Age</h4>
                          <input
                            style={{
                              backgroundColor: "var(--color-background)",
                            }}
                            type="text"
                            value={traveler.age}
                            className="w-100 p-2"
                            readOnly
                          />
                        </div>
                        {item?.international_flight_staus == 1 ? (
                          <>
                            <div className="col-12 col-md-5">
                              <h4 className="fw-bold fs-5 text-white">
                                Passport Expiry Date
                              </h4>

                              <DatePicker
                                onChange={(date) =>
                                  handleDateChange2(index, date)
                                }
                                format="YYYY-MM-DD"
                                className="w-100 booking_details_datepicker_padding"
                                disabledDate={disabledDate}
                              />
                            </div>

                            <div className="col-12 col-md-5">
                              <h4 className="fw-bold fs-5 text-white">
                                Passport No
                              </h4>
                              <input
                                style={{
                                  backgroundColor: "var(--color-background)",
                                }}
                                type="text"
                                value={traveler.passport_no}
                                className="w-100 p-2"
                                maxLength={8}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "passport_no",
                                    e.target.value
                                  )
                                }
                                // readOnly
                              />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="row gap-2 mt-3">
                        <div className="col-12 col-md-5">
                          <h4 className="fw-bold fs-5 text-white">Email</h4>
                          <input
                            type="email"
                            value={traveler.email}
                            onChange={(e) =>
                              handleInputChange(index, "email", e.target.value)
                            }
                            className="w-100 p-2 inpttticket"
                          />
                        </div>
                        <div className="col-12 col-md-5">
                          <h4 className="fw-bold fs-5 text-white">
                            Phone Number
                          </h4>
                          <input
                            type="text"
                            value={traveler.number}
                            maxLength={10}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              ); // Keep only numbers
                              handleInputChange(index, "number", value);
                            }}
                            className="w-100 p-2 inpttticket"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="row justify-content-center my-3 my-lg-5">
                    <div className="col-12 d-flex align-items-center justify-content-center gap-2">
                      <label className="custom-checkbox d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          checked={check}
                          onChange={togglecheck}
                          className="d-none"
                        />
                        <span className="checkmark"></span>
                        <span className="fw-bold text-white">
                          I agree with the{" "}
                          <a
                            href="#"
                            className="fw-bold text-white text-decoration-none"
                          >
                            Terms & Conditions
                          </a>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="row px-3 px-lg-0 align-items-center justify-content-center">
                    <div
                      className="col-2 btnn text-center sbmitbtn"
                      onClick={() => {
                        openModal();
                      }}
                    >
                      SUBMIT
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-5 order-1 order-lg-2">
                  <div className="row">
                    <div className="col-12 pricee-tag">
                      <h2 className="fs-4 fs-lg-2">Your Booking Detail</h2>
                    </div>
                  </div>
                  <div className="row border border-top-none">
                    <div className="booking_details_airline_name_heading">
                      <div>
                        {item?.airline_name === "IndiGo Airlines" ? (
                          <>
                            <img
                              src={images.IndiGoAirlines_logo}
                              className="airline_logo"
                            />
                          </>
                        ) : item?.airline_name === "Neos" ? (
                          <>
                            <img
                              src={images.neoslogo}
                              className="airline_logo"
                            />
                          </>
                        ) : item?.airline_name === "SpiceJet" ? (
                          <>
                            <img
                              src={images.spicejetlogo}
                              className="airline_logo"
                            />
                          </>
                        ) : item?.airline_name === "Air India" ? (
                          <>
                            <img
                              src={images.airindialogo}
                              className="airline_logo"
                            />
                          </>
                        ) : item?.airline_name === "Akasa Air" ? (
                          <>
                            <img
                              src={images.akasalogo}
                              className="airline_logo"
                            />
                          </>
                        ) : item?.airline_name === "Etihad" ? (
                          <>
                            <img
                              src={images.etihadlogo}
                              style={
                                item.airline_name === "Etihad"
                                  ? {
                                      backgroundColor: "#fffbdb",
                                      padding: "5px",
                                      borderRadius: "5px",
                                    }
                                  : ""
                              }
                              className="airline_logo"
                            />
                          </>
                        ) : item?.airline_name === "Vistara" ? (
                          <>
                            <img
                              src={images.vistaralogo}
                              className="airline_logo"
                            />
                          </>
                        ) : (
                          <>
                            <IoAirplaneSharp size={40} color="white" />
                          </>
                        )}
                      </div>
                      <div
                        className="text-white"
                        style={{ fontWeight: "600", fontSize: "18px" }}
                      >
                        {item?.airline_name}
                      </div>
                    </div>
                    <div className="col-12 py-3 flight-box">
                      <div className="flight-departure text-center">
                        <h5 className="text-white fs-6 fs-lg-5 fw-bold">
                          {item?.dep_time}
                        </h5>
                        <h5 className="text-white fs-6 fs-lg-5">
                          {item?.dep_airport_code}
                        </h5>
                        <div className="fw-bold fs-lg-5 text-white align-self-center">
                          {moment(item?.onward_date).format("DD-MM-YYYY")}
                        </div>
                      </div>
                      <div className="d-inline-flex column-gap-0 column-gap-lg-3 align-items-center">
                        <span className="d-inline-block text-white">From</span>
                        <div className="text-center">
                          <p className="text-white durationtxt">
                            {item?.duration &&
                              `${item.duration.split(":")[0]}h ${
                                item.duration.split(":")[1]
                              }min`}
                          </p>
                          <img
                            src={images.vimaan}
                            alt=""
                            className="resp_booking_details_flight_img"
                          />
                          <p className="text-white">{item?.no_of_stop} stop</p>
                        </div>
                        <span className="d-inline-block text-white">To</span>
                      </div>
                      <div className="flight-departure text-center">
                        <h5 className="text-white fs-6 fs-lg-5 fw-bold">
                          {item?.arr_time}
                        </h5>
                        <h5 className="text-white fs-6 fs-lg-5">
                          {item?.arr_city_code}
                        </h5>
                        <div className="fw-bold fs-lg-5 text-white align-self-center">
                          {moment(item?.arr_date).format("DD-MM-YYYY")}
                        </div>
                      </div>
                    </div>
                    {item?.return_flight_data ? (
                      <>
                        <div className="flight-box">
                          <div className="col-10 align-self-center bottomlito"></div>
                        </div>
                        <div className="col-12 py-3 flight-box mt-3">
                          <div className="flight-departure text-center">
                            <h5 className="text-white fs-6 fs-lg-5 fw-bold">
                              {item?.return_flight_data?.return_dep_time}
                            </h5>
                            <h5 className="text-white fs-6 fs-lg-5">
                              {item?.return_flight_data?.return_dep_city_code}
                            </h5>
                            <div className="fw-bold fs-lg-5 text-white align-self-center">
                              {moment(
                                item?.return_flight_data?.return_dep_date
                              ).format("DD-MM-YYYY")}
                            </div>
                          </div>
                          <div className="d-inline-flex column-gap-0 column-gap-lg-3 align-items-center">
                            <span className="d-inline-block text-white frmtxt">
                              From
                            </span>
                            <div className="text-center">
                              <p className="text-white durationtxt">
                                {item?.duration &&
                                  `${item.duration.split(":")[0]}h ${
                                    item.duration.split(":")[1]
                                  }min`}
                              </p>
                              <img
                                src={images.vimaan}
                                alt=""
                                className="vimanimg"
                              />
                              <p className="text-white frmtxt">
                                {item?.no_of_stop} stop
                              </p>
                            </div>
                            <span className="d-inline-block text-white frmtxt">
                              To
                            </span>
                          </div>
                          <div className="flight-departure text-center">
                            <h5 className="text-white fs-6 fs-lg-5 fw-bold">
                              {item?.return_flight_data?.return_arr_time}
                            </h5>
                            <h5 className="text-white fs-6 fs-lg-5">
                              {item?.return_flight_data?.return_arr_city_code}
                            </h5>
                            <div className="fw-bold fs-lg-5 text-white align-self-center">
                              {moment(
                                item?.return_flight_data?.return_arr_date
                              ).format("DD-MM-YYYY")}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="row mt-4">
                    <div className="col-12 pricee-tag">
                      <h2 className="fs-4 fs-lg-2">Price Summary</h2>
                    </div>
                    <div className="border">
                      <div className="row mt-3 w-100 ">
                        <div className="col-6 text-start text-white">
                          Base Fare
                        </div>
                        <div className="col-6 text-end text-white">
                          <span>&#8377;</span> {item?.price_breakup.base_fare}
                        </div>
                      </div>
                      <div className="row my-3 w-100 ">
                        <div className="col-6 text-start text-white">
                          Discount
                        </div>
                        <div className="col-6 text-end text-white">
                          <span>&#8377;</span> {item?.price_breakup.discount}
                        </div>
                      </div>
                      <div className="row my-3 w-100 ">
                        <div className="col-6 text-start text-white">
                          Taxes & Others
                        </div>
                        <div className="col-6 text-end text-white">
                          <span>&#8377;</span> {item?.price_breakup.fee_taxes}
                        </div>
                      </div>
                      <div className="row mb-3 w-100 ">
                        <div className="col-6 text-start text-white">
                          Service Fees
                        </div>
                        <div className="col-6 text-end text-white">
                          <span>&#8377;</span>{" "}
                          {item?.price_breakup.service_charge}
                        </div>
                      </div>
                      <div className="bottomlito"></div>
                      <div className="row mb-3 w-100 ">
                        <div className="col-6 text-start fs-4 fw-bolder text-white">
                          Total
                        </div>
                        <div className="col-6 text-end text-white fw-bolder fs-4">
                          <span>&#8377;</span> {item?.total_payable_price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Booking Modal"
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "80vw",
                padding: "0",
                border: "none",
                borderRadius: "10px",
                position: "relative",
                overflowY: "auto",
                height: "620px",
              },
              overlay: {
                zIndex: 10000,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <div className="Confirm_Main">
              <div
                className="w-100 d-flex align-items-center text-center justify-content-center p-3"
                style={{ backgroundColor: "#ddb46b" }}
              >
                <h3 className="text-white fw-bold">Confirm Booking</h3>
              </div>
            </div>

            <div className="p-3 w-100">
              <h4 className="my-2 fw-semibold ">Airline Details</h4>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Airline</th>
                      <th>Departure</th>
                      <th></th>
                      <th>Arrival</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {item?.airline_name === "IndiGo Airlines" ? (
                          <img
                            src={images.IndiGoAirlines_logo}
                            className="airline_logo"
                          />
                        ) : item?.airline_name === "Neos" ? (
                          <img src={images.neoslogo} className="airline_logo" />
                        ) : item?.airline_name === "SpiceJet" ? (
                          <img
                            src={images.spicejetlogo}
                            className="airline_logo"
                          />
                        ) : item?.airline_name === "Air India" ? (
                          <img
                            src={images.airindialogo}
                            className="airline_logo"
                          />
                        ) : item?.airline_name === "Akasa Air" ? (
                          <img
                            src={images.akasalogo}
                            className="airline_logo"
                          />
                        ) : item?.airline_name === "Etihad" ? (
                          <img
                            src={images.etihadlogo}
                            className="airline_logo"
                            style={{
                              backgroundColor: "#fffbdb",
                              padding: "5px",
                              borderRadius: "5px",
                            }}
                          />
                        ) : item?.airline_name === "Vistara" ? (
                          <img
                            src={images.vistaralogo}
                            className="airline_logo"
                          />
                        ) : (
                          <IoAirplaneSharp size={40} color="white" />
                        )}
                        <br /> {item?.airline_name} <br />
                        {item?.flight_number}
                      </td>
                      <td>
                        {item?.dep_city_name}
                        <br />
                        {moment(item?.onward_date).format("DD-MM-YYYY")}
                        <br />
                        {item?.dep_time}
                      </td>
                      <td>
                        {item?.duration &&
                          `${item.duration.split(":")[0]} hrs ${
                            item.duration.split(":")[1]
                          } min`}
                        <br />
                        {item?.stop_data
                          ? `${item?.stop_data.length} Stop`
                          : "Non-stop"}
                      </td>
                      <td>
                        {item?.arr_city_name} <br />
                        {moment(item?.arr_date).format("DD-MM-YYYY")} <br />
                        {item?.arr_time}
                      </td>
                      <td>{`\u20B9 ${item?.total_payable_price}`}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {item?.return_flight_data ? (
              <>
                <div className="p-3 w-100">
                  <h4 className="my-2 fw-semibold ">Return Details</h4>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Airline</th>
                          <th>Departure</th>
                          <th></th>
                          <th>Arrival</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {item.airline_name === "IndiGo Airlines" ? (
                              <img
                                src={images.IndiGoAirlines_logo}
                                className="airline_logo"
                              />
                            ) : item.airline_name === "Neos" ? (
                              <img
                                src={images.neoslogo}
                                className="airline_logo"
                              />
                            ) : item?.airline_name === "SpiceJet" ? (
                              <img
                                src={images.spicejetlogo}
                                className="airline_logo"
                              />
                            ) : item.airline_name === "Air India" ? (
                              <img
                                src={images.airindialogo}
                                className="airline_logo"
                              />
                            ) : item.airline_name === "Akasa Air" ? (
                              <img
                                src={images.akasalogo}
                                className="airline_logo"
                              />
                            ) : item.airline_name === "Etihad" ? (
                              <img
                                src={images.etihadlogo}
                                className="airline_logo"
                                style={{
                                  backgroundColor: "#fffbdb",
                                  padding: "5px",
                                  borderRadius: "5px",
                                }}
                              />
                            ) : item.airline_name === "Vistara" ? (
                              <img
                                src={images.vistaralogo}
                                className="airline_logo"
                              />
                            ) : (
                              <IoAirplaneSharp size={40} color="white" />
                            )}
                            <br /> {item?.airline_name} <br />
                            {item?.return_flight_data?.return_flight_number}
                          </td>
                          <td>
                            {item?.return_flight_data?.return_dep_city_name}
                            <br />
                            {moment(
                              item?.return_flight_data?.return_dep_date
                            ).format("DD-MM-YYYY")}
                            <br />
                            {item?.return_flight_data?.return_dep_time}
                          </td>
                          <td>
                            {`${item?.return_flight_data?.return_trip_duration}h`}

                            <br />
                            {`${item?.return_no_of_stop} Stop`}
                          </td>
                          <td>
                            {item?.return_flight_data?.return_arr_city_name}{" "}
                            <br />
                            {moment(
                              item?.return_flight_data?.return_arr_date
                            ).format("DD-MM-YYYY")}{" "}
                            <br />
                            {item?.return_flight_data?.return_arr_time}
                          </td>
                          <td>{`\u20B9 ${item?.total_payable_price}`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="p-3">
              <h4 className="fw-semibold">Traveler Details</h4>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Gender</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {travelers?.map((traveler, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{traveler.gender?.label}</td>
                          <td>{traveler.fname}</td>
                          <td>{traveler.lname}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between gap-2 p-3">
              <div
                className="clsbtn"
                style={{ backgroundColor: "#ddb46b" }}
                onClick={closeModal}
              >
                Close
              </div>
              <div
                className="confirmbtn"
                style={{ backgroundColor: "#ddb46b" }}
                onClick={() => {
                  handleSubmit();
                  handleSubmit2();
                }}
              >
                Confirm
              </div>
            </div>
          </ReactModal>
        </>
      )}
    </>
  );
};

export default TicketBookingDetails;
