import React, { useEffect, useRef, useState } from "react";
import "./HeroTicketBooking.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { TbArrowsRightLeft } from "react-icons/tb";
import makeAnimated from "react-select/animated";
import { DatePicker } from "antd";
import axios from "axios";
import Notification from "../../Utils/Notification";
import moment from "moment";
import { IoAirplaneSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import images from "../../Constants/images";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import { BsFillLuggageFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { GiStopSign } from "react-icons/gi";

const MonthArray = [
  { id: 0, month: "January" },
  { id: 1, month: "February" },
  { id: 2, month: "March" },
  { id: 3, month: "April" },
  { id: 4, month: "May" },
  { id: 5, month: "June" },
  { id: 6, month: "July" },
  { id: 7, month: "August" },
  { id: 8, month: "September" },
  { id: 9, month: "October" },
  { id: 10, month: "November" },
  { id: 11, month: "December" },
];

const HeroTicketBooking = () => {
  const [selected, setSelected] = useState(0);
  const [selectedClass, setSelectedClass] = useState("Economy");
  const [getDepatureCityList, setDepatureCityList] = useState([]);
  const [getDepatureCityListFilterData, setDepatureCityListFilterData] =
    useState([]);
  const [getArrivalCityList, setArrivalCityList] = useState([]);
  const [getArrivalCityListFilterData, setArrivalCityListFilterData] = useState(
    []
  );
  const [getSectorList, setSectorList] = useState([]);
  const [getOnwardDateList, setOnwardDateList] = useState([]);
  const [getReturnDateList, setReturnDateList] = useState([]);
  const [getSearchFlightList, setSearchFlightList] = useState([]);
  const [searchedfromcity, setSearchedFromcity] = useState("");
  const [bookingtokenid, setbookingtokenid] = useState("");
  const [getSearchFlightListLoading, setSearchFlightListLoading] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueCity, setSelectedValueCity] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue2, setSelectedValue2] = useState("");
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [getDepCityCode, setDepCityCode] = useState("");
  const [getArrCityCode, setArrCityCode] = useState("");
  const [getSearchFlightListMsg, setSearchFlightListMsg] = useState("");
  const [getSeachCondition, setSearchCondition] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isDatePickerOpen1, setIsDatePickerOpen1] = useState(false);
  const [conditionzk1, setConditionzk1] = useState(false);
  const [conditionzk2, setConditionzk2] = useState(false);
  const [conditionzk3, setConditionzk3] = useState(false);
  const [conditionzk4, setConditionzk4] = useState(false);
  const [conditionzk5, setConditionzk5] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItem2, setSelectedItem2] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [defaultMonth, setDefaultMonth] = useState("");
  const [defaultMonth2, setDefaultMonth2] = useState("");
  const [onwardDates, setOnwardDates] = useState([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isViewOpen2, setIsViewOpen2] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filteredDates, setFilteredDates] = useState([]);
  const [travellers, setTravellers] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [isDropdownOpenTraveler, setIsDropdownOpenTravellers] = useState(false);

  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);

  const animatedComponents = makeAnimated();
  const [traveller, setTraveller] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  const toggleView = () => {
    setIsViewOpen(!isViewOpen);
    setIsViewOpen2(false);
  };

  const toggleView2 = () => {
    setIsViewOpen2(!isViewOpen2);
    setIsViewOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target)
      ) {
        setIsDropdownOpen2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCounterChange = (type, change) => {
    setSearchFlightList([]);
    setTravellers((prev) => {
      const newValue = prev[type] + change;

      // Ensure "Adult" value does not go below 1
      if (type === "adult" && newValue < 1) {
        return prev;
      }

      // Prevent other categories (child, infant) from going below 0
      if (newValue < 0) {
        return prev;
      }

      return { ...prev, [type]: newValue };
    });
  };

  const totalTravellers =
    travellers.adult + travellers.child + travellers.infant;

  const toggleDropdownTraveler = () => {
    setIsDropdownOpenTravellers((prev) => !prev);
  };

  // const handleSearch = (e) => {
  //   const term = e.target.value.toLowerCase();
  //   setSearchTerm(term);

  //   const filtered = getDepatureCityList?.filter(
  //     (item) =>
  //       item.city_name.toLowerCase().includes(term) ||
  //       item.airport_name.toLowerCase().includes(term) ||
  //       item.airport_code.toLowerCase().includes(term)
  //   );

  //   setDepatureCityList(filtered);
  // };

  // console.log("getDepatureCityList", getDepatureCityList);

  const handleSearch = (e) => {
    const textData = e.target.value.toUpperCase(); // Get input value
    setSearchTerm(e.target.value); // Update search term state

    const newData = getDepatureCityList.filter((item) => {
      const cityName = item.city_name ? item.city_name.toUpperCase() : "";
      const airportName = item.airport_name
        ? item.airport_name.toUpperCase()
        : "";

      // Check if textData matches cityName or airportName
      return (
        cityName.indexOf(textData) > -1 || airportName.indexOf(textData) > -1
      );
    });

    setDepatureCityListFilterData(newData); // Update the filtered list
  };

  // const handleSearch2 = (e) => {
  //   const term = e.target.value.toLowerCase();
  //   setSearchTerm2(term);

  //   const filtered = getArrivalCityList?.filter(
  //     (item) =>
  //       item.city_name.toLowerCase().includes(term) ||
  //       item.airport_name.toLowerCase().includes(term) ||
  //       item.airport_code.toLowerCase().includes(term)
  //   );

  //   setArrivalCityList(filtered);
  // };

  const handleSearch2 = (e) => {
    const textData = e.target.value.toUpperCase(); // Get input value
    setSearchTerm2(e.target.value); // Update search term state

    const newData = getArrivalCityList.filter((item) => {
      const cityName = item.city_name ? item.city_name.toUpperCase() : "";
      const airportName = item.airport_name
        ? item.airport_name.toUpperCase()
        : "";

      // Check if textData matches cityName or airportName
      return (
        cityName.indexOf(textData) > -1 || airportName.indexOf(textData) > -1
      );
    });

    setArrivalCityListFilterData(newData); // Update the filtered list
  };
  const handleMonthSelect = (itm) => {
    console.log("Selected Month:", itm);
    setSelectedMonth(itm);

    const filtered = getOnwardDateList.filter((date) => {
      const dateObj = new Date(date.onward_date);
      return dateObj.getMonth() === itm.id;
    });

    setFilteredDates(filtered);
    if (filtered.length > 0) {
      const firstDate = new Date(filtered[0].onward_date);
      setDefaultMonth(moment(firstDate).format("YYYY-MM-DD")); // Ensure this is a dayjs object
    } else {
      setDefaultMonth(null); // Handle cases with no filtered dates
    }
    setConditionzk3(true);
  };

  const handleSelect = (item) => {
    setSelectedValue(`${item.city_name} (${item.airport_code})`);
    setSearchTerm("");
    ArrivalCityList(item.city_code);
    SectorList(item.city_code);
    setDepCityCode(item.city_code);
    setIsDropdownOpen(false);
    // setIsDropdownOpen2(true);
    setConditionzk1(true);
    setSearchFlightList([]);
    setSelectedItem(null);
    setDefaultMonth("");
    setDefaultMonth2("");
  };

  const handleSelect2 = (item) => {
    setSelectedItem(item);
    setSelectedValue2(`${item.city_name} (${item.airport_code})`);
    setSearchTerm2(""); // Clear the search term after selection
    ArrivalCityList(getDepCityCode);
    setArrCityCode(item.city_code);
    getOnwardDate(item.city_code);
    setIsDropdownOpen2(false);
    setSelectedMonth(null);
    setConditionzk2(true);
  };

  const onChange = (date, dateString) => {
    setDefaultMonth(date);
    setDate1(dateString);
    setIsDatePickerOpen1(!isDatePickerOpen1);
    if (selected == 1) {
      getReturnDate(dateString, 1, getArrCityCode);
    }
    setConditionzk4(true);
  };

  const onChange2 = (date, dateString) => {
    setDate2(dateString);
    // console.log("onchange2222", dateString);
    setIsDropdownOpenTravellers(true);
    setConditionzk5(true);
  };

  const disableAllExceptApiDates = (currentDate) => {
    const filteredDateStrings = filteredDates.map(
      (date) => new Date(date.onward_date).toISOString().split("T")[0]
    );

    return !filteredDateStrings.includes(currentDate.format("YYYY-MM-DD"));
  };

  const disableDates = (current) => {
    const returndate = getReturnDateList.map(
      (date) => new Date(date.return_date).toISOString().split("T")[0]
    );

    return !returndate.includes(current.format("YYYY-MM-DD"));
  };

  const firstEnabledDate = dayjs(
    getReturnDateList[0]?.return_date || dayjs().format("YYYY-MM-DD")
  );

  const disableAllExceptApiMonths = (current) => {
    if (!current) return false;
    const formattedMonth = current.format("YYYY-MM");
    return !availableMonths.includes(formattedMonth);
  };

  useEffect(() => {
    DepatureCityList(selected);
  }, []);

  const getPublicIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (error) {
      console.error("Error fetching public IP:", error);
      return null;
    }
  };

  const DepatureCityList = async (selected) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/dep_city";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add any other headers required
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response from API:", data.data);
        setDepatureCityList(data.data);
      } else {
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
    }
  };
  const ArrivalCityList = async (citycode) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();
    setLoading(true);

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/arr_city";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
      city_code: citycode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        setArrivalCityList(data.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      setLoading(false);
    }
  };

  const SectorList = async (citycode) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    // const token = "txKRIiZgpx987NgopMqvzvFhpIPJ5NSQBAUWMewysH2Pa";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/sector";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
      city_code: citycode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response from API:", data);
        setSectorList(data.data);
      } else {
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
    }
  };

  const getOnwardDate = async (citycode) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/onward_date";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
      dep_city_code: getDepCityCode,
      arr_city_code: citycode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.replyCode === "success") {
        setOnwardDateList(data.data);
        const months = [
          ...new Set(
            data.data.map((item) => moment(item.onward_date).format("YYYY-MM"))
          ),
        ];

        const defaultmonth = moment(data.data[0].onward_date, "YYYY-MM-DD");
        getReturnDate(defaultmonth._i, 2, citycode);
        setDefaultMonth(defaultmonth);
        setAvailableMonths(months);
      } else {
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
    }
  };

  const getReturnDate = async (citycode, code, arrCityCode) => {
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    console.log("getArrCityCode", getArrCityCode);

    console.log("citycode", citycode);
    console.log("code", code);

    const formateddate = moment(citycode, "DD-MM-YYYY").format("YYYY-MM-DD");

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/return_date";
    const payload = {
      trip_type: selected,
      end_user_ip: publicIP,
      token: token,
      dep_city_code: getDepCityCode,
      onward_date: code == 2 ? citycode : formateddate,
      arr_city_code: arrCityCode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.replyCode === "success") {
        setReturnDateList(data.data);
        const defaultmonth = moment(data.data[0].return_date, "YYYY-MM-DD");
        setDefaultMonth2(defaultmonth);
      } else {
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
    }
  };

  const searchFlight = async () => {
    const formattedDate = moment(date1, "DD-MM-YYYY").format("YYYY-MM-DD");

    console.log("date2", defaultMonth2);

    const formateddate = moment(date2, "DD-MM-YYYY").format("YYYY-MM-DD");

    setSearchCondition(false);
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    } else if (selectedValue === "") {
      alert("Please Select From City");
    } else if (selectedValue2 === "") {
      alert("Please Select To City");
    }
    // else if (date1 === "") {
    //   alert("Please Select Departure Date");
    // }
    else if (selected == 1 && defaultMonth2 === "") {
      alert("Please Select Return Date");
    } else if (selected == 1 && defaultMonth2._i === "") {
      alert("Please Select Return Date");
    } else {
      setIsDropdownOpenTravellers(false);
      setSearchFlightListLoading(true);
      const url = "https://devapi.fareboutique.com/v1/fbapi/search";
      const payload = {
        trip_type: selected,
        end_user_ip: "183.83.43.117",
        token: token,
        dep_city_code: getDepCityCode,
        arr_city_code: getArrCityCode,
        onward_date:
          formattedDate == "Invalid date" ? defaultMonth : formattedDate,
        return_date:
          formateddate == "Invalid date" ? defaultMonth2?._i : formateddate,
        adult: travellers?.adult,
        children: travellers?.child,
        infant: travellers?.infant,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        // Parse the JSON response
        const data = await response.json();

        if (data.errorCode == 0) {
          console.log("Response Search Data from API:", data.data);
          setSearchFlightList(data.data);
          setbookingtokenid(data.booking_token_id);
          // setSearchedFromcity(data.data[0].dep_city_name);
          setSearchFlightListLoading(false);
          // fareQuote();
          // Notification("success", "Success!", data.message);
        } else if (data.errorCode == 1) {
          setSearchCondition(true);
          setSearchFlightList([]);
          setSearchFlightListMsg(data.errorMessage);
          setSearchFlightListLoading(false);
        } else {
          // Notification(
          //   "error",
          //   "Error!",
          //   data.message || "Something went wrong"
          // );
        }
      } catch (error) {
        setSearchFlightListLoading(false);
        console.error("Error while fetching departure city list:", error);
        // Notification("error", "Error!", "Failed to fetch data");
      }
    }
  };

  const fareQuote = async () => {
    const formattedDate = moment(date1, "DD-MM-YYYY").format("YYYY-MM-DD");

    const formattedDate2 = date2 ? moment(date2).format("YYYY-MM-DD") : "";
    const token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    const publicIP = await getPublicIP();

    if (!publicIP) {
      console.error("Unable to fetch public IP. Request cannot be completed.");
      return;
    }

    const url = "https://devapi.fareboutique.com/v1/fbapi/fare_quote";
    const payload = {
      id: 415,
      end_user_ip: "183.83.43.117",
      token: token,
      onward_date: formattedDate,
      adult_children: travellers?.adult + travellers.child,
      infant: travellers?.infant,
      static: "0--21--354",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Parse the JSON response
      const data = await response.json();

      if (data.replyCode === "success") {
        console.log("Response Return Dates from API:", data);
        // setSearchFlightList(data.data);
        // Notification("success", "Success!", data.message);
      } else {
        // Notification("error", "Error!", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while fetching departure city list:", error);
      // Notification("error", "Error!", "Failed to fetch data");
    }
  };

  return (
    <div className="container contt" id="#bookingcont">
      <div className="row align-items-center radiobtnsec">
        <div className="d-flex align-items-center gap-3">
          <input
            type="radio"
            className="rdbtn"
            name="trip"
            id="oneWay"
            checked={selected == 0}
            onChange={() => {
              setSelected(0);
              setSelectedValue("");
              setSelectedValue2("");
              setConditionzk1(false);
              setConditionzk2(false);
              setConditionzk3(false);
              setConditionzk4(false);
              setSearchFlightList([]);
              setSelectedItem(null);
              setDefaultMonth(null);
              setDefaultMonth2(null);
              setDate1(null);
              setDate2(null);
              DepatureCityList(0);
            }}
          />
          <label htmlFor="oneWay">
            <h4>ONE WAY</h4>
          </label>

          <input
            type="radio"
            className="rdbtn"
            name="trip"
            id="roundTrip"
            checked={selected === 1}
            onChange={() => {
              setSelected(1);
              setSelectedItem2("ok");
              setSelectedValue("");
              setSelectedValue2("");
              setConditionzk1(false);
              setConditionzk2(false);
              setConditionzk3(false);
              setConditionzk4(false);
              setSearchFlightList([]);
              setSelectedItem(null);
              setDefaultMonth(null);
              setDefaultMonth2(null);
              setDate1(null);
              setDate2(null);
              DepatureCityList(1);
            }}
          />
          <label htmlFor="roundTrip">
            <h4>ROUND TRIP</h4>
          </label>
        </div>

        <div className="classcat d-md-flex justify-content-center p-md-3 gap-md-5">
          <div
            className={`classnm ${
              selectedClass === "Economy" ? "selected" : ""
            }`}
            onClick={() => setSelectedClass("Economy")}
          >
            Economy
          </div>
          <div
            className={`classnm ${
              selectedClass === "Business Class" ? "selected" : ""
            }`}
            onClick={() => setSelectedClass("Business Class")}
          >
            Business Class
          </div>
          <div
            className={`classnm ${
              selectedClass === "First Class" ? "selected" : ""
            }`}
            onClick={() => setSelectedClass("First Class")}
          >
            First Class
          </div>
        </div>

        <div className="dateselectdiv">
          <div className="row my-3"></div>
          <div className="row align-items-center gap-2 gap-lg-0  p-2 p-md-3">
            <div className="col-12">
              <div className="row justify-content-center align-items-center pb-2 p-md-0">
                <div className="col-12 gap-2 ">
                  <div className="fromtxt text-center mb-2">
                    Please Choose / Select your Origin
                  </div>
                  <div className="dropdown-container" ref={dropdownRef}>
                    {/* Input to display the selected value */}
                    <input
                      type="text"
                      placeholder="Select airport..."
                      value={selectedValue}
                      onClick={toggleDropdown}
                      readOnly
                      className="dropdown-input"
                    />

                    {isDropdownOpen && (
                      <div className="dropdown-list">
                        <input
                          type="text"
                          placeholder="Search airport..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e)}
                          className="dropdown-search-input"
                        />

                        {searchTerm ? (
                          <>
                            {getDepatureCityListFilterData?.length > 0 ? (
                              getDepatureCityListFilterData?.map(
                                (item, index) => (
                                  <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleSelect(item)}
                                  >
                                    <div className="city-name">
                                      {item.city_name}
                                    </div>
                                    <div className="airport-details">
                                      {item.airport_name}{" "}
                                      <span className="airport-code">
                                        ({item.airport_code})
                                      </span>
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="dropdown-no-results">
                                No results found
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {getDepatureCityList?.length > 0 ? (
                              getDepatureCityList?.map((item, index) => (
                                <div
                                  key={index}
                                  className="dropdown-item"
                                  onClick={() => handleSelect(item)}
                                >
                                  <div className="city-name">
                                    {item.city_name}
                                  </div>
                                  <div className="airport-details">
                                    {item.airport_name}{" "}
                                    <span className="airport-code">
                                      ({item.airport_code})
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="dropdown-no-results">
                                No results found
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {conditionzk1 == true ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} // Starting state
                    animate={{ opacity: 1, y: 0 }} // Ending state
                    exit={{ opacity: 0, y: -10 }} // State when removed
                    transition={{ duration: 1.5 }} // Animation duration
                    className="row align-items-center justify-content-center my-4 gap-3 flex-column"
                  >
                    <div className="col-md-2 d-flex justify-content-center  p-3 p-md-0 align-self-center">
                      <TbArrowsRightLeft size={30} color="#fff" />
                    </div>
                    <div className="col-12  gap-2">
                      <div className="fromtxt text-center mb-2">
                        This are the destination in which we're currently serve
                      </div>

                      <div className="row">
                        <div className="d-flex flex-column flex-md-row col-12 w-100 justify-content-center gap-3">
                          {getArrivalCityList?.length > 0 ? (
                            getArrivalCityList?.map((item, index) => (
                              <motion.div
                                initial={{ x: "100%", opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: "100%", opacity: 0 }}
                                transition={{
                                  duration: 0.5,
                                  ease: "easeInOut",
                                }}
                                key={index}
                                className={`dropdown-item1 ${
                                  selectedItem?.city_code === item.city_code
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => handleSelect2(item)}
                              >
                                <div className="city-name">
                                  {item.city_name}
                                </div>
                                <div className="airport-details">
                                  {item.airport_name}{" "}
                                  <span className="airport-code">
                                    ({item.airport_code})
                                  </span>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="dropdown-no-results">
                              No results found
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="col-12 mt-3">
              <div
                className={`row align-items-center  gap-3 gap-md-0 ${
                  selected == 1
                    ? "justify-content-between"
                    : "justify-content-center"
                } `}
              >
                {selectedItem ? (
                  <>
                    <motion.div
                      initial={{ x: "-100%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "-100%", opacity: 0 }}
                      transition={{
                        duration: 1.0,
                        ease: "easeInOut",
                      }}
                      className="col-12 d-flex flex-column gap-2"
                    >
                      <div className="departtxt text-center">Select Month</div>
                      <div className="text-center mt-0 text-secondary">
                        * You can see available months only{" "}
                      </div>
                      <div className="row justify-content-center align-items-center gap-2">
                        {MonthArray.map((itm, indx) => {
                          const isAvailable = availableMonths.some((month) => {
                            const monthName = moment(month, "YYYY-MM").format(
                              "MMMM"
                            );

                            return monthName === itm.month;
                          });

                          return (
                            <div
                              className={`col-3 text-center monthnm monthDiv ${
                                selectedMonth?.month === itm.month
                                  ? "selected"
                                  : ""
                              } ${isAvailable ? "available" : "unavailable"}`}
                              key={indx}
                              onClick={() => {
                                if (isAvailable) handleMonthSelect(itm);
                              }}
                            >
                              {itm.month}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <></>
                )}

                {conditionzk3 == true &&
                selectedItem !== null &&
                selectedMonth !== null ? (
                  <>
                    <motion.div
                      initial={{ x: "-100%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "-100%", opacity: 0 }}
                      transition={{
                        duration: 1.0,
                        ease: "easeInOut",
                      }}
                      className="col-12 mt-3 col-md-4 d-flex flex-column gap-2"
                    >
                      <div className="departtxt text-center">
                        Select Departure Date
                      </div>
                      <div className="custom-date-picker">
                        <DatePicker
                          onChange={onChange}
                          inputReadOnly={true}
                          format="DD-MM-YYYY"
                          disabledDate={disableAllExceptApiDates}
                          placeholder="Select Date"
                          value={selectedMonth ? dayjs(defaultMonth) : null}
                        />
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <></>
                )}

                {selected == 1 &&
                defaultMonth !== null &&
                selectedItem !== null &&
                selectedMonth !== null &&
                conditionzk3 == true ? (
                  <>
                    <div className="col-md-4 mt-3 d-flex flex-column gap-2">
                      <div className="departtxt text-center">
                        Select Return Date
                      </div>
                      <div
                        className={`${
                          selected === 0
                            ? "disabledatepicker"
                            : "custom-date-picker"
                        }`}
                      >
                        <DatePicker
                          onChange={onChange2}
                          format="DD-MM-YYYY"
                          inputReadOnly={true}
                          placeholder="Select Date"
                          disabledDate={disableDates}
                          // defaultPickerValue={firstEnabledDate}
                          value={defaultMonth2 ? dayjs(defaultMonth2) : ""}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {selectedItem !== null && selectedMonth !== null ? (
                  <>
                    <motion.div
                      initial={{ x: "100%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "-100%", opacity: 0 }}
                      transition={{
                        duration: 1.0,
                        ease: "easeInOut",
                      }}
                      className="col-md-4 mt-3 d-flex flex-column gap-2 mb-3 mb-md-0"
                    >
                      <div className="departtxt text-center">Travelers</div>
                      <div className="travellers-container">
                        <div
                          className="travellers-summary"
                          onClick={toggleDropdownTraveler}
                        >
                          <p>{totalTravellers} Travellers</p>
                        </div>

                        {isDropdownOpenTraveler && (
                          <div className="travellers-dropdown">
                            <div className="traveller-category">
                              <span>Adult 12+Yrs</span>
                              <div className="counter">
                                <button
                                  className="minus"
                                  onClick={() =>
                                    handleCounterChange("adult", -1)
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="text"
                                  value={travellers.adult}
                                  readOnly
                                />
                                <button
                                  className="plus"
                                  onClick={() =>
                                    handleCounterChange("adult", 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="traveller-category">
                              <span>Child 2-12 Yrs</span>
                              <div className="counter">
                                <button
                                  className="minus"
                                  onClick={() =>
                                    handleCounterChange("child", -1)
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="text"
                                  value={travellers.child}
                                  readOnly
                                />
                                <button
                                  className="plus"
                                  onClick={() =>
                                    handleCounterChange("child", 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="traveller-category">
                              <span>Infant 0-2 Yrs</span>
                              <div className="counter">
                                <button
                                  className="minus"
                                  onClick={() =>
                                    handleCounterChange("infant", -1)
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="text"
                                  value={travellers.infant}
                                  readOnly
                                />
                                <button
                                  className="plus"
                                  onClick={() =>
                                    handleCounterChange("infant", 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <button
                              className="apply-button"
                              onClick={toggleDropdownTraveler}
                            >
                              APPLY
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {conditionzk2 == true ? (
              <>
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 1.0,
                    ease: "easeInOut",
                  }}
                  className="btnn w-25 h-100 align-self-center d-flex align-item-center justify-content-center"
                  onClick={() => searchFlight()}
                >
                  Search
                </motion.button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {getSearchFlightListLoading === true ? (
          <>
            <div
              style={{
                width: "100%",
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
            {getSearchFlightList.length > 0 ? (
              <>
                <div className="flightcounter">
                  <h5>
                    We have <span>{getSearchFlightList.length} Flight</span>{" "}
                    from <span>{getSearchFlightList[0].dep_city_name}</span> to{" "}
                    {""}
                    <span>{getSearchFlightList[0].arr_city_name}</span>{" "}
                    {totalTravellers} Traveller
                  </h5>
                </div>
              </>
            ) : (
              <></>
            )}

            {getSeachCondition === true ? (
              <>
                <p className="no_flight_search_line">Flights Not Available.</p>
              </>
            ) : (
              <>
                {getSearchFlightList.map((item, index) => {
                  return (
                    <>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          duration: 1.0,
                          ease: "backInOut",
                        }}
                        className="flightsavailable shadow"
                      >
                        <div className="row align-items-center">
                          <div className="col-12 col-lg-9 justify-content-space-between">
                            <div className="align-items-center justify-content-around d-flex flex-column gap-5 gap-lg-0 flex-lg-row p-3">
                              <div className="airlinename col-12 col-lg-3">
                                <div>
                                  {item.airline_name === "IndiGo Airlines" ? (
                                    <>
                                      <img
                                        src={images.IndiGoAirlines_logo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "Neos" ? (
                                    <>
                                      <img
                                        src={images.neoslogo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "SpiceJet" ? (
                                    <>
                                      <img
                                        src={images.spicejetlogo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "Air India" ? (
                                    <>
                                      <img
                                        src={images.airindialogo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "Akasa Air" ? (
                                    <>
                                      <img
                                        src={images.akasalogo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : item.airline_name === "Etihad" ? (
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
                                  ) : item.airline_name === "Vistara" ? (
                                    <>
                                      <img
                                        src={images.vistaralogo}
                                        className="airline_logo"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <IoAirplaneSharp
                                        size={40}
                                        color="white"
                                      />
                                    </>
                                  )}
                                </div>
                                <div className="planecomp">
                                  {item?.airline_name}
                                </div>
                                <div className="flightnum">
                                  {item?.flight_number}
                                </div>
                              </div>
                              <div className="flight-details col-12 col-lg-6 justify-content-center">
                                <div className="flight-departure text-center">
                                  <h5 className="flighttime">
                                    {item?.dep_time}
                                  </h5>
                                  <h5 className="airportname">
                                    {item?.dep_city_name}
                                  </h5>
                                  <p className="alldate text-white">
                                    {moment(item?.onward_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </p>
                                </div>
                                <div className="d-flex align-items-center gap-2 gap-lg-3">
                                  <span className="text-white">To</span>
                                  <div className="from-to text-center">
                                    <h6 className="text-white">
                                      {item?.duration &&
                                        `${item.duration.split(":")[0]}h ${
                                          item.duration.split(":")[1]
                                        }min`}
                                    </h6>
                                    <img
                                      src={images.vimaan}
                                      alt=""
                                      className="imagerouteplane"
                                    />
                                    <h6 className="text-white">
                                      {item?.no_of_stop} Stop
                                    </h6>
                                  </div>
                                  <span className="text-white">From</span>
                                </div>
                                <div className="flight-departure text-center">
                                  <h5 className="flighttime">
                                    {item?.arr_time}
                                  </h5>
                                  <h5 className="airportname">
                                    {item?.arr_city_name}
                                  </h5>
                                  <p className="alldate">
                                    {moment(item?.arr_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {item?.return_flight_data ? (
                              <>
                                <div className="align-items-center justify-content-around d-flex flex-column gap-5 gap-lg-0 flex-lg-row p-3">
                                  <div className="airlinename col-12 col-lg-3">
                                    <div>
                                      {item.airline_name ===
                                      "IndiGo Airlines" ? (
                                        <>
                                          <img
                                            src={images.IndiGoAirlines_logo}
                                            className="airline_logo"
                                          />
                                        </>
                                      ) : item.airline_name === "Neos" ? (
                                        <>
                                          <img
                                            src={images.neoslogo}
                                            className="airline_logo"
                                          />
                                        </>
                                      ) : item.airline_name === "SpiceJet" ? (
                                        <>
                                          <img
                                            src={images.spicejetlogo}
                                            className="airline_logo"
                                          />
                                        </>
                                      ) : item.airline_name === "Air India" ? (
                                        <>
                                          <img
                                            src={images.airindialogo}
                                            className="airline_logo"
                                          />
                                        </>
                                      ) : item.airline_name === "Akasa Air" ? (
                                        <>
                                          <img
                                            src={images.akasalogo}
                                            className="airline_logo"
                                          />
                                        </>
                                      ) : item.airline_name === "Etihad" ? (
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
                                      ) : item.airline_name === "Vistara" ? (
                                        <>
                                          <img
                                            src={images.vistaralogo}
                                            className="airline_logo"
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <IoAirplaneSharp
                                            size={40}
                                            color="white"
                                          />
                                        </>
                                      )}
                                    </div>
                                    <div className="planecomp">
                                      {item?.airline_name}
                                    </div>
                                    <div className="flightnum">
                                      {
                                        item?.return_flight_data
                                          ?.return_flight_number
                                      }
                                    </div>
                                  </div>
                                  <div className="flight-details col-12 col-lg-6 justify-content-center">
                                    <div className="flight-departure text-center">
                                      <h5 className="flighttime">
                                        {
                                          item?.return_flight_data
                                            ?.return_dep_time
                                        }
                                      </h5>
                                      <h5 className="airportname">
                                        {
                                          item?.return_flight_data
                                            ?.return_dep_city_name
                                        }
                                      </h5>
                                      <p className="alldate">
                                        {moment(
                                          item?.return_flight_data
                                            ?.return_dep_date
                                        ).format("DD-MM-YYYY")}
                                      </p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                                      <span className="text-white">To</span>
                                      <div className="from-to text-center">
                                        <h6 className="text-white">
                                          {`${item?.return_flight_data?.return_trip_duration}h`}
                                        </h6>
                                        <img
                                          src={images.vimaan}
                                          alt=""
                                          className="imagerouteplane"
                                        />
                                        <h6 className="text-white">
                                          {item?.return_no_of_stop} Stop
                                        </h6>
                                      </div>
                                      <span className="text-white">From</span>
                                    </div>
                                    <div className="flight-departure text-center">
                                      <h5 className="flighttime">
                                        {
                                          item?.return_flight_data
                                            ?.return_arr_time
                                        }
                                      </h5>
                                      <h5 className="airportname">
                                        {
                                          item?.return_flight_data
                                            ?.return_arr_city_name
                                        }
                                      </h5>
                                      <p className="alldate">
                                        {moment(
                                          item?.return_flight_data
                                            ?.return_arr_date
                                        ).format("DD-MM-YYYY")}
                                      </p>
                                    </div>
                                  </div>

                                  {/* <div className="nanolito"></div> */}
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="col-12 col-lg-3">
                            <div className="pricediv col-lg-3 mb-3 mb-lg-0">
                              <div className="d-flex align-items-center">
                                <FaRupeeSign size={20} color="#fff" />
                                <h4 className="text-white fw-bold dijit">
                                  {item?.total_payable_price}
                                </h4>
                              </div>
                              <div className="text-white">
                                Total Fare for {totalTravellers}
                              </div>
                              <Link
                                to={"/TicketBookingDetails"}
                                state={{
                                  item: item,
                                  totaltraveller: totalTravellers,
                                  adulttraveler: travellers.adult,
                                  childtraveler: travellers.child,
                                  infanttraveler: travellers.infant,
                                  bookingtokenid: bookingtokenid,
                                }}
                                className="bookBtn "
                              >
                                Book
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <div className="flightcounter">
                        <div className="row align-items-center justify-content-center">
                          <div className="row row-gap-4 p-0 align-items-center justify-content-center col-revv">
                            <div
                              className="col-md-6 col-lg-3 d-flex align-items-center justify-content-lg-center gap-2 weightdiv"
                              onClick={toggleView}
                            >
                              <div>
                                <BsFillLuggageFill size={20} color="" />
                              </div>
                              <div className="d-flex flex-column">
                                <div className="kilogram">
                                  {item?.check_in_baggage_adult} KG
                                </div>
                                <div className="text-secondary">see more</div>
                              </div>
                            </div>
                            <div
                              className="col-md-6 col-lg-3 d-flex align-items-centers justify-content-lg-center gap-2 weightdiv"
                              onClick={toggleView2}
                            >
                              <div>
                                <GiStopSign size={20} color="" />
                              </div>
                              <div className="kilogram">Stop Details</div>
                            </div>
                            <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2 justify-content-lg-center">
                              <div className="fw-bold fs-5">
                                <div>Refund:</div>
                              </div>
                              <div className="fs-6 lh-1">
                                {
                                  item?.FareClasses[0]?.Class_Desc?.split(
                                    "("
                                  )[0]
                                }
                                <br />
                                {item?.FareClasses[0]?.Class_Desc?.includes(
                                  "("
                                ) && (
                                  <span>{`(${
                                    item?.FareClasses[0]?.Class_Desc?.split(
                                      "("
                                    )[1]
                                  }`}</span>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2 justify-content-lg-start">
                              <div>
                                <MdOutlineAirlineSeatReclineExtra size={20} />
                              </div>
                              <div className="fw-bold fs-6 lh-1">
                                Available Seats :
                              </div>
                              <div className="fw-bold fs-5">
                                {item?.available_seats}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`transition-view ${
                              isViewOpen ? "show" : "hide"
                            }`}
                          >
                            <div className="row align-items-start mt-3">
                              <div className="col-12 ">
                                <div className="col-12">
                                  <p className="fw-bold">Baggage Details</p>
                                </div>
                                <div className="table-responsive">
                                  <table className="table table-bordered text-center">
                                    <thead>
                                      <tr>
                                        <th></th>
                                        <th>
                                          <div className="fw-bold">Adult</div>
                                          <div className="text-secondary">
                                            Age 12+ yrs
                                          </div>
                                        </th>
                                        <th>
                                          <div className="fw-bold">
                                            Children
                                          </div>
                                          <div className="text-secondary">
                                            Age 2-12 yrs
                                          </div>
                                        </th>
                                        <th>
                                          <div className="fw-bold">Infant</div>
                                          <div className="text-secondary">
                                            Age 2 yrs
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <th className="fw-bold">Check-In</th>
                                        <td>{`${item?.check_in_baggage_adult} KG`}</td>
                                        <td>{`${item?.check_in_baggage_children} KG`}</td>
                                        <td>{`${item?.check_in_baggage_infant} KG`}</td>
                                      </tr>
                                      <tr>
                                        <th className="fw-bold">Cabin</th>
                                        <td>{`${item?.cabin_baggage_adult} KG`}</td>
                                        <td>{`${item?.cabin_baggage_children} KG`}</td>
                                        <td>{`${item?.cabin_baggage_infant} KG`}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`transition-view ${
                              isViewOpen2 ? "show" : "hide"
                            }`}
                          >
                            <div className="col-12 mt-3">
                              <div className="col-12">
                                <p className="fw-bold">Stop Details</p>
                              </div>
                              <div className="table-responsive">
                                <table className="table table-bordered text-center">
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>
                                        <div className="fw-bold">City</div>
                                      </th>
                                      <th>
                                        <div className="fw-bold">Arrival</div>
                                      </th>
                                      <th>
                                        <div className="fw-bold">
                                          Layover Duration
                                        </div>
                                      </th>
                                      <th>
                                        <div className="fw-bold">Departure</div>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <th className="fw-bold">Going</th>
                                      {item?.stop_data.length > 0 ? (
                                        <>
                                          <td>
                                            {item?.stop_data[0]?.city_name}
                                          </td>
                                          <td>
                                            {item?.stop_data[0]?.arrival_time}
                                          </td>
                                          <td>
                                            {item?.stop_data[0]
                                              ?.stop_duration &&
                                              (() => {
                                                const [hours, minutes] =
                                                  item.stop_data[0].stop_duration.split(
                                                    ":"
                                                  );
                                                return `${hours} h ${minutes} min`;
                                              })()}
                                          </td>

                                          <td>
                                            {`${item?.stop_data[0]?.departure_time}`}
                                          </td>
                                        </>
                                      ) : (
                                        <>
                                          <td colSpan={4}> Non-Stop </td>
                                        </>
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HeroTicketBooking;
