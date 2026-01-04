import {
    SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction,
    ColorResolvable
} from "discord.js"

export interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export const Color: {primary: ColorResolvable, accent: ColorResolvable} = {
    primary: "#1a699a",
    accent: "#a1b2c3"
}

export type Emoji = {
    id: string,
    name: string
}

export const Emojis: Emoji[] = [
    {
        id: "1457168651407982663",
        name: "fire"
    },
    {
        id: "1457168759444865134",
        name: "water"
    },
    {
        id: "1457168813001932875",
        name: "air"
    },
    {
        id: "1457168822598631688",
        name: "earth"
    },
    {
        id: "1457175965515120803",
        name: "cards"
    }
]