import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, Embed } from "discord.js"
import { Command, Color } from "./../utils/config"
import axios from "axios"

interface CurrentWeather {
    error: false,
    location: {
        name: string,
        region: string | undefined,
        country: string,
        lat: number,
        lon: number,
        tz_id: string,
        localtime: string
    },
    current: {
        temp_c: number,
        temp_f: number,
        is_day: boolean,
        condition: {
            text: string,
            icon: string,
            code: number
        },
        wind_mph: number,
        wind_kph: number,
        wind_degree: number,
        wind_dir: number,
        pressure_mb: number,
        pressure_in: number,
        precip_mm: number,
        precip_in: number,
        humidity: number,
        cloud: number,
        feelslike_c: number,
        feelslike_f: number,
        windchill_c: number,
        windchill_f: number
    }
}

interface Error {
    error: true
    code: number,
    message: string
}

export const Weather: Command = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Get weather info.")
        .setContexts([0, 1, 2])
        
        .addStringOption(option => option
            .setName("query")
            .setDescription("City name, US zip, UK postcode or Canada postal code")
            .setRequired(true)
        )

        .addStringOption(option => option
            .setName("language")
            .setDescription("Language of the response")
            .addChoices(
                { name: "English (default)", value: "en" },
                { name: "Czech", value: "cs" },
                { name: "Dutch", value: "nl" },
                { name: "Finnish", value: "fi" },
                { name: "French", value: "fr" },
                { name: "German", value: "de" },
                { name: "Greek", value: "el" },
                { name: "Italian", value: "it" },
                { name: "Japanese", value: "ja" },
                { name: "Korean", value: "ko" },
                { name: "Mandarin", value: "zh_cmn" },
                { name: "Polish", value: "pl" },
                { name: "Russian", value: "ro" },
                { name: "Spanish", value: "es" },
                { name: "Swedish", value: "sv" },
                { name: "Turkish", value: "tr" },
                { name: "Ukrainian", value: "uk" }
            )
            .setRequired(false)
        )
        
        .addBooleanOption(option => option
            .setName("hidden")
            .setDescription("Whether the message should be hidden or not.")
            .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const query: string = interaction.options.getString("query") ?? "auto:ip"
        const language: string = interaction.options.getString("language") ?? "en"
        const hidden: boolean = interaction.options.getBoolean("hidden") ?? false

        const response = await axios.get<CurrentWeather | Error>(
            "https://api.weatherapi.com/v1/current.json",
            {
                params: {
                    key: process.env.WEATHER_API,
                    q: query,
                    lang: language
                }
            }
        )

        if (!response.data.error) {
            const location = response.data.location
            const current = response.data.current

            let title: string = location.name
            if (location.region) title += `, ${location.region}`
            title += `, ${location.country} `

            const weather_embed: EmbedBuilder = new EmbedBuilder()
                .setColor(Color.primary)
                .setTitle(title)
                .setThumbnail(`https:${current.condition.icon}`)
                .addFields(
                    { name: "Weather", value: current.condition.text, inline: false },
                    { name: "Temperature", value: `${current.temp_c}℃ / ${current.temp_f}℉`, inline: true},
                    { name: "Wind", value: `${current.wind_kph}kph / ${current.wind_mph}mph ${current.wind_dir}`, inline: true},
                    { name: "Pressure", value: `${current.pressure_mb}hPa / ${current.pressure_in}inHg`, inline: true},
                    { name: "Precipitation", value: `${current.precip_mm}mm / ${current.precip_in}in`, inline: true},
                    { name: "Humidity", value: `${current.humidity}%`, inline: true},
                    { name: "Clouds", value: `${current.cloud}%`, inline: true}
                )

            if (!hidden) {
                await interaction.reply({ embeds: [weather_embed] })
            } else {
                await interaction.reply({ embeds: [weather_embed], flags: MessageFlags.Ephemeral })
            }
        } else {
            const error_embed: EmbedBuilder = new EmbedBuilder()
                .setColor(Color.accent)
                .setTitle(`Error code ${response.data.code}: ${response.data.error}`)
                .setDescription(response.data.message)

            interaction.reply({ embeds: [error_embed], flags: MessageFlags.Ephemeral })
        }
    }
}