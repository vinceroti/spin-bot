"use strict";

var _discord = require("discord.js");

var _discord2 = _interopRequireDefault(_discord);

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();

var client = new _discord2.default.Client();

client.on("ready", function () {
  console.log("Logged in...");
});

var prefix = "!";
client.on("message", async function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  var commandBody = message.content.slice(prefix.length);
  var args = commandBody.split(" ");
  var command = args.shift().toLowerCase();
  if (command === "spin") {
    // after successfully create the play space, response to the user that call this command.
    await message.reply("Spinning...");
    await (0, _helpers.sleep)(async function () {
      await message.reply("What could it be...");
    }, 2000);
    await (0, _helpers.sleep)(async function () {
      await message.reply("You Got Test Game!");
    }, 2000);
  }
});

client.login(process.env.token);