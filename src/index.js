require("dotenv").config();
import { Client, MessageEmbed } from "discord.js";
import { sleep, getList } from "./helpers";
import redis from "async-redis";
const redisClient = redis.createClient();
const discordClient = new Client();

redisClient.on("error", function (error) {
  console.error(error);
});

discordClient.on("error", function (error) {
  console.error(error);
});

discordClient.on("ready", async () => {
  console.log(`Logged in...`);
  discordClient.user.setPresence({
    status: "online",
    activity: {
      type: "LISTENING",
      name: "!spin",
    },
  });
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

  // select a random game
  if (!args.length) {
    const gameList = await getList(redisClient, serverId);
    if (!gameList)
      return message.channel.send(
        "No games exist, add them with - '!spin -add Game Title'"
      );
    await message.channel.send("Spinning...");
    await sleep(async () => {
      await message.channel.send("What could it be...");
    }, 2000);
    await sleep(async () => {
      await message.channel.send(
        `You Got ${gameList[Math.floor(Math.random() * gameList.length)]}`
      );
    }, 2000);
    return;
  }

  // list all games added
  if (args.length && args.includes("-list")) {
    const gameList = await getList(redisClient, serverId);
    if (!gameList) return message.channel.send("No games found");
    return message.channel.send(`Listing Games - ${gameList.join(", ")}`);
  }

  // add an entry
  if (args.length && args.includes("-add")) {
    const game = commandBody.split("-add ")[1];
    if (!game || !game.length) return;

    try {
      await redisClient.rpush(serverId, game);
      message.channel.send(`${game} added!`);
    } catch (e) {
      console.error(e);
      await message.channel.send(`Error - ${e}`);
    }
    return;
  }

  // delete all entries
  if (args.length && args.includes("-deleteAll")) {
    const gameList = await getList(redisClient, serverId);
    if (!gameList) return message.channel.send("No games exist");

    try {
      gameList.forEach(async (elm) => {
        await redisClient.lrem(serverId, 0, elm);
      });
      message.channel.send("Entries Successfully Deleted");
    } catch (e) {
      console.error(e);
      await message.channel.send(`Error - ${e}`);
    }
    return;
  }

  // delete an entry
  if (args.length && args.includes("-delete")) {
    const game = commandBody.split("-delete ")[1];
    if (!game || !game.length) return;
    try {
      const res = await redisClient.lrem(serverId, 0, game);
      message.channel.send(
        !res ? `No Entry Found` : `'${game}' Successfully Deleted`
      );
    } catch (e) {
      console.error(e);
      await message.channel.send(`Error - ${e}`);
    }
    return;
  }

  // list all commands
  if (args.length && args.includes("-help")) {
    const embed = new MessageEmbed()
      .setTitle("Spin Commands")
      .setColor(0xff0000)
      .addFields(
        {
          name: "!spin",
          value: "Spin the wheel!",
        },
        {
          name: "!spin -list",
          value: "List all games added to the wheel",
        },
        {
          name: "!spin -add Game",
          value: "Add a game to the wheel ex: '!spin -add Halo'",
        },
        {
          name: "!spin -delete Game",
          value: "Delete a game from the wheel ex: '!spin -delete Halo'",
        },
        {
          name: "!spin -deleteAll",
          value: "Delete all games from the wheel",
        }
      );
    return message.channel.send(embed);
  }

  // no commands found
  await message.channel.send(`Invalid spin command - Try '!spin -help'`);
});

discordClient.login(process.env.token);
