import React, { useEffect, useRef, useState } from "react";
import { Box } from "reflexbox/styled-components";
import styled from "styled-components/macro";
import { InAppType } from "./types";

// расстояние для определения направления свайпа
const MIN_SWIPE_DISTANCE = 100;
const MAX_HEIGHT = 95;
const MAX_LETTERS = 134;

type Props = {
  notification: InAppType;
  idx: number;
  handleNotificationClick: () => void;
  handleRemoveNotification: (id: string) => void;
};

type Direction = "h" | "v" | null;

const StyledBlock = styled.button<{
  $touchEndX: number;
  $touchEndY: number;
  $direction: Direction;
  $idx: number;
}>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  text-align: left;
  width: 96%;
  margin: 0 auto;
  padding: 12px 8px;
  border-radius: 16px;
  transition: 0.125s;
  max-height: ${MAX_HEIGHT}px;
  transform: ${({ $touchEndX, $touchEndY, $direction }) => {
    if ($direction === "v") {
      return `translateY(${$touchEndY}px)`;
    }

    if ($direction === "h") {
      return `translateX(${$touchEndX}px)`;
    }
  }};
  margin-bottom: 8px;
  border: none;

  &:last-child {
    margin: 0;
  }
`;

export const InApp = ({
  notification,
  idx,
  handleNotificationClick,
  handleRemoveNotification,
}: Props) => {
  const inappRef = useRef<HTMLButtonElement>(null);
  const { body, inAppId, title } = notification;
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const [direction, setDirection] = useState<Direction>(null);

  const messageString =
    body.length > MAX_LETTERS ? `${body.slice(0, MAX_LETTERS)}...` : body;

  const handleTouchStart = (e: React.TouchEvent) => {
    document.documentElement.style.touchAction = "none";
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
    setDirection(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (evt: React.TouchEvent) => {
    if (!touchStartX || !touchStartY) {
      return; // Если изначальные координаты не зафиксированы, прекращаем выполнение
    }

    const { clientX, clientY } = evt.touches[0];

    const xDiff = touchStartX - clientX;
    const yDiff = touchStartY - clientY;

    // Вычисляем, был ли свайп выполнен по горизонтали или вертикали
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      setDirection("h");
    } else {
      setDirection("v");
    }

    if (direction) {
      if (direction === "h") {
        setTouchEndX(clientX - touchStartX);
      } else if (direction === "v" && clientY <= touchStartY) {
        // вертикальный свайп только вверх
        setTouchEndY(clientY - touchStartY);
      }
    }
  };

  const handleTouchEnd = () => {
    if (direction === "v") {
      if (-touchEndY < MIN_SWIPE_DISTANCE / 2) {
        setTouchEndY(0);
      } else {
        setTouchEndY(-200);
        setTimeout(() => {
          handleRemoveNotification(inAppId);
        }, 200);
      }
    } else {
      const isLeftSwipe = touchEndX < 0;
      const isRightSwipe = touchEndX > 0;

      if (isLeftSwipe) {
        if (touchEndX > -MIN_SWIPE_DISTANCE) {
          setTouchEndX(0);
        } else {
          setTouchEndX(-500);
          setTimeout(() => {
            handleRemoveNotification(inAppId);
          }, 200);
        }
      }
      if (isRightSwipe) {
        if (touchEndX < MIN_SWIPE_DISTANCE) {
          setTouchEndX(0);
        } else {
          setTouchEndX(500);
          setTimeout(() => {
            handleRemoveNotification(inAppId);
          }, 200);
        }
      }
    }
  };

  useEffect(() => {
    if (inappRef.current) inappRef.current.focus();

    setTimeout(() => {
      inappRef.current?.blur();
    }, +notification.inAppParameters.timeKeep * 1000 - 100);
  }, [inappRef, notification]);

  return (
    <StyledBlock
      $touchEndX={touchEndX}
      $touchEndY={touchEndY}
      $direction={direction}
      $idx={idx}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleNotificationClick}
      ref={inappRef}
    >
      <Box>
        <div>{notification.title}</div>
        <div>{messageString}</div>
      </Box>
    </StyledBlock>
  );
};
