import React, { useState, useEffect } from "react";
import SpaceShip from "@/assets/spaceship.png";
import Rock from "@/assets/asteroid.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const CONTAINER_SIZE = 500;
const SHIP_SIZE = 10;
const ROCK_SIZE = 20;
const ROCK_MARGIN = 15;
const ROCK_REGION = ROCK_SIZE + 2 * ROCK_MARGIN; // 50px
const BULLET_TICK = 5; // one tick (one frame) is 5px

export default function Space() {
  // one array with 20 true
  const initialSquares = Array(20).fill(true);
  const [squares, setSquares] = useState(initialSquares);

  // the spaceship has position coordinate start from 0
  // the spaceship has size 10 * 10, 
  // the container has size 500 * 500, so the range of x is 0 to 490
  const [shipPosition, setShipPosition] = useState(0);

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
        return Math.min(prev + 1, 490);
      })
    } 
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "a" || event.key === "ArrowLeft" || event.key === "A") {
        moveShip("left");
      } else if (event.key === "d" || event.key === "ArrowRight" || event.key === "D") {
        moveShip("right");
      } else if (event.key === " ") {
        // send a bullet
        const newBullet = {
          x: shipPosition + SHIP_SIZE / 2,
          y: CONTAINER_SIZE - SHIP_SIZE,
        };

        setBullets((prevBullets) => [...prevBullets, newBullet]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
            // this bullet keeps moving, will not hit anything
            newBullets.push({ x, y });
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

    // set interval for 20 frames per second
    const interval = setInterval(moveBullets, 1000 / 20);
    return () => clearInterval(interval);

  }, [bullets.length, squares]);




  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* this is the 500 * 500px game layout */}
      <div className="relative w-[500px] aspect-square border-1 border-black">
        {/* the 20 rocks */}
        {squares.map((square, index) => (
          square && (
            <img
              src={Rock}
              alt="Rock"
              key={index}
              className="w-[20px] h-[20px] aspect-square m-[15px] object-fill absolute"
              // 10 rocks in one row
              style={{
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
            className="absolute w-[5px] aspect-square rounded-full bg-red-500"
            style={{
              left: `${bullet.x}px`,
              top: `${bullet.y}px`
            }}
          />
        ))}
      </div>
    </div>
  );
}
