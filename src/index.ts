import { Client, GatewayIntentBits, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction } from "discord.js"
import "dotenv/config"

// Import commands
import { Ping } from "./commands/ping"

// Import events
import clientReady from "./events/clientReady"
import interactionCreate from "./events/interactionCreate"

export const client: Client<boolean> = new Client({
    intents: Object.values(GatewayIntentBits).filter((intent): intent is number => typeof intent === "number")
})

export interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export const Commands: Command[] = [
    Ping
]

clientReady(client)
interactionCreate(client)

// Login with the bot
client.login(process.env.TOKEN)