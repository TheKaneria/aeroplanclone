// import React from "react";

// // import "antd/dist/antd.css";
// import { notification } from "antd";

// const createNotification = (type, message, description) => {
//   notification[type]({
//     message,
//     description,
//   });
// };
// export default createNotification;

import React from "react";
import { notification } from "antd";

const createNotification = (type, message, description, duration = 1) => {
  notification[type]({
    message,
    description,
    duration, // Set the duration here (default is 2 seconds)
  });
};

export default createNotification;
