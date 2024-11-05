class Island {
    constructor(name, population, resources, experiences) {
        this.name = name;
        this.population = population;
        this.resources = resources;
        this.experiences = experiences;
        this.routes = [];
    }

    addEdge(destination, time) {
        this.routes.push({ destination, time});
    }
}

class Graph {
    constructor() {
        this.islands = new Map();
    }

    addIsland(name, population, resources, experiences) {
        const island = new Island(name, population, resources, experiences);
        this.islands.set(name, island);
    }

    addEdge(from, to, time) {
        const island = this.islands.get(from);
        if (island) {
            island.addEdge(to, time);
        }
    }

    score(island, currentTime) {
        if (island.lastVisit !== -1) {
            const lastVisit = currentTime - island.lastVisit;
            return island.population / lastVisit;
        }
        return 0;
    }

    findNextIsland(currentTime) {
        const unvisited = Array.from(this.islands.values()).filter(island => island.lastVisit === -1);
        let maxScore = -Infinity;
        let nextIsland = null;

        for (const island of unvisited) {
            const score = this.score(island, currentTime);
            if (score > maxScore) {
                maxScore = score;
                nextIsland = island;
            }
        }

        return nextIsland;
    }

    knowledgeSharing(startingIslandName) {
        let currentTime = 0;
        const visitedIslands = [];

        let currentIsland = this.islands.get(startingIslandName);
        while (currentIsland) {
            currentIsland.lastVisit = currentTime;
            visitedIslands.push(currentIsland.name);
            currentTime += 1; // Increment time for each visit
            currentIsland = this.findNextIsland(currentTime);
        }

        return visitedIslands;
    }

    // Helper function for effectiveTourism
    // Find the island with the lowest weight/time
    getNearestIsland(unvisited, distances) {
        let nearestIsland = null;
        let shortestDistance = Infinity;

        for (const islandName of unvisited) {
            const distance = distances.get(islandName);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestIsland = islandName;
            }
        }
        return nearestIsland;
    }

    dijkstra(startingIsland) {
        const distances = new Map();
        const unvisited = new Set(this.islands.keys());

        for (let island of this.islands.values()) {
            distances.set(island.name, Infinity);
        }
        distances.set(startingIsland, 0);

        while (unvisited.size > 0) {
            let currentIslandName = this.getNearestIsland(unvisited, distances);
            unvisited.delete(currentIslandName);
            const currentIsland = this.islands.get(currentIslandName);

            for (const route of currentIsland.routes) {
                const { destination, time } = route;
                const newDistance = distances.get(currentIslandName) + time;

                if (newDistance < distances.get(destination)) {
                    distances.set(destination, newDistance);
                }
            }
        }

        return distances;
    }

    // Using djikstra's algorithm
    effectiveTourism(startingIsland) {
        const distances = new Map();
        const totalExperiences = new Map();
        const unvisited = new Set(this.islands.keys());

        // Initialize distances and experiences
        for (let island of this.islands.values()) {
            distances.set(island.name, Infinity);
            totalExperiences.set(island.name, new Set());
        }
        distances.set(startingIsland, 0);

        // Continue until all have been visited
        while (unvisited.size > 0) {
            // Get the current shortest unvisited island
            let currentIslandName = this.getNearestIsland(unvisited, distances);
            unvisited.delete(currentIslandName);
            const currentIsland = this.islands.get(currentIslandName);

            // Get experiences from the island and the total time
            let totalTime = 0;
            for (const experience of currentIsland.experiences) {
                totalTime += experience.time;
                totalExperiences.get(currentIslandName).add(experience);
            }

            // Explore the neighbors with total time spent
            for (const route of currentIsland.routes) {
                const { destination, time } = route;
                const newDistance = distances.get(currentIslandName) + time + totalTime;

                // If a shorter path to the neighbor exists
                if (newDistance <  distances.get(destination)) {
                    distances.set(destination, newDistance);
                    totalExperiences.set(destination, new Set(totalExperiences.get(currentIslandName)));
                }
            }
        }

        return { distances, totalExperiences };
    }
    
}

// Test Data
const graph = new Graph();
graph.addIsland("Tahiti", 190000, { shells: 1000 }, [
    { name: "Cultural Tour", time: 2 },
    { name: "Diving", time: 3 }
]);
graph.addIsland("Hawaii", 1400000, { sugar: 500 }, [
    { name: "Surfing", time: 1 },
    { name: "Hiking", time: 2 }
]);
graph.addIsland("Fiji", 900000, { coconuts: 700 }, [
    { name: "Snorkeling", time: 2 }
]);
graph.addIsland("Samoa", 200000, { fish: 300 }, [
    { name: "Beach Relaxation", time: 1 }
]);

graph.addEdge("Tahiti", "Hawaii", 5);
graph.addEdge("Tahiti", "Fiji", 10);
graph.addEdge("Hawaii", "Samoa", 2);
graph.addEdge("Fiji", "Hawaii", 3);
graph.addEdge("Fiji", "Samoa", 7);

// 4: Finding shortest paths and experiences
const result = graph.effectiveTourism("Tahiti");
console.log("Distances:", result.distances);
console.log("Experiences Collected:", result.totalExperiences);
