import React from "react";
import "./timeline.css";

const Timeline: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <div className="timeline-container">
      {children}
    </div>
  );
};

export default Timeline;