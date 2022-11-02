import { EventHandler, Logger } from "./index.js";

const Event: EventHandler<"messageReactionAdd"> = {
    event: "messageReactionAdd",
    async execute(reaction, user) {
        Logger.debug(`Reaction: ${user.tag} ~ ${reaction.emoji.name}`);
    }
};
export default Event;
