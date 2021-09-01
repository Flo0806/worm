import "./App.css";
import PlayField from "./components/PlayField";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useInterval } from "./hooks/useInterval";

function App() {
  const [direction, setDirection] = useState("RIGHT");
  const directionRef = useRef("RIGHT");
  const [game, moveSnake] = useReducer(
    (state, action) => {
      const createNewWorm = (newHeadPosition, direction) => {
        const newWorm = [];
        for (let i = state.worm.length - 1; i > 0; i--) {
          if (i > 0) {
            newWorm.push([state.worm[i - 1][0], oldWorm[i - 1][1]]);
          }
        }
        if (direction === "UP" || direction === "DOWN") {
          newWorm.push([state.worm[0][0], newHeadPosition]);
        } else {
          newWorm.push([newHeadPosition, state.worm[0][1]]);
        }
        return newWorm.reverse();
      };

      const oldWorm = [...state.worm];

      if (action === "LEFT") {
        const newPos = oldWorm[0][0] - 1;
        const newWorm = createNewWorm(newPos, "LEFT");
        return {
          ...state,
          worm: newWorm,
        };
      } else if (action === "RIGHT") {
        const newPos = oldWorm[0][0] + 1;
        const newWorm = createNewWorm(newPos, "RIGHT");
        return {
          ...state,
          worm: newWorm,
        };
      } else if (action === "UP") {
        const newPos = oldWorm[0][1] - 1;
        const newWorm = createNewWorm(newPos, "UP");
        return {
          ...state,
          worm: newWorm,
        };
      } else if (action === "DOWN") {
        const newPos = oldWorm[0][1] + 1;
        const newWorm = createNewWorm(newPos, "DOWN");
        console.log(newWorm);
        return {
          ...state,
          worm: newWorm,
        };
      }
    },
    {
      worm: [
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    }
  );

  useEffect(() => {
    console.log("Render");
    const keyDownHandler = (event) => {
      // 37 left, 40 down, 39 right, 38 up
      switch (event.keyCode) {
        case 37:
          if (directionRef.current !== "RIGHT") directionRef.current = "LEFT";
          break;
        case 38:
          if (directionRef.current !== "DOWN") directionRef.current = "UP";
          break;
        case 39:
          if (directionRef.current !== "LEFT") directionRef.current = "RIGHT";
          break;
        case 40:
          if (directionRef.current !== "UP") directionRef.current = "DOWN";
          break;
        default:
          setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [direction]);

  const test = useCallback(() => {}, []);
  useInterval(() => {
    moveSnake(directionRef.current);
  }, 500);
  useEffect(() => {
    setInterval(() => {
      moveSnake(directionRef.current);
    }, 500);
  }, []);

  return (
    <div className="App">
      <PlayField worm={game.worm} />
    </div>
  );
}

export default App;
