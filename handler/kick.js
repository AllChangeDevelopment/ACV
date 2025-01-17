import request from "../request.js";

export default {
    title: "kick",
    description: "Kicks a user out of the server",
    args: [{name: "user", type: 6, description: "Target user", required: true},
        {name: "reason", type: 3, description: "Reason for kick", required: false}],
    async execute(interaction) {
        const params = interaction.data.options
        const user = params.find(e => e.name === "user").value
        let reason = ""
        try {reason = params.find(e => e.name === "reason").value} catch(e) { reason = ""}

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        let channel = await request(`/users/@me/channels`, "POST", {}, {recipient_id: user})
        await request(`/channels/${channel.id}/messages`, "POST", {}, {content: `Your have been kicked from All Change Community for the following reason: ${reason}`})// TODO add server link

        await request(`/guilds/${interaction.guild.id}/members/${user}`, "DELETE",
            {'X-Audit-Log-Reason': reason})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: "User kicked successfully."
        })
    }
}