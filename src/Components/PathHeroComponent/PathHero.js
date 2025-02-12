import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./PathHero.css";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../../Constants/images";

const PathHero = ({ name }) => {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Adjust movement distance based on screen size
  const moveDistance = isMobile ? 50 : 100;

  const leftOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const leftX = useTransform(scrollYProgress, [0, 0.3], [0, -moveDistance]);

  const rightOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.3], [0, moveDistance]);

  return (
    <section className="container-fluid about_main mb-5">
      <div className="container">
        <div className="row banner-area mb-5">
          {/* Left Image */}
          <div className="col-12 col-md-4">
            <motion.img
              src={images.bags}
              alt=""
              className="left-imge"
              style={{ opacity: leftOpacity, x: leftX }}
            />
          </div>

          {/* Center Content */}
          <div className="col-12 col-md-3">
            <div className="content-box">
              <h1 className="fw-bolder">{name}</h1>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-12 col-md-4">
            <motion.img
              src={images.Plane}
              alt=""
              className="right-imge"
              style={{ opacity: rightOpacity, x: rightX }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathHero;
