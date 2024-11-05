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
