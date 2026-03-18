import React, { useEffect, useState } from "react";
import "./App.css";
import { InAppList } from "./InAppList";

const List = () => <div>GELLO</div>;

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const handleAuth = () => {
    window.Notification.requestPermission().then((perm) => {
      setIsAuth(true);
      alert(`Permission is: ${perm}`);
    });
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      console.log("1");
      navigator.serviceWorker.ready.then((reg) => {
        console.log("2");
        reg.active?.postMessage({
          type: "SW:SendUnpUrl",
          payload: "https://push-online.if.test.vtb.ru",
        });
      });
    }
  }, []);

  return (
    <div className="App">
      {isAuth ? (
        <InAppList Component={<div>{List()}</div>} />
      ) : (
        <button style={{ marginTop: 150 }} onClick={handleAuth}>
          АВТОРИЗОВАТЬСЯ
        </button>
      )}
    </div>
  );
}

export default App;
