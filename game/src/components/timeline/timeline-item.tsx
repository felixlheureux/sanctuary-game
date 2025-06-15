import React, { ReactNode } from "react";

interface TimelineItemProps {
  title: string;
  content: ReactNode;
  done: boolean;
  lineThrough: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, content, done, lineThrough }) => {

  return (
    <div className="timeline-item">
      <div className="timeline-item-content font-bold text-white">
        <h3
          className={`font-normal mb-2 ${done ? "line-through text-teal" : "text-pink"} ${lineThrough ? "line-through" : ""}`}>{title}</h3>
        <div>{content}</div>
        <span className="circle" />
      </div>
    </div>
  );
};

export default TimelineItem;