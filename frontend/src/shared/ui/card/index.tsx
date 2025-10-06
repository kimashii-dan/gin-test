import React from "react";
import styles from "./styles.module.css";
type CardProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, onClick, className }) => {
  const classNames = [styles.base, className].join(" ");

  return (
    <div className={classNames} onClick={onClick}>
      {children}
    </div>
  );
};
