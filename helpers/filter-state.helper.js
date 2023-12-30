module.exports = (query) => {
    const filterState = [
        {
            name: "All",
            status: "",
            class: "",
        },
        {
            name: "Active",
            status: "active",
            class: "",
        },
        {
            name: "Inactive",
            status: "inactive",
            class: "",
        },
    ];

    if (query.status) {
        const index = filterState.findIndex(
            (item) => item.status == query.status
        );
        filterState[index].class = "active";
    } else {
        filterState[0].class = "active";
    }

    return filterState;
};
