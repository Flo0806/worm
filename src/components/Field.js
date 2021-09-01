import classes from "./Field.module.css";

const Field = (props) => {
  return <div className={`${classes[props.type]}`}></div>;
};

export default Field;
