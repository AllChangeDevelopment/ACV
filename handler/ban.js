import request from "../request.js";
import dotenv from 'dotenv'
dotenv.config({path: './secrets.env'})

export default {
    title: "ban",
    description: "Bans a user",
    args: [{name: "user", type: 6, description: "Target user", required: true},
        {name: "deletion_days", type: 4, description: "How many days of messages to delete", required: false},
        {name: "reason", type: 3, description: "Reason for unban", required: false}],
    async execute(interaction) {
        // ban user
        const params = interaction.data.options
        const user = params.find(e => e.name === "user").value
        let reason = ""
        try {reason = params.find(e => e.name === "reason").value} catch(e) { /* continue regardless */ }
        let days = 0
        try {days = params.find(e => e.name === "deletion_days").value * 86400} catch(e) { /* continue regardless */ }

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        let channel = await request(`/users/@me/channels`, "POST", {}, {recipient_id: user})
        await request(`/channels/${channel.id}/messages`, "POST", {}, {content: `You have been banned from All Change Community for the following reason: ${reason}`})// TODO add form link

        await request(`/guilds/${interaction.guild_id}/bans/${user}`, "PUT",
            {'X-Audit-Log-Reason': reason}, {delete_message_seconds: days})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: "User banned successfully."
        })
    }
}