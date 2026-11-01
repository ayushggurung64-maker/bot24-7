"use strict";

const { addLog, getLogs } = require("./logger");
const mineflayer = require("mineflayer");
const { Movements, pathfinder, goals } = require("mineflayer-pathfinder");
const { GoalBlock } = goals;
const config = require("./settings.json");
const express = require("express");
const http = require("http");
const https = require("https");

function resolveMinecraftVersion(rawVersion) {
  if (rawVersion === undefined || rawVersion === null) return false;

  const value = String(rawVersion).trim();
  if (!value || value.toLowerCase() === "auto" || value.toLowerCase() === "false") {
    return false;
  }

  const normalized = value.toLowerCase().replace(/\s+/g, "");

  // Common ProtocolLib / server metadata values like "26.3" are not valid Mineflayer versions.
  // Map them to the nearest actual Minecraft version that Mineflayer accepts.
  if (normalized === "26.3" || normalized === "26.3.0" || normalized === "protocollib26.3" || normalized === "protocollib:26.3") {
    return "1.20.4";
  }

  // Accept already-correct versions such as "1.20.4" and "1.20".
  if (/^1\d*\.\d+(?:\.\d+)?$/.test(value) || /^\d+\.\d+$/.test(value)) {
    return value;
  }

  return value;
}

// ============================================================
// EXPRESS SERVER - Keep Render/Aternos alive
// ============================================================
const app = express();
