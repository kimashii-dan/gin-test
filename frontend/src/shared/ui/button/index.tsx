import React from "react";
import styles from "./styles.module.css";
type ButtonProps = {
  variant?: "primary" | "secondary" | "danger" | "outline";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  disabled = false,
  children,
  onClick,
  className,
}) => {
  const classNames = [styles.base, styles[variant], className].join(" ");

  return (
    <button className={classNames} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
