import React, { useState, useEffect, useRef } from "react";
import SpaceShip from "@/assets/spaceship.png";
import Rock from "@/assets/asteroid.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom";
import { useModal } from "@/hook/useModal";
import { Button } from "@/components/ui/button";

const CONTAINER_SIZE = 350;
const SHIP_SIZE = 25;
const ROCK_SIZE = 20;
const ROCK_MARGIN = 7.5;
const ROCK_REGION = ROCK_SIZE + 2 * ROCK_MARGIN; // 50px
const BULLET_TICK = 5; // one tick (one frame) is 5px
const BULLET_SIZE = 5;

export default function Space() {
  const navigate = useNavigate();
  const { openModal } = useModal();

  // one array with 20 true
  const initialSquares = Array(20).fill(true);
  const [squares, setSquares] = useState(initialSquares);

  // the spaceship has position coordinate start from 0
  // the spaceship has size 10 * 10, 
  // the container has size 500 * 500, so the range of x is 0 to 490
  const [shipPosition, setShipPosition] = useState(0);

  // add a reference to the location, so that the useEffect does not need to be [shipPosition]
  const shipPositionRef = useRef(shipPosition);

  useEffect(() => {
    shipPositionRef.current = shipPosition;
  }, [shipPosition]);

  // press ENTER to release bullets
  const [bullets, setBullets] = useState([]);

  // listen to the keydown event for (A, D) or (ArrowLeft, ArrowRight)
  const moveShip = (action) => {
    // action can be "left" or "right"
    if (action === "left") {
      setShipPosition((prev) => {
        return Math.max(prev - 1, 0);
      })
    } else if (action === "right") {
      setShipPosition((prev) => {
        return Math.min(prev + 1, CONTAINER_SIZE - SHIP_SIZE);
      })
    } 
  };

  // monitor the keydown event
  const handleKeyDown = (event) => {
    if (event.key === "a" || event.key === "ArrowLeft" || event.key === "A") {
      moveShip("left");
    } else if (event.key === "d" || event.key === "ArrowRight" || event.key === "D") {
      moveShip("right");
    } else if (event.key === " ") {
      // send a bullet
      const newBullet = {
        x: shipPositionRef.current + SHIP_SIZE / 2 - BULLET_SIZE / 2,
        y: CONTAINER_SIZE - SHIP_SIZE,
      };

      setBullets((prevBullets) => [...prevBullets, newBullet]);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // enable both single click and long press for the buttons
  const handleButtonclick = (action) => {
    // move for once
    moveShip(action);

    // move repeatedly for every 30ms
    const interval = setInterval(() => moveShip(action), 30);

    // create the stop moving function
    const stop = () => {
      clearInterval(interval);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("mouseleave", stop);
      window.removeEventListener("touchend", stop);
      window.removeEventListener("touchcancel", stop);
    };

    // now add these stop event listener
    window.addEventListener("mouseup", stop);
    window.addEventListener("mouseleave", stop);
    window.addEventListener("touchend", stop);
    window.addEventListener("touchcancel", stop);
  };

  // add a timer to all the bullets
  useEffect(() => {
    // if no bullets, do nothing
    if (bullets.length === 0) return;

    // animate for all the bullets
    const moveBullets = () => {
      setBullets((prevBullets) => {
        let newSquares = [...squares];
        const newBullets = [];

        prevBullets.forEach((bullet) => {
          // move the bullet
          const x = bullet.x;
          const y = Math.max(bullet.y - BULLET_TICK, 0);

          // check if hits a rock
          const rockIndex = Math.floor(x / ROCK_REGION);
          const isMatch = ((x % ROCK_REGION) >= ROCK_MARGIN) && ((x % ROCK_REGION) <= ROCK_REGION - ROCK_MARGIN);

          if (!isMatch) {
            // when the bullet can still move
            if (y > 0) {
              newBullets.push({ x, y });
            }
          } else {
            // this bullet may hit a rock, check if there is a rock
            const isHitLowerRock = newSquares[rockIndex + 10] && (y <= ROCK_REGION * 2 - ROCK_MARGIN);
            const isHitUpperRock = newSquares[rockIndex] && (y <= ROCK_REGION - ROCK_MARGIN);

            if (isHitLowerRock) {
              // remove that rock
              newSquares[rockIndex + 10] = false;
            } else if (isHitUpperRock) {
              // remove that rock
              newSquares[rockIndex] = false;
            } else if (y > 0) {
              // only save the bullet if it is still in motion
              newBullets.push({ x, y });
            }
          }
        });

        // update both bullets and squares
        setSquares(newSquares);
        return newBullets;
      });
    };

    // set interval for 25 frames per second
    const interval = setInterval(moveBullets, 1000 / 25);
    return () => clearInterval(interval);

  }, [bullets.length, squares]);

  // when all the rocks are gone show the modal
  useEffect(() => {
    const win = squares.every(square => !square);
    if (win) {
      openModal(
        "Congratulations!",
        "You have destroyed all the rocks!",
        () => navigate("/"),
      )
    };

  }, [squares]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      {/* this is the 500 * 500px game layout */}
      <div 
        className="relative border-1 border-black rounded"
        style={{
          width: `${CONTAINER_SIZE}px`,
          height: `${CONTAINER_SIZE}px`
        }}
      >
        {/* the 20 rocks */}
        {squares.map((square, index) => (
          square && (
            <img
              src={Rock}
              alt="Rock"
              key={index}
              className="object-fill absolute"
              // 10 rocks in one row
              style={{
                margin: `${ROCK_MARGIN}px`,
                width: `${ROCK_SIZE}px`,
                height: `${ROCK_SIZE}px`,
                left: `${(index % 10) * ROCK_REGION}px`,
                top: `${Math.floor(index / 10) * ROCK_REGION}px`
              }}
            />
          )))}
        {/* the spaceship */}
        <img
          src={SpaceShip}
          className="aspect-square absolute object-fill"
          style={{
            width: `${SHIP_SIZE}px`,
            height: `${SHIP_SIZE}px`,
            bottom: 0,
            left: `${shipPosition}px`
          }}
        />
        {/* all the bullets */}
        {bullets.map((bullet, index) => (
          <div
            key={index}
            className="absolute aspect-square rounded-full bg-red-500"
            style={{
              width: `${BULLET_SIZE}px`,
              height: `${BULLET_SIZE}px`,
              left: `${bullet.x}px`,
              top: `${bullet.y}px`
            }}
          />
        ))}
      </div>
      {/* add some buttons for mobile use */}
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="flex flex-row gap-8">
          <Button 
            variant="outline" 
            className="cursor-pointer"
            onMouseDown={() => handleButtonclick("left")}
            onTouchStart={() => handleButtonclick("left")}
          >
            <span  className="text-2xl">←</span>
          </Button>
          <Button 
            variant="outline" 
            className="cursor-pointer"
            onMouseDown={() => handleButtonclick("right")}
            onTouchStart={() => handleButtonclick("right")}
          >
            <span className="text-2xl">→</span>
          </Button>
        </div>
        <Button 
          variant="outline" 
          className="cursor-pointer" 
          onClick={() => handleKeyDown({ key: " " })}
        >
          <span className="text-base">Shoot</span>
        </Button>
      </div>
    </div>
  );
}
