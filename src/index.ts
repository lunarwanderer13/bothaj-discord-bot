import { Client, GatewayIntentBits, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction, ColorResolvable } from "discord.js"
import { Command } from "./utils/config"
import "dotenv/config"

// Import commands
import { Ping } from "./commands/ping"
import { Tarot } from "./commands/tarot"
import { Weather } from "./commands/weather"
import { Avatar } from "./commands/avatar"
import { Color } from "./commands/color"

export const Commands: Command[] = [
    Ping,
    Tarot,
    Weather,
    Avatar,
    Color
]

// Import events
import clientReady from "./events/clientReady"
import interactionCreate from "./events/interactionCreate"

export const client: Client<boolean> = new Client({
    intents: Object.values(GatewayIntentBits).filter((intent): intent is number => typeof intent === "number")
})

clientReady(client)
interactionCreate(client)

// Login with the bot
client.login(process.env.TOKEN)