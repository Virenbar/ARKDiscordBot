import console from "console";
import QuickChart from "quickchart-js";

const qc: QuickChart = new QuickChart();
qc.setConfig({
    type: "bar",
    data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [{
            label: "Users",
            data: [50, 60, 70, 180]
        }, {
            label: "Revenue",
            data: [100, 200, 300, 400]
        }]
    }
});

console.log(qc.getUrl());
