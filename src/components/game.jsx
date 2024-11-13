import { useState, useEffect, useRef } from "react";
import "../components/game.css";
import birdImage from "../assets/img/bird.png";
import parachuteImg from "../assets/img/parachuteImg.png";
import starImage from "../assets/img/starImg.png";
import planeImage from "../assets/img/plane.png";

function Game() {
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState({ x: 500, y: 550 });
  const [fuel, setFuel] = useState(100);
  const [stars, setStars] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const aircraftRef = useRef(null);
  const birdRef = useRef(null);
  const paraRef = useRef(null);
  const starRef = useRef(null);

  const birdAnimationRef = useRef();
  const parachuteAnimationRef = useRef();
  const starAnimationRef = useRef();

  useEffect(() => {
    let fuelTimer, gameTimer;
    if (isGameRunning && !isPaused) {
      fuelTimer = setInterval(() => setFuel((f) => f - 1), 1000);
      gameTimer = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    }
    if (fuel <= 0) endGame("Out of fuel");

    return () => {
      clearInterval(fuelTimer);
      clearInterval(gameTimer);
    };
  }, [isGameRunning, isPaused, fuel]);

  const startGame = () => {
    setFuel(100);
    setStars(0);
    setTimeElapsed(0);
    setIsGameRunning(true);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const pauseGame = () => {
    setIsPaused((prev) => !prev);
  };

  const endGame = (reason) => {
    setIsGameRunning(false);
    setIsGameOver(true);
    cancelAllAnimations();
    alert(`Game Over: ${reason}`);
  };

  const cancelAllAnimations = () => {
    cancelAnimationFrame(birdAnimationRef.current);
    cancelAnimationFrame(parachuteAnimationRef.current);
    cancelAnimationFrame(starAnimationRef.current);
  };

  const birdPositionRef = useRef({
    x: Math.random() * window.innerWidth,
    y: 0,
  });
  const parachutePositionRef = useRef({
    x: Math.random() * window.innerWidth,
    y: 0,
  });
  const starPositionRef = useRef({
    x: Math.random() * window.innerWidth,
    y: 0,
  });

  const animateBird = () => {
    birdPositionRef.current.y += 5;
    if (birdPositionRef.current.y > window.innerHeight) {
      birdPositionRef.current = { x: Math.random() * window.innerWidth, y: 0 };
    }
    birdRef.current.style.left = `${birdPositionRef.current.x}px`;
    birdRef.current.style.top = `${birdPositionRef.current.y}px`;
    birdAnimationRef.current = requestAnimationFrame(animateBird);
  };

  const animateParachute = () => {
    parachutePositionRef.current.y += 3;
    if (parachutePositionRef.current.y > window.innerHeight) {
      parachutePositionRef.current = {
        x: Math.random() * window.innerWidth,
        y: 0,
      };
    }
    paraRef.current.style.left = `${parachutePositionRef.current.x}px`;
    paraRef.current.style.top = `${parachutePositionRef.current.y}px`;
    parachuteAnimationRef.current = requestAnimationFrame(animateParachute);
  };

  const animateStar = () => {
    starPositionRef.current.y += 4;
    if (starPositionRef.current.y > window.innerHeight) {
      starPositionRef.current = { x: Math.random() * window.innerWidth, y: 0 };
    }
    starRef.current.style.left = `${starPositionRef.current.x}px`;
    starRef.current.style.top = `${starPositionRef.current.y}px`;
    starAnimationRef.current = requestAnimationFrame(animateStar);
  };

  useEffect(() => {
    if (isGameRunning) {
      birdAnimationRef.current = requestAnimationFrame(animateBird);
      parachuteAnimationRef.current = requestAnimationFrame(animateParachute);
      starAnimationRef.current = requestAnimationFrame(animateStar);
    } else {
      cancelAllAnimations();
    }
  }, [isGameRunning]);

  const detectCollision = () => {
    if (!aircraftRef?.current) return;
    const planeRect = aircraftRef.current.getBoundingClientRect();

    const checkCollision = (obj) => {
      if (!obj?.current) return false;
      const objRect = obj.current.getBoundingClientRect();

      const horizontalOverlap =
        planeRect.x < objRect.x + objRect.width &&
        planeRect.x + planeRect.width > objRect.x;
      const verticalOverlap =
        planeRect.y < objRect.y + objRect.height &&
        planeRect.y + planeRect.height > objRect.y;
      return horizontalOverlap && verticalOverlap;
    };

    if (checkCollision(birdRef)) {
      endGame("You hit a bird!");
    }

    if (checkCollision(paraRef)) {
      console.log("You hit a Para!");
      setFuel((prevFuel) => Math.min(prevFuel + 10, 100));
    }

    if (checkCollision(starRef)) {
      console.log("You hit a star!");
      setStars((prevStars) => prevStars + 1);
    }
  };

  useEffect(() => {
    detectCollision();
  }, [position]);

  const handleKeyPress = (event) => {
    if (event.key === "ArrowUp" && position.y > 0) {
      setPosition((prevPos) => ({ ...prevPos, y: prevPos.y - 10 }));
    } else if (
      event.key === "ArrowDown" &&
      position.y < window.innerHeight - 50
    ) {
      setPosition((prevPos) => ({ ...prevPos, y: prevPos.y + 10 }));
    } else if (event.key === "ArrowLeft" && position.x > 0) {
      setPosition((prevPos) => ({ ...prevPos, x: prevPos.x - 10 }));
    } else if (
      event.key === "ArrowRight" &&
      position.x < window.innerWidth - 50
    ) {
      setPosition((prevPos) => ({ ...prevPos, x: prevPos.x + 10 }));
    }
  };

  return (
    <div className="game" onKeyDown={handleKeyPress} tabIndex="0">
      <h1>Sky Angel</h1>
      {isGameOver && (
        <p>
          Game Over! Score: {stars} stars. Fuel: {fuel}
        </p>
      )}

      <button onClick={isGameRunning ? endGame : startGame}>
        {isGameRunning ? "End Game" : "Start Game"}
      </button>
      <button onClick={pauseGame}>{isPaused ? "Resume" : "Pause"}</button>
      <p>Time: {timeElapsed}s</p>
      <div className="game-container">
        <div className="fuel">Fuel: {fuel}</div>
        <div className="stars">Stars: {stars}</div>

        <img
          ref={aircraftRef}
          src={planeImage}
          className="aircraft"
          alt="aircraft"
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
          }}
        />
        {isGameRunning && (
          <>
            <img
              ref={birdRef}
              src={birdImage}
              className="bird"
              alt="Bird"
              style={{
                position: "absolute",
                left: birdPositionRef.current.x,
                top: birdPositionRef.current.y,
              }}
            />
            <img
              ref={paraRef}
              src={parachuteImg}
              className="parachute"
              alt="Parachute"
              style={{
                position: "absolute",
                left: parachutePositionRef.current.x,
                top: parachutePositionRef.current.y,
              }}
            />
            <img
              ref={starRef}
              src={starImage}
              className="star"
              alt="Star"
              style={{
                position: "absolute",
                left: starPositionRef.current.x,
                top: starPositionRef.current.y,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Game;
