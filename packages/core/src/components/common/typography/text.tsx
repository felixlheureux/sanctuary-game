import React from "react";
import classNames from "classnames";

type TextProps = {
  children: any,
  bold?: boolean
  onClick?: (...args: any) => void,
  className?: string,
  color?: "purple" | "grey" | "white",
  underline?: boolean,
  size?: "extra-small" | "small" | "medium",
  center?: boolean,
  capitalize?: boolean,
  normal?: boolean,
  textAlign?: "left" | "center" | "right",
  ellipsis?: boolean,
  marginBottom?: "1" | "15" | "2"
}

const Text = ({
                children,
                bold,
                onClick,
                className,
                color,
                underline,
                size,
                center,
                capitalize,
                normal,
                textAlign,
                ellipsis = false,
                marginBottom
              }: TextProps) => {

  const classes = classNames(
    {
      [`hd-text-bold`]: bold,
      [`hd-text-${color}`]: color,
      [`hd-text-underline`]: underline,
      [`hd-text-${size}`]: size,
      [`hd-text-center`]: center,
      [`hd-text-capitalize`]: capitalize,
      [`hd-text-normal`]: normal,
      [`hd-text-align-${textAlign}`]: textAlign,
      [`hd-text-ellipsis`]: ellipsis,
      [`hd-${marginBottom}-mb`]: marginBottom
    },
    className
  );

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Text;