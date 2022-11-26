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
    A_ROLF = "<:aRolf:941048808563937311>",
    FoxetteAnnoyed = "<FoxetteAnnoyed:1045217269602594837>",
    FoxetteBan = "<:FoxetteBan:1044960330117288007>",
    FoxetteBruh = "<FoxetteBruh:1045217148714365051>",
    FoxetteEars = "<a:FoxetteEars:957029779503185990>",
    FoxetteGun = "<FoxetteGun:1045217211540840478>",
    FoxetteOwO = "<FoxetteOwO:1045217386883711017>",
    FoxetteSmug = "<FoxetteSmug:1045217436368113684>",
    FoxetteTouchTail = "<a:FoxetteTouchTail:1045217511379050547>",
    FoxetteWave = "<a:FoxetteWave:1045217902078464040>",
    FoxetteWhatDoUWant = "<a:FoxetteWhatDoUWant:957029818015293531>",
    NICK_ROLL = "<a:FA_NickRoll:957030098765230100>",
    RAT_JAM = "<a:ratJAM:957022598548553788>",
    RKN = "<:rkn:299590611038633987>",
    RainbowUwU = "<a:RainbowUwU:1044960367194943558>",
    pugDance = "<a:pugDance:1045216986180878366>",
    vicksyDance = "<a:vicksyDance:1045215825956708352>",
    vicksyLurks = "<a:vicksyLurks:1045215782952505394>"
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
