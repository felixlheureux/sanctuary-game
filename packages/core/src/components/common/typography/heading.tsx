import React from "react";
import classNames from "classnames";

type HeadingProps = {
  children: any,
  className?: string,
  onClick?: (...args: any) => void
  color?: "purple" | "green" | "white",
  semiBold?: boolean,
  level: 1 | 2 | 3 | 4 | 5,
  noMargin?: boolean,
  noPadding?: boolean,
  textAlign?: "center" | "left" | "right" | "justify"
  marginBottom?: "1" | "15" | "2",
  id?: string
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5";

const Heading = ({
                   children,
                   className,
                   onClick,
                   color,
                   semiBold,
                   level,
                   noMargin,
                   noPadding,
                   textAlign,
                   marginBottom,
                   id
                 }: HeadingProps) => {

  const classes = classNames(
    {
      [`hd-text-${color}`]: color,
      [`hd-text-semi-bold`]: semiBold,
      [`no-margin`]: noMargin,
      [`no-padding`]: noPadding,
      [`hd-text-align-${textAlign}`]: textAlign,
      [`hd-${marginBottom}-mb`]: marginBottom
    },
    className
  );

  const HeadingTag = `h${level}` as HeadingTag;

  return (
    <HeadingTag id={id} className={classes} onClick={onClick}>
      {children}
    </HeadingTag>
  );
};

export default Heading;