/* 
  Role Authenticator v1.0
  2018-2024 CrystaWorld. All rights reserved.

  file: src/index.ts - login to discord api
*/

import * as fs from "fs";
import * as path from "path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { load } from "js-yaml";
import config_type from "./types/config_type";
import Command_type from "./types/command";

const config = load(
  fs.readFileSync("./config_main.yml", "utf8")
) as config_type;

const client: Command_type = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
}) as Command_type;

client.on("ready", () => {
  console.log(`${client.user.tag}でログインしました。`);
});

client.login(config.Discord_API.token);

client.commands = new Collection<string, Command_type>();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`${filePath} に必要な "data" か "execute" がありません。`);
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`${interaction.commandName} が見つかりません。`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "エラーが発生しました。",
      ephemeral: true,
    });
  }
});
