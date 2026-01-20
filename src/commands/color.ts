import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder, MessageFlags } from "discord.js"
import { Command } from "src/utils/config"
import sharp from "sharp"
import col, { ColorObject } from "color"

interface ColorRGB {
    r: number,
    g: number,
    b: number
}

interface ColorHSL {
    h: number,
    s: number,
    l: number
}

interface ColorHSV {
    h: number,
    s: number,
    v: number
}

interface ColorHWB {
    h: number,
    w: number,
    b: number
}

interface ColorLAB {
    l: number,
    a: number,
    b: number
}

async function createColor(color: ColorObject): Promise<Buffer> {
    return await sharp({ create: {
        width: 500, height: 500,
        channels: 3,
        background: color
    }}).png().toBuffer()
}

function randint(max: number = 100, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const Color: Command = {
    data: new SlashCommandBuilder()
        .setName("color")
        .setDescription("Color related commands.")
        .setContexts([0, 1, 2])

        .addSubcommand(subcommand => subcommand
            .setName("rgb")
            .setDescription("Returns a color from given red green and blue values.")

            .addNumberOption(option => option
                .setName("red")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(255)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName("green")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(255)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName("blue")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(255)
                .setRequired(true)
            )

            .addBooleanOption(option => option
                .setName("hidden")
                .setDescription("Whether the message should be hidden or not.")
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand => subcommand
            .setName("hsl")
            .setDescription("Returns a color from given hue saturation and lightness values.")

            .addNumberOption(option => option
                .setName("hue")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(360)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName("saturation")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName("lightness")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
            )

            .addBooleanOption(option => option
                .setName("hidden")
                .setDescription("Whether the message should be hidden or not.")
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand => subcommand
            .setName("hsv")
            .setDescription("Returns a color from given hue saturation and value values.")

            .addNumberOption(option => option
                .setName("hue")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(360)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName("saturation")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName("value")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
            )

            .addBooleanOption(option => option
                .setName("hidden")
                .setDescription("Whether the message should be hidden or not.")
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand => subcommand
            .setName("hwb")
            .setDescription("Returns a color from given hue whiteness and blackness values.")

            .addNumberOption(option => option
                .setName("hue")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(360)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName("whiteness")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName("blackness")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
            )

            .addBooleanOption(option => option
                .setName("hidden")
                .setDescription("Whether the message should be hidden or not.")
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand => subcommand
            .setName("lab")
            .setDescription("Returns a color from given lightness green-red and blue-yellow values.")

            .addNumberOption(option => option
                .setName("lightness")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName("green-red")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(-128)
                .setMaxValue(128)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName("blue-yellow")
                .setDescription(`The ${option.name} value of the color.`)
                .setMinValue(-128)
                .setMaxValue(128)
                .setRequired(true)
            )

            .addBooleanOption(option => option
                .setName("hidden")
                .setDescription("Whether the message should be hidden or not.")
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand => subcommand
            .setName("random")
            .setDescription("Returns a random color.")

            .addBooleanOption(option => option
                .setName("hidden")
                .setDescription("Whether the message should be hidden or not.")
                .setRequired(false)
            )
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand: string = interaction.options.getSubcommand()
        const hidden: boolean = interaction.options.getBoolean("hidden") ?? false

        const embed: EmbedBuilder = new EmbedBuilder()

        // Defaults
        let color_values: ColorRGB | ColorHSL | ColorHSV | ColorHWB | ColorLAB = {
            r: randint(255),
            g: randint(255),
            b: randint(255)
        }
        let color_type: "rgb" | "hsl" | "hsv" | "hwb" | "lab" = "rgb"

        switch (subcommand) {
            case "rgb":
                color_values = {
                    r: interaction.options.getNumber("red") ?? 255,
                    g: interaction.options.getNumber("green") ?? 255,
                    b: interaction.options.getNumber("blue") ?? 255
                }
                color_type = "rgb"
                break
            case "hsl":
                color_values = {
                    h: interaction.options.getNumber("hue") ?? 0,
                    s: interaction.options.getNumber("saturation") ?? 100,
                    l: interaction.options.getNumber("lightness") ?? 50
                }
                color_type = "hsl"
                break
            case "hsv":
                color_values = {
                    h: interaction.options.getNumber("hue") ?? 0,
                    s: interaction.options.getNumber("saturation") ?? 100,
                    v: interaction.options.getNumber("value") ?? 100
                }
                color_type = "hsv"
                break
            case "hwb":
                color_values = {
                    h: interaction.options.getNumber("hue") ?? 0,
                    w: interaction.options.getNumber("whiteness") ?? 100,
                    b: interaction.options.getNumber("blackness") ?? 100
                }
                color_type = "hwb"
                break
            case "lab":
                color_values = {
                    l: interaction.options.getNumber("lightness") ?? 100,
                    a: interaction.options.getNumber("green-red") ?? 0,
                    b: interaction.options.getNumber("blue-yellow") ?? 0
                }
                color_type = "lab"
                break
        }

        const color_image: Buffer = await createColor(col(color_values, color_type).object())
        const attachment: AttachmentBuilder = new AttachmentBuilder(color_image, { name: "color.png" })

        embed
            .setImage(`attachment://${attachment.name}`)
            .setColor(col(color_values, color_type).rgbNumber())
            .setTitle(`Here's your **${color_type}(${Object.values(color_values).join(", ")})**`)

        let description: string = ""
        for (const [key, value] of Object.entries(color_values)) {
            description += `**${key}**: ${value}\n`
        }
        if (description) embed.setDescription(description)

        if (!hidden) {
            await interaction.reply({ embeds: [embed], files: [attachment] })
        } else {
            await interaction.reply({ embeds: [embed], files: [attachment], flags: MessageFlags.Ephemeral })
        }
    }
}