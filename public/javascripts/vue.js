/* global Vue */ // Declares that Vue is a global variable to prevent linting errors

// Create a new Vue instance
var mapdiv = new Vue({
    el: "#map", // Bind this instance to the element with the id 'map'
    data: {
        branches: [], // Array to store branch information
        location: "", // Variable to store the current branch location
        description: "" // Variable to store the current branch description
    },
    methods: {
        // Method to add a new branch to the branches array
        addBranch(branch) {
            this.branches.push(branch); // Add the branch to the branches array
        },
        // Method to change the location and description based on the clicked branch
        changeDetails(loc) {
            var branch = this.branches.find(obj => obj.location === loc); // Find the branch with the matching location
            this.location = branch.location; // Update the location data
            this.description = branch.description; // Update the description data
        }
    }
});
