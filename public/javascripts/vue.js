var branches = [
    {
        "location": "Adelaide",
        "description": "description about Adelaide branch"
    },
    {
        "location": "Sydney",
        "description": "description about Sydney branch"
    },
    {
        "location": "Auckland",
        "description": "description about Auckland branch"
    },
    {
        "location": "Miami",
        "description": "description about Miami branch"
    },
    {
        "location": "New York",
        "description": "description about New York branch"
    },
    {
        "location": "Vancouver",
        "description": "description about Vancouver branch"
    },
    {
        "location": "Madrid",
        "description": "description about Madrid branch"
    },
    {
        "location": "Kolkata",
        "description": "description about Kolkata branch"
    },
    {
        "location": "Beijing",
        "description": "description about Beijing branch"
    },
];

var mapdiv = new Vue({
    el: "#map",
    data: {
        location: "Adelaide",
        description: "description about Adelaide branch"
    },
    methods: {
        changeDetails(loc) {
            var branch = branches.find(obj => obj.location === loc);
            this.location = branch.location;
            this.description = branch.description;
        }
    }
});