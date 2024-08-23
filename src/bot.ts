import { Client, GatewayIntentBits, Message } from 'discord.js';
import dotenv from 'dotenv';
import { P } from './p';
dotenv.config();

const token = process.env.BOTTOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

const re = /(https?:\/\/[^\s]+)/g
client.on('messageCreate', async (message: Message) => {
    // Check if the message author is you
    if (!message.author.bot) {
        const mContent = message.content
        const match = mContent.match(re)
        if (match){
            const url = new URL(match[0])
            const p = new P()
            const u :any= await p.p(url.origin)

            
            message.channel.send(u)
        }
        // message.channel.send(`Mimic: ${message.content}`);
    }
});

client.login(token);
