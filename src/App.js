import PlayField from "./components/PlayField";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import classes from "./App.module.css";

function App() {
  const [direction, setDirection] = useState("RIGHT");
  const directionRef = useRef("RIGHT");
  const client = useRef();

  const [game, moveSnake] = useReducer(
    (state, action) => {
      // Moving worm and so on....
      const createNewWorm = (newHeadPosition, direction) => {
        const newWorm = [];
        for (let i = state.worm.length - 1; i > 0; i--) {
          if (i > 0) {
            newWorm.push([state.worm[i - 1][0], state.worm[i - 1][1]]);
          }
        }

        if (direction === "UP" || direction === "DOWN") {
          newWorm.push([state.worm[0][0], newHeadPosition]);
        } else {
          newWorm.push([newHeadPosition, state.worm[0][1]]);
        }
        const currentWorm = newWorm.reverse();

        return currentWorm;
      };

      // Crate new food when worm eating it
      const createNewFood = (worm) => {
        const openCoords = [];

        for (let i = 0; i < 30; i++) {
          for (let j = 0; j < 30; j++) {
            if (!worm[i] || !worm[i][j]) {
              openCoords.push([i, j]);
            }
          }
        }
        const test = [
          openCoords[Math.trunc(Math.random() * openCoords.length)],
        ];
        console.log(test);
        return test;
      };

      // Add one more to the worm
      const addOneToWorm = (worm) => {
        const newWorm = [...worm];
        newWorm.push(worm[worm.length - 1]);
        return newWorm;
      };

      // Check collisions
      const checkCollision = (food, worm) => {
        let dead = false;
        if (
          worm[0][0] === -1 ||
          worm[0][0] === 30 ||
          worm[0][1] === -1 ||
          worm[0][1] === 30
        ) {
          dead = true;
        } else if (equals(worm[0], food[0])) {
          food = createNewFood(food);
          worm = addOneToWorm(worm);
        }

        return [food, worm, dead];
      };

      const equals = (a, b) => a[0] === b[0] && a[1] === b[1];

      const oldWorm = [...state.worm];

      if (action === "LEFT") {
        const newPos = oldWorm[0][0] - 1;
        const [newFood, newWorm, dead] = checkCollision(
          state.food,
          createNewWorm(newPos, "LEFT")
        );
        return {
          ...state,
          worm: dead ? [...state.worm] : newWorm,
          food: dead ? [...state.food] : newFood,
          gameover: dead,
        };
      } else if (action === "RIGHT") {
        const newPos = oldWorm[0][0] + 1;
        const [newFood, newWorm, dead] = checkCollision(
          state.food,
          createNewWorm(newPos, "RIGHT")
        );
        return {
          ...state,
          worm: dead ? [...state.worm] : newWorm,
          food: dead ? [...state.food] : newFood,
          gameover: dead,
        };
      } else if (action === "UP") {
        const newPos = oldWorm[0][1] - 1;
        const [newFood, newWorm, dead] = checkCollision(
          state.food,
          createNewWorm(newPos, "UP")
        );
        return {
          ...state,
          worm: dead ? [...state.worm] : newWorm,
          food: dead ? [...state.food] : newFood,
          gameover: dead,
        };
      } else if (action === "DOWN") {
        const newPos = oldWorm[0][1] + 1;
        const [newFood, newWorm, dead] = checkCollision(
          state.food,
          createNewWorm(newPos, "DOWN")
        );
        return {
          ...state,
          worm: dead ? [...state.worm] : newWorm,
          food: dead ? [...state.food] : newFood,
          gameover: dead,
        };
      }
    },
    {
      worm: [
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      food: [[10, 5]],
      gameover: false,
    }
  );

  useEffect(() => {
    client.current = new WebSocket("ws://localhost:3200/ws");

    client.current.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.current.onmessage = (message) => {
      console.log(message);
    };
    client.current.onclose = (event) => {
      console.log("WebSocket Client Closed");
    };
    client.current.onerror = (event) => {
      console.log(event);
    };
    return () => {
      client.current.close();
    };
  }, []);

  useEffect(() => {
    const keyDownHandler = (event) => {
      // 37 left, 40 down, 39 right, 38 up
      switch (event.keyCode) {
        case 37:
          if (directionRef.current !== "RIGHT") directionRef.current = "LEFT";
          client.current.send(JSON.stringify({ data: "CREATENEWSERVER" }));
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

  useEffect(() => {
    setInterval(() => {
      moveSnake(directionRef.current);
    }, 500);
  }, []);

  return (
    <div className={classes.app}>
      <PlayField food={game.food} worm={game.worm} gameover={game.gameover} />
    </div>
  );
}

export default App;
