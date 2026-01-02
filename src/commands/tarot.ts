import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import { Command } from "./../index"

export const Tarot: Command = {
    data: new SlashCommandBuilder()
        .setName("tarot")
        .setDescription("Draw tarot cards or get info about a card.")
        .setContexts([0, 1, 2])
        
        .addSubcommand(subcommand => subcommand
            .setName("draw")
            .setDescription("Draws tarot cards (default 1).")

            .addNumberOption(option => option
                .setName("cards")
                .setDescription("The number of cards to draw.")
                .setRequired(false)
            )
        )
        
        .addSubcommand(subcommand => subcommand
            .setName("info")
            .setDescription("Gets info about a tarot card.")

            .addStringOption(option => option
                .setName("card")
                .setDescription("The card to get info about.")
                .setRequired(true)
            )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand: string = interaction.options.getSubcommand()

        switch (subcommand) {
            case "draw":
                await interaction.reply("draw")
                break
            case "info":
                await interaction.reply("info")
                break
        }
    }
}