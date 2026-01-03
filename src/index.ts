import { Client, GatewayIntentBits, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction, ColorResolvable } from "discord.js"
import "dotenv/config"

import { Command } from "./utils/config"

// Import commands
import { Ping } from "./commands/ping"
import { Tarot } from "./commands/tarot"

// Import events
import clientReady from "./events/clientReady"
import interactionCreate from "./events/interactionCreate"

export const client: Client<boolean> = new Client({
    intents: Object.values(GatewayIntentBits).filter((intent): intent is number => typeof intent === "number")
})

export const Commands: Command[] = [
    Ping,
    Tarot
]

clientReady(client)
interactionCreate(client)

// Login with the bot
client.login(process.env.TOKEN)