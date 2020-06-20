console.log(graph)

colors = [ "#5CFFFB", "#F8A4A7", "#FFFFCC", "#8AB1FF", "#DB8DFF" ]


width = 1280;
height = 720;

var svg = d3.select("#container").append('svg')
    .attr('width', width)
    .attr('height', height)

var g = svg.append('g')

//var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(function(d) {
      return d.power * 7
    }))


  var link = g.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = g.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")
    
  var circles = node.append("circle")
      .attr("r", (d) => d.power * 17 )
      .attr("stroke", (d) => { return colors[d.group]})
          

  var lables = node.append("text")
      .text(function(d) {
        return d.id;
      })
      .attr('x', 0)
      .attr('y', 0)
      .attr('class', 'labels')
      .attr('font-size', (d) => {
        return d.power * 8
      });


  node.append("title")
      .text(function(d) { return d.id; })

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  let drag_handler = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

  drag_handler(node)

  var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

  zoom_handler(svg);

  function zoom_actions(){
    g.attr("transform", d3.event.transform)
}

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}