// STEP 1: Initial function
function init() {
  var dropdownMenu = d3.select("#selDataset");

  // Pull list of test subject IDs into the drop down menu
  d3.json("samples.json").then((importData) => {
      var data = importData;
      var sampleNames = data.names;
      sampleNames.forEach((name) => {
          dropdownMenu.append("option").text(name).property("value");
      });

      //Show ID 940 Demographics;
      var init_sample = data.metadata[0];
      var demo_info = d3.select("#sample-metadata");
      Object.entries(init_sample).forEach(([key, value]) => {
          demo_info.append("h5").text(`${key}: ${value}`);
      });

      // Graphs for ID 940:
      var results = data.samples[0];
      var sample_values = results.sample_values;
      var otu_ids = results.otu_ids;
      var otu_labels = results.otu_labels

      // Create Bar Chart for Test ID 940
      var sample_values_bar = sample_values.slice(0, 10).reverse();
      var otu_ids_bar = otu_ids.slice(0, 10).reverse().map(m => `OTU ${m}`);
      var otu_labels_bar = otu_labels.slice(0, 10).reverse();

      var trace1 = {
          x: sample_values_bar,
          y: otu_ids_bar,
          text: otu_labels_bar,
          type: "bar",
          orientation: "h"
      }

      var layout = {
          title: "Top 10 OTUs Found",
          margin: { t: 30, l: 120}
      }

      var data = [trace1];

      Plotly.newPlot("bar", data, layout);

      // Create Bubble Chart for Test ID 940
      var trace2 = {
          x: otu_ids,
          y: sample_values,
          marker: {
              size: sample_values,
              color: otu_ids,
          },
          text: otu_labels,
          mode: "markers"
      }

      var data2 = [trace2];

      var layout2 = {
          title: "Bacteria Cultures Per Sample",
          xaxis: {title: "OTU IDs"},
          yaxis: {
              min: 0,
              max: 230,
              stepSize: 50
          },
          margin: {t:40}
      }

      Plotly.newPlot("bubble", data2, layout2); 
     });  
}

function optionChanged(sample) {
  demographicInformation(sample);
  plots(sample);
}

init();

// Build demographic information
function demographicInformation(sample) {
  d3.json("samples.json").then((importData) => {
      var data = importData;
  
      var metadata = data.metadata;

      var demo_resultArray = metadata.filter(testSubject =>
          testSubject.id == sample);
      var demo_result = demo_resultArray[0];
      
      var demo_info = d3.select("#sample-metadata");
      demo_info.html("");
      Object.entries(demo_result).forEach(([key,value]) => {
          demo_info.append("h6").text(key + ' : ' + value + '\r');
      });
  });
}

// charts
function plots(sample) {

  // read samples.json
  d3.json("samples.json").then((importData) => {
      var data = importData;
      var plotSamples = data.samples;
      var samples_resultArray = plotSamples.filter(testSubject => 
          testSubject.id == sample); 
      var samples_result = samples_resultArray[0];
            var sampleValues = samples_result.sample_values;
      var otuIDs = samples_result.otu_ids;
      var otuLabels = samples_result.otu_labels;
      var barplots = d3.select("#bar");
      barplots.html("");
      var sampleValues_bar = sampleValues.slice(0, 10).reverse();
      var otuIDs_bar= otuIDs.slice(0, 10).reverse().map(m => `OTU ${m}`);
      var otuLabels_bar = otuLabels.slice(0, 10).reverse();
      
      var trace_bar = {
          x: sampleValues_bar,
          y: otuIDs_bar,
          text: otuLabels_bar,
          type: "bar",
          orientation: "h"
      }

      var layout_bar = {
          title: "Top 10 Bacterial Cultures Found",
          margin: { t: 30, l: 120}
      }

      var data_bar = [trace_bar];

      Plotly.newPlot("bar", data_bar, layout_bar);


      //Bubble chart
      var trace_bubble = {
          x: otuIDs,
          y: sampleValues,
          marker: {
              size: sampleValues,
              color: otuIDs
          },
          text: otuLabels,
          mode: "markers"
      }

      var data_bubble = [trace_bubble];

      var layout_bubble = {
          title: "Bacterial Cultures Per Sample",
          xaxis: {title: "OTU IDs"},
          margin: {t:40}
      }

      Plotly.newPlot("bubble", data_bubble, layout_bubble);  
  })
}
