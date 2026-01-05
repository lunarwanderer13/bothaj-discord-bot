import { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder, MessageFlags } from "discord.js"
import { Command, Color, Emoji, Emojis } from "./../utils/config"
import fs from "fs"
import sharp from "sharp"

interface TarotCard {
    name: string
    type: "major_arcana" | "minor_arcana"
    upright_meaning: string,
    reversed_meaning: string,
    query: string
}

interface MajorArcana extends TarotCard {
    type: "major_arcana",
    number: string
}

interface MinorArcana extends TarotCard {
    type: "minor_arcana",
    suit: string,
    element: string
}

export const Tarot: Command = {
    data: new SlashCommandBuilder()
        .setName("tarot")
        .setDescription("Draw tarot cards or get info about a card.")
        .setContexts([0, 1, 2])
        
        .addSubcommand(subcommand => subcommand
            .setName("draw")
            .setDescription("Draws a tarot card.")

            .addStringOption(option => option
                .setName("range")
                .setDescription("Which arcana should be used drawn.")
                .addChoices(
                    { name: "Major Arcana", value: "major" },
                    { name: "Minor Arcana", value: "minor" },
                    { name: "Full Deck", value: "both" }
                )
                .setRequired(false)
            )

            .addStringOption(option => option
                .setName("face")
                .setDescription("Which way should the cards face.")
                .addChoices(
                    { name: "Upright", value: "upright" },
                    { name: "Reversed", value: "reversed" },
                    { name: "Any", value: "both" }
                )
                .setRequired(false)
            )

            .addBooleanOption(option => option
                .setName("hidden")
                .setDescription("Whether the message should be hidden or not.")
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

            .addBooleanOption(option => option
                .setName("hidden")
                .setDescription("Whether the message should be hidden or not.")
                .setRequired(false)
            )
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const major_cards: MajorArcana[] = JSON.parse(fs.readFileSync("src/source/tarot/jsons/major.json", "utf-8"))
        const minor_cards: MinorArcana[] = JSON.parse(fs.readFileSync("src/source/tarot/jsons/minor.json", "utf-8"))
        const all_cards: (MajorArcana | MinorArcana)[] = [...major_cards, ...minor_cards]

        const subcommand: string = interaction.options.getSubcommand()
        const hidden: boolean = interaction.options.getBoolean("hidden") ?? false

        const cards_emoji: Emoji | undefined = Emojis.find(emoji => emoji.name === "cards")
        if (!cards_emoji) return
        const cards_emoji_string: string = `<:${cards_emoji.name}:${cards_emoji.id}>`

        switch (subcommand) {
            case "draw":
                const range: string = interaction.options.getString("range") ?? "major"
                const face: string = interaction.options.getString("face") ?? "both"
                let reversed: boolean = false

                let drawn_card: MajorArcana | MinorArcana | undefined
                if (range === "major") drawn_card = major_cards[Math.floor(Math.random() * major_cards.length)]
                if (range === "minor") drawn_card = minor_cards[Math.floor(Math.random() * minor_cards.length)]
                if (range === "both") drawn_card = all_cards[Math.floor(Math.random() * all_cards.length)]
                if (!drawn_card) break

                if (face === "upright") reversed = false
                if (face === "reversed") reversed = true
                if (face === "both") reversed = Math.random() <= 0.333

                const draw_embed: EmbedBuilder = new EmbedBuilder()
                    .setColor(Color.primary)

                const drawn_image_buffer = await sharp(`src/source/tarot/images/${drawn_card.type}/${drawn_card.query}.png`)
                if (reversed) drawn_image_buffer.rotate(180)
                drawn_image_buffer.png().toBuffer()

                const drawn_image_attachment = new AttachmentBuilder(drawn_image_buffer, { name: `${drawn_card.query.replaceAll(" ", "_")}.png` })
                draw_embed.setImage(`attachment://${drawn_image_attachment.name}`)

                if (drawn_card.type === "major_arcana") draw_embed.setTitle(`:sparkles: I draw... ${drawn_card.name} ${cards_emoji_string}`)
                if (drawn_card.type === "minor_arcana") draw_embed.setTitle(`:sparkles: I draw... the ${drawn_card.name} of ${drawn_card.suit} ${cards_emoji_string}`)

                if (!hidden) {
                    await interaction.reply({ embeds: [draw_embed], files: [drawn_image_attachment] })
                } else {
                    await interaction.reply({ embeds: [draw_embed], files: [drawn_image_attachment], flags: MessageFlags.Ephemeral })
                }
                break
            case "info":
                const card_option: string | null = interaction.options.getString("card")
                if (!card_option) break
                const card = all_cards.find(card => card_option.includes(card.query))
                if (!card) {
                    await interaction.reply({ content: "I couldn't find the card you asked for, sorry!", flags: MessageFlags.Ephemeral })
                    break
                }

                const info_embed: EmbedBuilder = new EmbedBuilder()
                    .setColor(Color.primary)

                const info_image_buffer = await sharp(`src/source/tarot/images/${card.type}/${card.query}.png`)
                    .png()
                    .toBuffer()

                const info_image_attachment = new AttachmentBuilder(info_image_buffer, { name: `${card.query.replaceAll(" ", "_")}.png` })
                info_embed.setImage(`attachment://${info_image_attachment.name}`)

                info_embed.setFields(
                    {
                        "name": "Upright meaning:",
                        "value": card.upright_meaning,
                        "inline": true
                    },
                    {
                        "name": "Reversed meaning:",
                        "value": card.reversed_meaning,
                        "inline": true
                    }
                )

                if (card.type === "major_arcana") {
                    info_embed.setTitle(`:sparkles: Info about ${card.name} card ${cards_emoji_string}`)
                }

                if (card.type === "minor_arcana") {
                    const element_emoji: Emoji | undefined = Emojis.find(emoji => emoji.name === card.element)
                    if (!element_emoji) break
                    const element_emoji_string: string = `<:${element_emoji.name}:${element_emoji.id}>`

                    info_embed.setTitle(`:sparkles: Info about the ${card.name} of ${card.suit} card ${cards_emoji_string}`)
                    info_embed.addFields(
                        {
                            "name": "Element:",
                            "value": `${card.element.charAt(0).toUpperCase()}${card.element.slice(1)} ${element_emoji_string}`,
                            "inline": false
                        }
                    )
                }

                if (!hidden) {
                    await interaction.reply({ embeds: [info_embed], files: [info_image_attachment] })
                } else {
                    await interaction.reply({ embeds: [info_embed], files: [info_image_attachment], flags: MessageFlags.Ephemeral })
                }
                break
        }
    }
}