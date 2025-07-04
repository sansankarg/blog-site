// components/AnnouncementBanner.jsx
import { useState, useEffect } from "react";

const Announcement = () => {
  const [visible, setVisible] = useState(true);

  // Optional: persist dismissal using localStorage
//   useEffect(() => {
//     const isDismissed = localStorage.getItem("announcementDismissed");
//     if (isDismissed === "true") setVisible(false);
//   }, []);

  const dismissBanner = () => {
    setVisible(false);
    localStorage.setItem("announcementDismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="announcement-banner">
      <div className="announcement-content">
        <p>
        <h3>Vita <i>v0.10-beta.1</i></h3>
           Is now available! A lightweight journaling app built based on my own personal journaling system. Currently available for Windows only.
          <br />
          The app includes a built-in tutorial and sample entries. If you're curious about the system behind it, feel free to email me at <a href="mailto:arthurrevolt.dev@gmail.com">arthurrevolt.dev@gmail.com</a>.
        </p>
        <a
          href="https://download1527.mediafire.com/x0tlbk6acylgqPwn-ApHHNu23_V2udfyTs_ce7GMGoKSDU0dkfVrry4XFd-7aj6iOHcbMytquz1oZHXcRxFNLJPqSKe0TIvgkbRK5YzxXIqZ1qBKPZM9XDPWH7li_eiqjUwyA04WLvjIiJP0c_FNY7BOOyVJ07sTF1BaBiGd5HMSWw/dstwif2511miy39/Vita+beta.exe"
          className="download-btn"
          download
        >
          Download
        </a>
      </div>
      <button className="close-btn" onClick={dismissBanner} aria-label="Dismiss banner">
        &times;
      </button>
    </div>
  );
};

export default Announcement;
