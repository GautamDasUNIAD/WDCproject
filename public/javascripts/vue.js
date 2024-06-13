var mapdiv = new Vue({
    el: "#map",
    data: {
        branches: [],
        location: "",
        description: ""
    },
    methods: {
        addBranch(branch){
            this.branches.push(branch);
        },

        changeDetails(loc) {
            var branch = this.branches.find(obj => obj.location === loc);
            this.location = branch.location;
            this.description = branch.description;
        }
    }
});