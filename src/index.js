import React, { StrictMode } from "react";
import { proxy } from "valtio";
import ReactDOM from "react-dom/client";
import "./index.css";

import Game from "./components/Game.js";
import GameState from "./model/GameState.js";

const gameState = proxy(
  new GameState(JSON.parse(localStorage.getItem("save")))
);
gameState.init();
gameState.startInterval();

window.cheat = function () {
  gameState.addMoney(100);
};
const resetSave = function () {
  localStorage.removeItem("save");
  window.location.reload();
};

const save = function () {
  localStorage.setItem("save", JSON.stringify(gameState.serialize()));
};

setInterval(save, 5000);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    {/* eslint-disable-next-line valtio/state-snapshot-rule */}
    <Game gameState={gameState} resetSave={resetSave} />
  </StrictMode>
);
