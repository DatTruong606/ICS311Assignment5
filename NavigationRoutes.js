// Create an adjacency list for each islands and its routes
function adjList(islands, routes) {
  let graph = {};

  islands.forEach(island => {
    graph[island] = [];
  })

  routes.forEach(route => {
    let { src, dest, time } = route;
    routes.forEach(route => {
      graph[src].push({dest, time});
    });
  });

  return graph;
}
