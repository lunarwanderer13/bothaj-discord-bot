import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js"
import { Command } from "./../utils/config"

export const Ping: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!")
        .setContexts([0, 1, 2]),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: `Pong!`,
            flags: MessageFlags.Ephemeral
        })
    }
}