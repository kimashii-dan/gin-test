import React from "react";
import styles from "./styles.module.css";
type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
};

export const Modal: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  const classNames = [styles.base, className].join(" ");

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};
