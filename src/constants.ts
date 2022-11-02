export enum Common {
    Primary = "#009000",
    Green = "#417505",
    Red = "#D0021B"
}

export enum Status {
    Critical = "#FF3838",
    Serious = "#FFB302",
    Caution = "#FCE83A",
    Normal = "#56F000",
    Standby = "#2DCCFF",
    Off = "#9EA7AD"
}

// From master guild 
enum Local {
    NICK_ROLL = "<a:FA_NickRoll:957030098765230100>",
    RAT_JAM = "<a:ratJAM:957022598548553788>",
    A_ROLF = "<:aRolf:941048808563937311>",
    WHAT_PING = "<a:FA_Foxette:957029818015293531>"
}

// External only for interactions
enum External {
    FA_FoxetteShy = "<:FA_FoxetteShy:857806243532111912>"
}
export const BotEmojis = {
    Local,
    External
};

export const BotColors = {
    Common,
    Status
};
