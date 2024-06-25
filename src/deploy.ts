import { REST, Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { load } from "js-yaml";
import config_type from "./types/config_type";

const config = load(
  fs.readFileSync("./config_main.yml", "utf8")
) as config_type;

const commands = [];
const commandFiles = fs
  .readdirSync("src/commands")
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.Discord_API.token);

(async () => {
  try {
    console.log(
      `${commands.length} 個のアプリケーションコマンドを登録します。`
    );

    const data: any = await rest.put(
      Routes.applicationCommands(config.Discord_API.clientid),
      { body: commands }
    );

    console.log(`${data.length} 個のアプリケーションコマンドを登録しました。`);
  } catch (error) {
    console.error(error);
  }
})();
