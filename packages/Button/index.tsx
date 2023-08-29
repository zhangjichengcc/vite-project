import { FC, ReactNode } from "react";
import styles from "./index.module.less";

interface Props {
  children?: ReactNode;
  size?: "large" | "small" | "default";
}

const Button: FC<Props> = (props) => {
  const { children, size = "default" } = props;
  return <div className={styles.button}>{children}</div>;
};

export default Button;
