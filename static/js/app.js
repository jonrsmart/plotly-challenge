var url = "data/samples.json"

function samplesPlot(id) {
    d3.json(url).then(function(data) {
        console.log(data);
        // Get information for sample by ID
        var samples = data.samples.filter(d => Number(d.id) === id)[0];
        console.log(samples);

        // Get top 10 information for individual
        var top_ten = samples.otu_ids.slice(0,10).reverse();
        var labels = samples.otu_labels.slice(0,10).reverse();
        var otu_values = samples.sample_values.slice(0,10).reverse();
        var otu_name = top_ten.map(d => `OTU ${d}`);
        console.log(top_ten);
        console.log(otu_name);
// Bar Chart       
        var bartrace = {
            x: otu_values,
            y: otu_name,
            text: labels,
            marker: {
                color: "red"},
            type: "bar",
            orientation: "h"
        };

        var barData = [bartrace];

        var layout = {
            title: `Test Subject ${id} Top 10 OTU's`,
            yaxis:{
                tickmode:"linear",
            },
        };

        Plotly.newPlot("bar", barData, layout);
// Bubble Chart
        var bubbleTrace = {
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids
        },
        text: samples.otu_labels
    }
    var bubble_layout = {
        title: `Test Subject ${id} Microbial Data`,
        height: 600,
        width: 1200
    }
    var bubbleData = [bubbleTrace]

    Plotly.newPlot("bubble", bubbleData, bubble_layout)
    })};

//call metadata section for demographic information and gauge chart
function getMeta(id){
    d3.json(url).then(function(data) {
        var metaData = data.metadata.filter(d => Number(d.id) === id)[0];
        console.log(metaData);
        var washing = metaData.wfreq;
        console.log(washing);
//Gauge chart
    var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseInt(washing),
          title: { text: `Test Subject ${id} Weekly Wash Frequency` },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            bar: { color: "purple"},
            steps: [
              { range: [0, 1], color: "red" },
              { range: [1, 3], color: "orange" },
              { range: [3, 6], color: "yellow" },
              { range: [6, 8], color: "green" },
              { range: [8, 9], color: "blue" },
            ]
          }
        }
      ];
    Plotly.newPlot("gauge", gaugeData);
    var info = d3.select("#sample-metadata");
    info.html("");
    Object.entries(metaData).forEach((key) =>{
        info.append("p").text(`${key[0]} : ${key[1]}`);
    })
});
}
//on dropdown change
function optionChanged(id){
    samplesPlot(parseInt(id));
    getMeta(parseInt(id));
}
// Load initial data
function init() {
    //select dropwdown menu
    var menu = d3.select("#selDataset");
    //load initial data
    d3.json(url).then(function(data) {
        //populate drop down options
        data.names.forEach(subject => menu.append("option").text(Number(subject)).property("value"))
        samplesPlot(Number(data.names[35]))
        getMeta(Number(data.names[35]))});

}
//call initial function
init();
