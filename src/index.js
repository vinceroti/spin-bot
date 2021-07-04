require("dotenv").config();
import Discord from "discord.js";
import { sleep } from "./helpers";
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in...`);
});

const prefix = "!";
client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();
  if (command === "spin") {
    // after successfully create the play space, response to the user that call this command.
    await message.reply("Spinning...");
    await sleep(async () => {
      await message.reply("What could it be...");
    }, 2000);
    await sleep(async () => {
      await message.reply("You Got Test Game!");
    }, 2000);
  }
});

client.login(process.env.token);
