import { SlashCommandBuilder, ChatInputCommandInteraction, User, EmbedBuilder, MessageFlags, Embed } from "discord.js"
import { Command, Color } from "./../utils/config"

export const Avatar: Command = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Get the avatar of a user.")
        .setContexts([0, 1, 2])

        .addUserOption(option => option
            .setName("user")
            .setDescription("User whose avatar to get.")
            .setRequired(true)
        )

        .addBooleanOption(option => option
            .setName("censored")
            .setDescription("Whether the avatar owner's username should be censored or not.")
            .setRequired(false)
        )
        
        .addBooleanOption(option => option
            .setName("hidden")
            .setDescription("Whether the message should be hidden or not.")
            .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const user: User | null = interaction.options.getUser("user")
        const censored: boolean = interaction.options.getBoolean("censored") ?? false
        const hidden: boolean = interaction.options.getBoolean("hidden") ?? false

        if (user) {
            const avatar_embed: EmbedBuilder = new EmbedBuilder()
                .setColor(Color.primary)
                .setImage(user.avatarURL())

                let username: string = user.username.replaceAll("*", "\\*").replaceAll("_", "\\_")
                if (censored) username = username.split("").map(() => "█").join("")
                avatar_embed.setTitle(`${username}'s avatar`)

            if (!hidden) {
                await interaction.reply({ embeds: [avatar_embed] })
            } else {
                await interaction.reply({ embeds: [avatar_embed], flags: MessageFlags.Ephemeral })
            }
        } else {
            const error_embed: EmbedBuilder = new EmbedBuilder()
                .setColor(Color.accent)
                .setTitle("No user found")
                .setDescription("I wasn't able to find the user you requested, are you sure it's not your schizo gf?")

            await interaction.reply({ embeds: [error_embed], flags: MessageFlags.Ephemeral })
        }
    }
}