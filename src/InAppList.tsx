import React, { useRef, useState } from "react";

import { InApp } from "./InApp";
import styled from "styled-components";

import { MOCK_RESPONSE } from "./constants";
import { useGetSseInfo } from "./useGetSseInfo";

const StyledNotificationContent = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  right: 0%;
  padding-top: 10px;
`;

const StyledBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.2s;
`;

export const InAppList = ({ Component }: { Component: React.ReactElement }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    notifications,
    handleAddNotification,
    handleNotificationClick,
    handleRemoveNotification,
  } = useGetSseInfo();
  const [justify, setJustify] = useState("");

  const playAudio = () => {
    if (window.Notification.permission !== "granted") {
      audioRef.current?.play();
    }
  };

  const remove = (id: string, idx: number) => {
    handleRemoveNotification(id);

    if (
      (idx !== 0 && idx !== notifications.length - 1) ||
      idx === notifications.length - 1
    ) {
      setJustify("flex-start");

      setTimeout(() => {
        setJustify("");
      }, 200);
    }
  };

  const handleClick = () => {
    handleAddNotification({
      ...MOCK_RESPONSE,
      inAppId: new Date().toISOString(),
    });
    playAudio();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        style={{
          position: "fixed",
          fontSize: "50px",
          bottom: "100px",
          left: 0,
          zIndex: 10101010101,
        }}
      >
        Добавить нотификашку
      </button>
      {Component && Component}
      <button
        type="button"
        onClick={() => {
          setTimeout(() => {
            handleClick();
          }, 3000);
        }}
        style={{
          position: "fixed",
          fontSize: "50px",
          top: "100px",
          right: 0,
          zIndex: 10101010101,
        }}
      >
        Добавить отложенную нотификашку
      </button>
      <audio
        ref={audioRef}
        src="https://upload.wikimedia.org/wikipedia/commons/1/15/Bicycle-bell.wav"
        // controls
      />
      <StyledNotificationContent
        style={{ zIndex: notifications.length ? 9999 : -9999 }}
      >
        <StyledBlock
          style={{
            maxHeight: notifications.length
              ? `${notifications.length * (95 + 8) - 8}px`
              : "1px",
            justifyContent: justify || "flex-end",
          }}
        >
          {notifications.map((notification, idx) => (
            <InApp
              notification={notification}
              idx={idx}
              key={notification.inAppId}
              handleRemoveNotification={(id) => remove(id, idx)}
              handleNotificationClick={handleNotificationClick}
            />
          ))}
        </StyledBlock>
      </StyledNotificationContent>
    </>
  );
};
