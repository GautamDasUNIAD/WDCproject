var branches = [
    {
        "location": "Adelaide",
        "description": "The Adelaide branch of our volunteering organization is committed to enhancing community well-being through a variety of impactful programs and initiatives. Nestled in this vibrant city, our branch focuses on addressing local challenges such as food security, environmental sustainability, and social inclusion. Our dedicated volunteers work hand-in-hand with local partners to provide essential services, support vulnerable populations, and promote community resilience. By fostering a spirit of collaboration and compassion, we strive to create a positive and lasting difference in the lives of Adelaide residents. We invite individuals from all backgrounds to join us in our mission to build a stronger, more connected community."
    },
    {
        "location": "Sydney",
        "description": "The Sydney branch of our volunteering organization is dedicated to empowering the local community through a wide range of initiatives and programs. Situated in Australia's largest city, our branch addresses critical issues such as homelessness, environmental conservation, and youth education. Our enthusiastic volunteers collaborate with local partners to deliver essential services, support marginalized groups, and foster sustainable practices. By encouraging community involvement and promoting social cohesion, we aim to create a lasting, positive impact on the lives of Sydney residents. We welcome individuals from all backgrounds to join our efforts in building a more inclusive and resilient community."
    },
    {
        "location": "Auckland",
        "description": "The Auckland branch of our volunteering organization is devoted to enriching the local community through diverse programs and initiatives. Located in New Zealand's largest city, our branch focuses on key areas such as poverty alleviation, environmental protection, and educational support. Our passionate volunteers work closely with local partners to provide vital services, uplift vulnerable populations, and promote sustainable development. Through fostering a spirit of unity and active participation, we strive to make a meaningful and lasting difference in the lives of Auckland residents. We invite individuals from all walks of life to join us in our mission to create a stronger, more connected community."
    },
    {
        "location": "Miami",
        "description": "The Miami branch of our volunteering organization is dedicated to fostering community engagement and support through a diverse array of programs and initiatives. Located in the heart of the city, our branch works tirelessly to address local needs, ranging from food distribution and homeless outreach to environmental conservation and youth mentoring. Our passionate team of volunteers collaborates with local partners to create meaningful impact, ensuring that every effort contributes to the well-being and development of the Miami community. We welcome individuals from all walks of life to join us in making a positive difference and strengthening the bonds that unite us."
    },
    {
        "location": "New York",
        "description": "The New York branch of our volunteering organization is committed to making a significant impact in the community through a wide array of programs and initiatives. Situated in one of the world's most dynamic cities, our branch addresses pressing issues such as homelessness, food insecurity, and educational inequality. Our dedicated volunteers partner with local organizations to deliver crucial services, support underserved populations, and foster a sense of community. By promoting volunteerism and social responsibility, we aim to create lasting positive change in the lives of New Yorkers. We welcome individuals from all backgrounds to join us in our mission to build a more inclusive and resilient city."
    },
    {
        "location": "Vancouver",
        "description": "The Vancouver branch of our volunteering organization is dedicated to enhancing community well-being through a variety of impactful programs and initiatives. Nestled in the vibrant and diverse city of Vancouver, our branch addresses critical issues such as homelessness, environmental sustainability, and youth mentorship. Our passionate volunteers collaborate with local partners to provide essential services, support vulnerable populations, and promote community resilience. By fostering a spirit of compassion and cooperation, we strive to create a positive and lasting difference in the lives of Vancouver residents. We invite individuals from all backgrounds to join us in our mission to build a stronger, more connected community."
    },
    {
        "location": "Madrid",
        "description": "The Madrid branch of our volunteering organization is dedicated to improving the quality of life in the community through a wide range of impactful programs and initiatives. Located in Spain's vibrant capital, our branch focuses on addressing key issues such as poverty, social inclusion, and environmental sustainability. Our committed volunteers work alongside local partners to provide essential services, support marginalized groups, and foster a sense of community. By encouraging active participation and promoting solidarity, we aim to create lasting positive change in the lives of Madrid residents. We welcome individuals from all walks of life to join us in our mission to build a more inclusive and resilient community."
    },
    {
        "location": "Kolkata",
        "description": "The Kolkata branch of our volunteering organization is dedicated to uplifting the local community through a variety of impactful programs and initiatives. Situated in the cultural heart of India, our branch focuses on addressing critical issues such as poverty alleviation, education, and healthcare. Our dedicated volunteers work in close partnership with local organizations to provide essential services, support vulnerable populations, and promote sustainable development. By fostering a spirit of unity and compassion, we strive to make a meaningful and lasting difference in the lives of Kolkata residents. We invite individuals from all backgrounds to join us in our mission to create a stronger, more connected community."
    },
    {
        "location": "Beijing",
        "description": "The Beijing branch of our volunteering organization is committed to enhancing community well-being through a diverse array of impactful programs and initiatives. Located in China's historic capital, our branch addresses pressing issues such as poverty reduction, environmental conservation, and educational support. Our dedicated volunteers collaborate with local partners to deliver essential services, uplift disadvantaged groups, and foster community resilience. By promoting volunteerism and social responsibility, we aim to create a lasting, positive impact on the lives of Beijing residents. We welcome individuals from all walks of life to join us in our mission to build a more inclusive and sustainable community."
    },
];

var mapdiv = new Vue({
    el: "#map",
    data: {
        location: "Adelaide",
        description: "The Adelaide branch of our volunteering organization is committed to enhancing community well-being through a variety of impactful programs and initiatives. Nestled in this vibrant city, our branch focuses on addressing local challenges such as food security, environmental sustainability, and social inclusion. Our dedicated volunteers work hand-in-hand with local partners to provide essential services, support vulnerable populations, and promote community resilience. By fostering a spirit of collaboration and compassion, we strive to create a positive and lasting difference in the lives of Adelaide residents. We invite individuals from all backgrounds to join us in our mission to build a stronger, more connected community."
    },
    methods: {
        changeDetails(loc) {
            var branch = branches.find(obj => obj.location === loc);
            this.location = branch.location;
            this.description = branch.description;
        }
    }
});