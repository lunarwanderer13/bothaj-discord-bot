import { Client, Interaction, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import { Commands } from "./../index"
import { Color } from "./../utils/config"
import "dotenv/config"

async function handleSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const slashCommand = Commands.find(command => command.data.name === interaction.commandName)

    if (!slashCommand) {
        await interaction.reply({
            content: "An error has occured",
            flags: MessageFlags.Ephemeral
        })
        return
    }

    if (interaction.user.id !== process.env.OWNER_ID) {
        const fail_embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.accent)
            .setTitle("I only listen to Luna's requests :3")
            .setDescription("We wa we wa :3\nI sent your IP to Luna :3")
            .setThumbnail("https://cdn.discordapp.com/attachments/1352287683468202075/1352294875936325672/image3.gif")

        await interaction.reply({
            embeds: [fail_embed],
            flags: MessageFlags.Ephemeral
        })
        return
    }

    await slashCommand.execute(interaction)
}

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) await handleSlashCommand(interaction)
    })
}