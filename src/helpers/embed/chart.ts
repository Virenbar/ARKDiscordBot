import { EmbedBuilder } from "discord.js";
import { BotColors } from "../../constants.js";
import type ServerHistory from "../../services/serverHistory.js";

export function getCharts(history: ServerHistory[]) {
    const charts: EmbedBuilder[] = [];
    for (const H of history) {
        if (!H.playersChart) continue;

        // const Points: Chart.ChartPoint[] = H.players.data.map(p => ({ x: p.attributes.timestamp, y: p.attributes.max }));
        // const QC: QuickChart = new QuickChart()
        //     .setConfig({
        //         type: "line",
        //         data: {
        //             datasets: [{
        //                 data: Points,
        //                 borderColor: "#199F00",
        //                 borderWidth: 2
        //             }]
        //         },
        //         options: {
        //             legend: {
        //                 display: false
        //             },
        //             scales: {
        //                 xAxes: [{
        //                     type: "time"
        //                 }]
        //             }
        //         }
        //     });
        // const T = await QC.getShortUrl();

        const chart = new EmbedBuilder()
            .setTitle(`[${H.server.number}]${H.server.name}`)
            .setColor(H.server.isOnline ? BotColors.Common.Green : BotColors.Common.Red)
            .setImage(H.playersChart);
        charts.push(chart);
    }
    return charts;
}
