import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";
import { RiMenu3Fill, RiCloseFill } from "react-icons/ri";
import { IoCloseCircle, IoLogOut } from "react-icons/io5";
import ReactModal from "react-modal";
import { FaEye, FaUser, FaUserCircle } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useAuthContext } from "../../Context/auth_context";
import { useDropzone } from "react-dropzone";
import Notification from "../../Utils/Notification";
import { FaUserPlus } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { ACCEPT_HEADER, get_state } from "../../Utils/Constant";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px",
    backgroundColor: "none",
    border: "none",
    borderRadius: "10px",
  },
  overlay: {
    zIndex: 10000,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
};
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);

  const [getemail, setEmail] = useState("");
  const [getpassword, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showsignupconfirmPassword, setShowsignupConfirmPassword] =
    useState(false);
  const [showsignupPassword, setShowsignupPassword] = useState(false);

  const [agentshowPassword, setAgentShowPassword] = useState(false);
  const [agentshowconfirmPassword, setAgentShowConfirmPassword] =
    useState(false);

  const [login, SetLogin] = useState("");

  const [userRole, setUserRole] = useState("customer");
  const [customernames, setCustomernames] = useState("");
  const [customeremail, setCustomeremail] = useState("");
  const [customerpassword, setCustomerpassword] = useState("");
  const [customerconfirmpassword, setCustomerconfirmpassword] = useState("");
  const [customermobile, setCustomermobile] = useState("");
  const [customerairportcode, setCustomerairportcode] = useState("");

  const [agentnames, setAgentnames] = useState("");
  const [agentemail, setAgentemail] = useState("");
  const [agentpassword, setAgentpassword] = useState("");
  const [agentconfirmpassword, setAgentconfirmpassword] = useState("");
  const [agentmobile, setAgentmobile] = useState("");
  const [agentairportcode, setAgentairportcode] = useState("");
  const [agentcompanyname, setAgentcompanyname] = useState("");
  const [agentcompanyaddress, setAgentcompanyaddress] = useState("");
  const [agentstate, setAgentstate] = useState("");
  const [agentcity, setAgentcity] = useState("");
  const [agentpincode, setAgentpincode] = useState("");
  const [agentgst, setAgentgst] = useState("");
  const [agentpan, setAgentpan] = useState("");
  const [agentaadhar, setAgentaadhar] = useState("");
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [agentpanImage, setAgentpanImage] = useState(null);
  const [getStateArray, SetState_Array] = useState([]);

  const [forgotemail, setForgotEmail] = useState("");
  const [condition, setCondition] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmnewPassword, setConfirmNewPassword] = useState("");

  const onDropAadharFront = (acceptedFiles) => {
    setAadharFront(acceptedFiles[0]);
  };

  const onDropAadharBack = (acceptedFiles) => {
    setAadharBack(acceptedFiles[0]);
  };

  const onDropPanImage = (acceptedFiles) => {
    setAgentpanImage(acceptedFiles[0]);
  };
  const {
    getRootProps: getRootPropsAadharFront,
    getInputProps: getInputPropsAadharFront,
  } = useDropzone({
    onDrop: onDropAadharFront,
    accept: "image/*",
    maxFiles: 1,
  });

  const {
    getRootProps: getRootPropsAadharBack,
    getInputProps: getInputPropsAadharBack,
  } = useDropzone({
    onDrop: onDropAadharBack,
    accept: "image/*",
    maxFiles: 1,
  });

  const {
    getRootProps: getRootPropsPanImage,
    getInputProps: getInputPropsPanImage,
  } = useDropzone({
    onDrop: onDropPanImage,
    accept: "image/*",
    maxFiles: 1,
  });

  const regEx =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const {
    setLogin,
    is_login,
    RegisterCustomer,
    forgotPassword,
    forgotPasswordOtp,
    login_loading,
    register_customer_loading,
    forgot_password_loading,
    forgot_password_otp_loading,
  } = useAuthContext();

  let navigate = useNavigate();

  useEffect(() => {
    var islogin = localStorage.getItem("is_login");
    SetLogin(islogin);
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/");
    window.location.reload(false);
  }

  const modalopen2 = () => {
    setIsModalOpen2(true);
  };

  const modalopen3 = () => {
    setIsModalOpen3(true);
  };

  // Login api

  const Login = async (e) => {
    if (getemail === "") {
      alert("Enter the Email......!");
      return;
    } else if (regEx.test(getemail) === false) {
      alert("Enter the valid Email....!");
      return;
    } else if (getpassword === "") {
      alert("Enter the getpassword....!");
    } else {
      // var params = {
      //   email: getemail,
      //   password: getpassword,
      // };

      const formdata = new FormData();
      formdata.append("email", getemail);
      formdata.append("password", getpassword);

      //
      const data = await setLogin(formdata);
      if (data) {
        console.log("data", data);

        if (data.success == 1) {
          setIsModalOpen(false);
          setEmail("");
          setPassword("");
          window.location.reload(false);
          // navigate("/profile-page");
        }
      }
    }
  };

  // Signup api

  const Signin = async (type) => {
    const errors = [];
    const minLength = 8;
    const hasNumber = /[0-9]/.test(getpassword);
    const hasUpperCase = /[A-Z]/.test(getpassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(getpassword);

    if (customernames === "") {
      alert("Enter the Name......!");
    } else if (customermobile === "") {
      alert("Enter the Mobile No......!");
    } else if (customeremail === "") {
      alert("Enter the Email......!");
      return;
    } else if (regEx.test(customeremail) === false) {
      alert("Enter the valid Email....!");
      return;
    } else if (customerpassword === "") {
      alert("Enter the Password......!");
      return;
    } else if (customerconfirmpassword === "") {
      alert("Enter the Confirm Password....!");
      return;
    } else if (customerconfirmpassword !== customerconfirmpassword) {
      alert("Password and confirm password are not same....!");
      return;
    } else {
      const formdata = await new FormData();
      await formdata.append("role", 2);
      await formdata.append("first_name", customernames);
      await formdata.append("email", customeremail);
      await formdata.append("password", customerpassword);
      await formdata.append("confirm_password", customerconfirmpassword);
      await formdata.append("mobile_no", customermobile);
      await formdata.append("nearest_airport_code", customerairportcode);

      const data = await RegisterCustomer(formdata);
      if (data) {
        if (data.success == 1) {
          setIsModalOpen2(false);
          setCustomernames("");
          setCustomermobile("");
          setCustomeremail("");
          setCustomerpassword("");
          setCustomerconfirmpassword("");
          setCustomerairportcode("");

          // window.location.reload(false);
        } else if (data.success == 1) {
          setIsModalOpen2(false);
          setCustomernames("");
          setCustomermobile("");
          setCustomeremail("");
          setCustomerpassword("");
          setCustomerconfirmpassword("");
          setCustomerairportcode("");

          // window.location.reload(false);
        }
      }
    }
  };

  const SigninAgent = async (type) => {
    const errors = [];
    const minLength = 8;
    const hasNumber = /[0-9]/.test(getpassword);
    const hasUpperCase = /[A-Z]/.test(getpassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(getpassword);

    if (agentnames === "") {
      alert("Enter the Name......!");
    } else if (agentmobile === "") {
      alert("Enter the Mobile No......!");
    } else if (agentemail === "") {
      alert("Enter the Email......!");
      return;
    } else if (regEx.test(agentemail) === false) {
      alert("Enter the valid Email....!");
      return;
    } else if (agentpassword === "") {
      alert("Enter the Password......!");
      return;
    } else if (agentconfirmpassword === "") {
      alert("Enter the Confirm Password....!");
      return;
    } else if (agentpassword !== agentconfirmpassword) {
      alert("Password and confirm password are not same....!");
      return;
    } else if (agentcompanyname === "") {
      alert("Enter Company Name....!");
      return;
    } else if (agentcompanyaddress === "") {
      alert("Enter Company Address....!");
      return;
    } else if (agentcity === "") {
      alert("Enter City Name....!");
      return;
    } else if (agentpincode === "") {
      alert("Enter ZipCode....!");
      return;
    } else {
      const formdata = await new FormData();
      await formdata.append("role", 3);
      await formdata.append("first_name", agentnames);
      // await formdata.append("last_name", "");
      await formdata.append("email", agentemail);
      await formdata.append("password", agentpassword);
      await formdata.append("confirm_password", agentconfirmpassword);
      await formdata.append("mobile_no", agentmobile);
      await formdata.append("nearest_airport_code", agentairportcode);
      await formdata.append("company_name", agentcompanyname);
      await formdata.append("address", agentcompanyaddress);
      await formdata.append("adhar_no", agentaadhar);
      await formdata.append("pan_no", agentpan);
      await formdata.append("gst_no", agentgst);
      await formdata.append("state_code", agentstate);
      await formdata.append("city", agentcity);
      await formdata.append("zip", agentpincode);
      if (aadharFront) {
        formdata.append("adhar_front", aadharFront);
      }
      if (aadharBack) {
        formdata.append("adhar_back", aadharBack);
      }
      if (agentpanImage) {
        formdata.append("pan_img", agentpanImage);
      }

      const data = await RegisterCustomer(formdata);
      if (data) {
        if (data.success == 1) {
          setIsModalOpen2(false);
          setAgentnames("");
          setAgentmobile("");
          setAgentemail("");
          setAgentpassword("");
          setAgentconfirmpassword("");
          setAgentairportcode("");
          setAgentcompanyname("");
          setAgentcompanyaddress("");
          setAgentstate("");
          setAgentaadhar("");
          setAgentpan("");
          setAgentcity("");
          setAgentpincode("");
          setAadharFront(null);
          setAadharBack(null);
          setAgentpanImage(null);
          setAgentgst("");
          setUserRole("customer");

          // window.location.reload(false);
        } else if (data.success == 1) {
          setIsModalOpen2(false);
          setAgentnames("");
          setAgentmobile("");
          setAgentemail("");
          setAgentpassword("");
          setAgentconfirmpassword("");
          setAgentairportcode("");
          setAgentcompanyname("");
          setAgentcompanyaddress("");
          setAgentstate("");
          setAgentcity("");
          setAgentpincode("");
          setAadharFront(null);
          setAadharBack(null);
          setAgentpanImage(null);
          setAgentgst("");
          // window.location.reload(false);
        }
      }
    }
  };

  useEffect(() => {
    GetState();
  }, []);

  const ForgotPassApi = async (e) => {
    if (forgotemail === "") {
      alert("Enter the Email......!");
      return;
    } else if (regEx.test(forgotemail) === false) {
      alert("Enter the valid Email....!");
      return;
    } else {
      const formdata = await new FormData();
      await formdata.append("email", forgotemail);

      //
      const data = await forgotPassword(formdata);
      if (data) {
        if (data.success == 1) {
          setForgotEmail("");
          // setIsModalOpen3(false);
          setCondition(true);
        }
      }
    }
  };
  const ForgotPassOtpApi = async (e) => {
    if (otp === "") {
      alert("Enter the Email......!");
      return;
    } else if (newPassword === "") {
      alert("Enter the Password....!");
      return;
    } else if (confirmnewPassword === "") {
      alert("Enter the Confirm Password....!");
      return;
    } else {
      const formdata = await new FormData();
      await formdata.append("otp", otp);
      await formdata.append("password", newPassword);
      await formdata.append("confirm_password", confirmnewPassword);

      //
      const data = await forgotPasswordOtp(formdata);
      if (data) {
        if (data.success == 1) {
          setCondition(false);
          setIsModalOpen3(false);
        }
      }
    }
  };

  const GetState = async () => {
    axios
      .get(get_state, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      })
      .then((res) => {
        if (res.data.success == 1) {
          console.log("state data are", res.data);
          SetState_Array(res.data.data);
        } else {
          // null;
        }
      })
      .catch((err) => {
        console.log("error11", err);
      });
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const modalopen = () => {
    setIsModalOpen(true);
  };

  const [hoverOpen, setHoverOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setHoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container-fluid" style={{ backgroundColor: "#fffbdb" }}>
      <div className="container containernav">
        <div className="navbarcont">
          {/* Logo */}
          <div>
            <Link to={"/"} className="linkHover">
              <img src={images.logo} className="logoimg" alt="Logo" />
            </Link>
          </div>

          <div className="alllinks d-none d-md-flex">
            <Link to={"/"} className="navlinks">
              Home
            </Link>
            <Link to={"/about"} className="navlinks">
              About Us
            </Link>
            <Link to={"/contactus"} className="navlinks">
              Contact Us
            </Link>
            {login === "true" ? (
              <>
                <div className="drop_down" ref={dropdownRef}>
                  <Link className="navlinks">
                    <FaUser
                      size={20}
                      onClick={() => setHoverOpen(!hoverOpen)}
                    />
                  </Link>

                  {hoverOpen ? (
                    <div
                      className={`drop_down_content ${
                        hoverOpen ? "drop_down_content_open" : ""
                      }`}
                    >
                      <div className="d-flex align-items-center w-100 gap-3">
                        <MdDashboard color="#362a60" size={20} />
                        <Link
                          to={"/dashboard"}
                          className="navlinks"
                          onClick={() => setHoverOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </div>
                      <div className="d-flex align-items-center w-100 gap-3">
                        <FaUserCircle color="#362a60" size={20} />
                        <Link
                          to={"/profile"}
                          className="navlinks"
                          onClick={() => setHoverOpen(false)}
                        >
                          Profile
                        </Link>
                      </div>
                      <div className="d-flex align-items-center w-100 gap-3">
                        <IoLogOut color="#362a60" size={20} />
                        <span className="navlinks" onClick={logout}>
                          Logout
                        </span>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="navlinks" onClick={modalopen}>
                  <FaUserPlus size={25} style={{ marginBottom: "5px" }} />
                </div>
              </>
            )}
          </div>

          <div
            className="d-md-none"
            style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
          >
            {login === "true" ? (
              <></>
            ) : (
              <>
                <div className="navlinks" onClick={modalopen}>
                  <FaUserPlus size={25} />
                </div>
              </>
            )}

            <button className="d-md-none menubtn" onClick={toggleMenu}>
              {isMenuOpen ? (
                <RiCloseFill color="black" size={24} />
              ) : (
                <RiMenu3Fill color="black" size={24} />
              )}
            </button>
          </div>
        </div>
        {/* Mobile menu */}

        <div className={`mobileMenu ${isMenuOpen ? "open" : "close"}`}>
          <div className="responsivenavmain d-flex d-md-none">
            <Link to={"/"} className="navlinks" onClick={toggleMenu}>
              Home
            </Link>
            {login === "true" ? (
              <>
                <Link
                  to={"/dashboard"}
                  className="navlinks"
                  onClick={toggleMenu}
                >
                  DashBoard
                </Link>
                <Link to={"/profile"} className="navlinks" onClick={toggleMenu}>
                  Profile
                </Link>
              </>
            ) : (
              <></>
            )}
            <Link to={"/about"} className="navlinks" onClick={toggleMenu}>
              About Us
            </Link>
            <Link to={"/contactus"} className="navlinks" onClick={toggleMenu}>
              Contact Us
            </Link>
            {login === "true" ? (
              <Link
                className="navlinks"
                onClick={() => {
                  toggleMenu();
                  logout();
                }}
              >
                Logout
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <ReactModal
        isOpen={isModalOpen}
        style={customStyles}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <div className="home_model_4wrapp home_model_4wrapp_resp_padding">
          <button
            className="login_modal_close"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <IoCloseCircle color="#ddb46b" size={30} />
          </button>
          <div className="d-flex text-center my-4">
            <p
              className="fw-bold fs-4"
              style={{ color: "#362a60", marginBottom: "0px" }}
            >
              LOGIN
            </p>
          </div>

          <div className="modal_Logodiv">
            <img src={images.logo} alt="" />
          </div>
          <div className="modal_headingdiv mt-4">
            <p className="fs-5">
              Welcome To{" "}
              <span style={{ fontWeight: "bolder", color: "#dbb46b" }}>
                EagleConnect
              </span>{" "}
            </p>
          </div>

          <div className="modal_inputdiv">
            <div className=" modal_inptheading">Email *</div>
            <input
              type="getemail"
              placeholder="Enter your Email"
              className="w-100 text-start modal_input"
              value={getemail}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="modal_inputdiv">
            <div className="modal_inptheading">Password *</div>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                className="w-100 text-start modal_input2"
                value={getpassword}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
            </div>
          </div>
          <div className="forgot-getpassword text-end mt-3 w-100">
            <span
              className="signupbtn"
              style={{ color: "#362a60" }}
              onClick={modalopen3}
            >
              Forgot Password?
            </span>
          </div>
          <div className="text-center my-4 ">
            <button
              disabled={login_loading === true ? true : false}
              style={{ opacity: login_loading === true ? "0.6" : "1" }}
              className="login-btn"
              onClick={() => {
                Login();
              }}
            >
              {login_loading === true ? "Loading..." : "Login"}
            </button>
          </div>
          <div>
            Don't have an Account yet ?{" "}
            <span className="fw-bold signupbtn" onClick={modalopen2}>
              Signup here{" "}
            </span>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={isModalOpen2}
        style={customStyles}
        onRequestClose={() => setIsModalOpen2(false)}
      >
        <div className="home_model_4wrapp home_model_4wrapp_resp_padding">
          <button
            className="login_modal_close"
            onClick={() => {
              setIsModalOpen2(false);
            }}
          >
            <IoCloseCircle color="#dbb46b" size={30} />
          </button>
          <div className="d-flex text-center my-3">
            <p className="fw-bold fs-4" style={{ color: "#362a60" }}>
              REGISTER
            </p>
          </div>

          <div className="d-flex justify-content-center align-items-center role-selection mb-3">
            <label className="radio-label">
              <input
                type="radio"
                name="userRole"
                value="customer"
                checked={userRole === "customer"}
                onChange={() => setUserRole("customer")}
              />
              <span className="custom-radio"></span>
              Customer
            </label>

            <label className="radio-label ms-4">
              <input
                type="radio"
                name="userRole"
                value="agent"
                checked={userRole === "agent"}
                onChange={() => setUserRole("agent")}
              />
              <span className="custom-radio"></span>
              Agent
            </label>
          </div>

          {userRole === "customer" ? (
            <>
              <div className="input-container">
                {/* Name */}
                <div className="input-group">
                  <label className="input-heading">Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input-field"
                    value={customernames}
                    onChange={(e) => setCustomernames(e.target.value)}
                  />
                </div>

                {/* Mobile */}
                <div className="input-group">
                  <label className="input-heading">Mobile *</label>
                  <input
                    type="text"
                    placeholder="Enter your mobile number"
                    className="input-field"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                      setCustomermobile(value);
                    }}
                    maxLength={10}
                    value={customermobile}
                  />
                </div>

                {/* Email */}
                <div className="input-group">
                  <label className="input-heading">Email *</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-field"
                    value={customeremail}
                    onChange={(e) => setCustomeremail(e.target.value)}
                  />
                </div>

                {/* Password & Confirm Password (Side by Side) */}
                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">Password</label>
                    <div className="password-container">
                      <input
                        type={showsignupPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="input-field"
                        value={customerpassword}
                        onChange={(e) => setCustomerpassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() =>
                          setShowsignupPassword(!showsignupPassword)
                        }
                      >
                        {showsignupPassword ? (
                          <FaEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">Confirm Password *</label>
                    <div className="password-container">
                      <input
                        type={showsignupconfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="input-field"
                        value={customerconfirmpassword}
                        onChange={(e) =>
                          setCustomerconfirmpassword(e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() =>
                          setShowsignupConfirmPassword(
                            !showsignupconfirmPassword
                          )
                        }
                      >
                        {showsignupconfirmPassword ? (
                          <FaEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nearest Airport Code */}
                <div className="input-group">
                  <label className="input-heading">Nearest Airport Code</label>
                  <input
                    type="text"
                    placeholder="Enter airport code"
                    className="input-field"
                    value={customerairportcode}
                    onChange={(e) => setCustomerairportcode(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="input-container">
                {/* Name */}
                <div className="input-group">
                  <label className="input-heading">Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input-field"
                    value={agentnames}
                    onChange={(e) => setAgentnames(e.target.value)}
                  />
                </div>

                {/* Mobile */}
                <div className="input-group">
                  <label className="input-heading">Mobile *</label>
                  <input
                    type="text"
                    placeholder="Enter your mobile number"
                    className="input-field"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                      setAgentmobile(value);
                    }}
                    maxLength={10}
                    value={agentmobile}
                  />
                </div>

                {/* Email */}
                <div className="input-group">
                  <label className="input-heading">Email *</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-field"
                    value={agentemail}
                    onChange={(e) => setAgentemail(e.target.value)}
                  />
                </div>

                {/* Password & Confirm Password (Side by Side) */}
                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">Password *</label>
                    <div className="password-container">
                      <input
                        type={agentshowPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="input-field"
                        value={agentpassword}
                        onChange={(e) => setAgentpassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setAgentShowPassword(!agentshowPassword)}
                      >
                        {agentshowPassword ? (
                          <FaEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">Confirm Password *</label>
                    <div className="password-container">
                      <input
                        type={agentshowconfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="input-field"
                        value={agentconfirmpassword}
                        onChange={(e) =>
                          setAgentconfirmpassword(e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() =>
                          setAgentShowConfirmPassword(!agentshowconfirmPassword)
                        }
                      >
                        {agentshowconfirmPassword ? (
                          <FaEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nearest Airport Code */}
                <div className="input-group">
                  <label className="input-heading">Nearest Airport Code</label>
                  <input
                    type="text"
                    placeholder="Enter airport code"
                    className="input-field"
                    value={agentairportcode}
                    onChange={(e) => setAgentairportcode(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-heading">Company Name *</label>
                  <input
                    type="text"
                    placeholder="Enter company name"
                    className="input-field"
                    value={agentcompanyname}
                    onChange={(e) => setAgentcompanyname(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-heading">Address *</label>
                  <textarea
                    type="text"
                    placeholder="Enter address"
                    className="input-field"
                    value={agentcompanyaddress}
                    onChange={(e) => setAgentcompanyaddress(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-heading">State *</label>
                  <select
                    className="input-field"
                    value={agentstate}
                    onChange={(e) => setAgentstate(e.target.value)}
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {getStateArray &&
                      getStateArray.map((item, index) => {
                        return (
                          <option value={item.id} key={index}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">City *</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      className="input-field"
                      value={agentcity}
                      onChange={(e) => setAgentcity(e.target.value)}
                    />
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">ZipCode *</label>
                    <input
                      type="text"
                      placeholder="Enter zipcode"
                      className="input-field"
                      value={agentpincode}
                      onChange={(e) => setAgentpincode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">Aadhar No.</label>
                    <input
                      type="text"
                      placeholder="Enter adhar number"
                      className="input-field"
                      value={agentaadhar}
                      onChange={(e) => setAgentaadhar(e.target.value)}
                    />
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">PAN No.</label>
                    <input
                      type="text"
                      placeholder="Enter PAN number"
                      className="input-field"
                      value={agentpan}
                      onChange={(e) => setAgentpan(e.target.value)}
                    />
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <div className="input-group w-50">
                    <label className="input-heading">Aadhar Front</label>
                    <div
                      {...getRootPropsAadharFront()}
                      className="dropzone-area"
                    >
                      <input {...getInputPropsAadharFront()} />
                      {aadharFront ? (
                        <div className="input-field">{aadharFront.name}</div>
                      ) : (
                        <p className="input-field">select an Image</p>
                      )}
                    </div>
                  </div>

                  <div className="input-group w-50">
                    <label className="input-heading">Aadhar Back</label>
                    <div
                      {...getRootPropsAadharBack()}
                      className="dropzone-area"
                    >
                      <input {...getInputPropsAadharBack()} />
                      {aadharBack ? (
                        <div className="input-field">{aadharBack.name}</div>
                      ) : (
                        <p className="input-field">select an Image</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-heading">PAN Image Upload</label>
                  <div {...getRootPropsPanImage()} className="dropzone-area">
                    <input {...getInputPropsPanImage()} />
                    {agentpanImage ? (
                      <div className="input-field">{agentpanImage.name}</div>
                    ) : (
                      <p className="input-field">Select an image</p>
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-heading">GST No.</label>
                  <input
                    type="text"
                    placeholder="Enter GST number"
                    className="input-field"
                    value={agentgst}
                    onChange={(e) => setAgentgst(e.target.value)}
                  />
                </div>

                <div className="text-secondary">
                  For billing purposes please submit your GST details.In case
                  you do not have GST, please write NA
                </div>
              </div>
            </>
          )}
          <button
            disabled={register_customer_loading === true ? true : false}
            style={{
              opacity: register_customer_loading === true ? "0.6" : "1",
            }}
            className="register-btn"
            onClick={() => {
              userRole === "customer" ? Signin() : SigninAgent();
            }}
          >
            {register_customer_loading === "true" ? "Loading..." : "Register"}
          </button>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={isModalOpen3}
        style={customStyles}
        onRequestClose={() => setIsModalOpen3(false)}
      >
        <div className="home_model_4wrapp home_model_4wrapp_resp_padding">
          <button
            className="login_modal_close"
            onClick={() => {
              setIsModalOpen3(false);
            }}
          >
            <IoCloseCircle color="#dbb46b" size={30} />
          </button>

          <div className="d-flex text-center my-4">
            <p
              className="fw-bold fs-4"
              style={{ color: "#362a60", marginBottom: "0px" }}
            >
              Forgot Password
            </p>
          </div>

          {condition != true ? (
            <>
              <div className="modal_inputdiv">
                <div className=" modal_inptheading">Email *</div>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-100 text-start modal_input"
                  value={forgotemail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="text-secondary mt-3 d-flex justify-content-start w-100">
            Enter Your Email we will send you a OTP
          </div>

          {condition ? (
            <>
              <div className="modal_inputdiv">
                <div className="modal_inptheading">OTP</div>
                <input
                  type="number"
                  placeholder="Enter OTP"
                  className="w-100 text-start modal_input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="modal_inputdiv">
                <div className="modal_inptheading">New Password</div>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  className="w-100 text-start modal_input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="modal_inputdiv">
                <div className=" modal_inptheading">Confirm Password</div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-100 text-start modal_input"
                  value={confirmnewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          {condition ? (
            <button
              disabled={forgot_password_otp_loading === true ? true : false}
              className="btn w-100 mt-3"
              style={{
                backgroundColor: "#dbb46b",
                color: "#fff",
                opacity: forgot_password_loading === true ? "0.6" : "1",
              }}
              onClick={() => {
                ForgotPassOtpApi();
              }}
            >
              {forgot_password_otp_loading === true ? "Loading..." : "Submit"}
            </button>
          ) : (
            <button
              disabled={forgot_password_loading === true ? true : false}
              className="btn w-100 mt-3"
              style={{
                backgroundColor: "#ddb46b",
                color: "#fff",
                opacity: forgot_password_loading === true ? "0.6" : "1",
              }}
              onClick={() => {
                // setCondition(true);
                ForgotPassApi();
              }}
            >
              {forgot_password_loading === true ? "Loading..." : "Send OTP"}
            </button>
          )}
        </div>
      </ReactModal>
    </div>
  );
};

export default Navbar;
