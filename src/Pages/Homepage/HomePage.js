import React, { useEffect } from "react";
import "./Homepage.css";
import "./GSAPAnim";
import HomeHero from "../../Components/HomeHero/HomeHero";
import HeroTicketBooking from "../../Components/HeroTicketBooking/HeroTicketBooking";
import WhyChooseUs from "../../Components/WhyChooseUs/WhyChooseUs";
import PartnerAirline from "../../Components/PartnerAirlines/PartnerAirline";
import { Helmet } from "react-helmet";

const HomePage = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="">
      <Helmet>
        <title>Home | Airline Booking</title>
      </Helmet>

      <div className="herodivv">
        <HomeHero />
      </div>

      <HeroTicketBooking />

      <WhyChooseUs />

      <PartnerAirline />
    </div>
  );
};

export default HomePage;
