import { SlashCommandBuilder, CommandInteraction } from "discord.js";

interface Command {
  data: SlashCommandBuilder;
  execute(interaction: CommandInteraction): void;
}

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pongを返します"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

export default command;
