import React, { StrictMode } from "react";
import { proxy } from "valtio";
import ReactDOM from "react-dom/client";
import "./index.css";

import Game from "./components/Game.js";
import GameState from "./model/GameState.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
const gameState = proxy(new GameState());
gameState.init();
gameState.startInterval();

root.render(
  <StrictMode>
    {/* eslint-disable-next-line valtio/state-snapshot-rule */}
    <Game gameState={gameState} />
  </StrictMode>
);
