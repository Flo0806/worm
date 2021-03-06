import Field from "./Field";
import classes from "./PlayField.module.css";

export const FIELD_WIDTH = 30;
export const FIELD_HEIGHT = 30;

const PlayField = (props) => {
  let playField = Array.from(new Array(FIELD_HEIGHT), () =>
    new Array(FIELD_WIDTH).fill([0, "field"])
  );
  props.worm.forEach((wormSegment) => {
    playField[wormSegment[1]][wormSegment[0]] = [1, "snake"];
  });

  props.food.forEach((foodSegment) => {
    playField[foodSegment[1]][foodSegment[0]] = [1, "food"];
  });

  return (
    <div className={classes["play-field"]}>
      {playField.map((row) => row.map((cell, x) => <Field type={cell[1]} />))}
      {props.gameover && <div className={classes["game-over"]}>GAME OVER</div>}
    </div>
  );
};

export default PlayField;
