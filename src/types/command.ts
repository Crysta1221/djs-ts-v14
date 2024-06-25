import type {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  Collection,
} from "discord.js";

export default interface Command_type extends Client {
  commands: Collection<string, Command_type>;
}
