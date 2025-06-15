import React from "react";
import classNames from "classnames";

interface ButtonProps {
  children: any,
  size?: "small" | "medium" | "large",
  type?: "primary" | "secondary" | "muted" | "danger",
  rounded?: boolean,
  block?: boolean,
  loading?: boolean,
  disabled?: boolean,
  fullWidth?: boolean,
  leadingIcon?: JSX.Element,
  trailingIcon?: JSX.Element,
  onClick?: (...args: any) => void,
  className?: string,
  htmlType?: "submit" | "reset",
}

const Button: React.FC<ButtonProps> = ({
                                         children,
                                         size = "large",
                                         type = "muted",
                                         rounded = true,
                                         loading,
                                         disabled,
                                         fullWidth,
                                         leadingIcon,
                                         trailingIcon,
                                         onClick,
                                         className,
                                         htmlType
                                       }: ButtonProps) => {

  const classes = classNames(
    "inline-flex items-center border justify-center border-transparent font-medium rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 active:translate-y-0.5 transition-all ease-out",
    {
      ["px-3 py-2 text-sm"]: size === "small",
      ["px-4 py-2 text-sm"]: size === "medium",
      ["px-4 py-2 text-base"]: size === "large",
      ["border-slate-300 text-slate-700 bg-white hover:bg-slate-50"]: type === "muted",
      ["rounded-full"]: rounded,
      [`hd-button-disabled`]: disabled,
      [`w-full`]: fullWidth
    },
    className
  );

  const handleClick = () => {
    if (disabled) return;

    if (onClick !== undefined) onClick();
  };

  return (
    <>
      <button
        type={htmlType}
        onClick={handleClick}
        className={classes}>
        {children}
      </button>
    </>
  );
};

export default Button;