require("dotenv").config();
import Discord from "discord.js";
import { sleep } from "./helpers";
import redis from "async-redis";
const redisClient = redis.createClient();
const discordClient = new Discord.Client();

redisClient.on("error", function (error) {
  console.error(error);
});

discordClient.on("error", function (error) {
  console.error(error);
});

discordClient.on("ready", () => {
  console.log(`Logged in...`);
});

const prefix = "!";
discordClient.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.guild)
    return message.channel.send(
      "This bot currently only supports commands sent within a channel"
    );

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();
  const serverId = message.guild.id;

  if (command !== "spin") return;

  if (!args.length) {
    // after successfully create the play space, response to the user that call this command.
    const gameList = await redisClient.get(serverId);
    if (!gameList)
      return message.channel.send(
        "No games exist, add them with - '!spin -add Game Title'"
      );
    await message.channel.send("Spinning...");
    await sleep(async () => {
      await message.channel.send("What could it be...");
    }, 2000);
    await sleep(async () => {
      await message.channel.send("You Got Test Game!");
    }, 2000);
    return;
  }

  if (args.length && args.includes("-list")) {
    const gameList = await redisClient.get(serverId);
    if (!gameList) return message.channel.send("No games found");
    return message.channel.send(`Listing Games - ${gameList}`);
  }

  if (command === "spin" && args.length && args.includes("-add")) {
    const game = commandBody.split("-add ")[1];
    if (!game || !game.length) return;
    let arr = [];
    const gameList = await redisClient.get(serverId);
    if (gameList) arr = gameList;

    try {
      arr.push(game);
      await redisClient.set(serverId, arr);
      message.channel.send(`${game} added!`);
    } catch (err) {
      await message.channel.send(`Error - ${err}`);
      console.error(err);
    }
  }
});

discordClient.login(process.env.token);
