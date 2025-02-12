import React from "react";
import "./Homehero.css";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";
import { motion, useScroll, useTransform } from "framer-motion";

const HomeHero = () => {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const text = "Book Your Dream Flights Now!";
  const description =
    "Book your dream flights now and turn your travel aspirations into reality! Whether you're planning a relaxing getaway, an adventurous trip, or a visit to loved ones, we have the perfect options tailored just for you.";

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const imagecontainerVariants = {
    hidden: {
      opacity: 0,
      x: "100%", // Start off the screen (right side)
    },
    visible: {
      opacity: 1,
      x: 0, // End position (on the screen)
      transition: {
        opacity: { duration: 0.5 }, // Smooth fade-in
        x: {
          type: "spring", // Use spring for the movement
          stiffness: 150, // Controls the spring's stiffness
          damping: 10, // Controls how quickly the spring stops
          duration: 0.6, // Duration of the animation
        },
      },
    },
  };

  return (
    <section className="containerr container">
      <div className="vector-image d-block  d-md-none d-xxl-block">
        <svg xmlns viewBox="0 0 1414 319" fill="none">
          <path
            className="path"
            d="M-0.5 215C62.4302 220.095 287 228 373 143.5C444.974 72.7818 368.5 -3.73136 320.5 1.99997C269.5 8.08952 231.721 43.5 253.5 119C275.279 194.5 367 248.212 541.5 207.325C675.76 175.867 795.5 82.7122 913 76.7122C967.429 73.9328 1072.05 88.6813 1085 207.325C1100 344.712 882 340.212 922.5 207.325C964.415 69.7967 1354 151.5 1479 183.5"
            stroke="#ECECF2"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="round"
          ></path>
          <path
            className="dashed"
            d="M-0.5 215C62.4302 220.095 287 228 373 143.5C444.974 72.7818 368.5 -3.73136 320.5 1.99997C269.5 8.08952 231.721 43.5 253.5 119C275.279 194.5 367 248.212 541.5 207.325C675.76 175.867 795.5 82.7122 913 76.7122C967.429 73.9328 1072.05 88.6813 1085 207.325C1100 344.712 882 340.212 922.5 207.325C964.415 69.7967 1354 151.5 1479 183.5"
            stroke="#212627"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="22 22"
          ></path>
        </svg>
        {/* <div className="location-image">
          <img src={images.location} alt="" />
        </div> */}
      </div>
      <div className="row gap-4 gap-lg-0 align-items-center justify-content-center">
        <div className="col-12 col-lg-5 leftside">
          <div className="content-block">
            <motion.h1
              className="heroleftsidetext"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {text.split(" ").map((word, wordIndex) => (
                <React.Fragment key={wordIndex}>
                  {word === "Book" || word === "Flights" ? (
                    // Split "Book" and "Flights" into individual characters
                    word.split("").map((char, charIndex) => (
                      <motion.span
                        key={`${wordIndex}-${charIndex}`}
                        variants={itemVariants}
                        className="spancolor"
                      >
                        {char}
                      </motion.span>
                    ))
                  ) : (
                    // Render other words as is
                    <motion.span
                      key={wordIndex}
                      variants={itemVariants}
                      className="heroleftsidetext"
                    >
                      {word}
                    </motion.span>
                  )}
                  {wordIndex < text.split(" ").length - 1 && ""}{" "}
                  {/* {word === "Dream" && <br />} */}
                  {/* Add a space */}
                </React.Fragment>
              ))}
            </motion.h1>

            <motion.p
              className="mt-3 col-lg-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {description}
            </motion.p>

            <button
              className="herobookbtn"
              onClick={() => handleScroll("#bookingcont")}
            >
              BOOK NOW
            </button>
          </div>
        </div>
        <motion.div
          variants={imagecontainerVariants}
          initial="hidden"
          animate="visible"
          className="col-12 col-md-7 imgsec"
        >
          <img
            src={images.Plane}
            className="planeimg"
            alt="Aeroplane image"
            // style={{ rotate }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHero;
