document.addEventListener('DOMContentLoaded', function() {
    // Load nodes and edges from localStorage
    var savedNodes = JSON.parse(localStorage.getItem('nodes')) || [];
    var savedEdges = JSON.parse(localStorage.getItem('edges')) || [];

    var nodes = new vis.DataSet(savedNodes);
    var edges = new vis.DataSet(savedEdges);

    // Save nodes and edges to localStorage on change
    nodes.on('*', function () {
        localStorage.setItem('nodes', JSON.stringify(nodes.get()));
    });

    edges.on('*', function () {
        localStorage.setItem('edges', JSON.stringify(edges.get()));
    });

    var container = document.getElementById('network');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};
    var network = new vis.Network(container, data, options);

    document.getElementById('entityForm').onsubmit = function(event) {
        event.preventDefault();
        var name = document.getElementById('name').value;
        var type = document.getElementById('type').value;
        var description = document.getElementById('description').value;

        // Create a new node
        var newNode = {
            id: nodes.length + 1, // Simple ID generation
            label: name + ' (' + type + ')',
            type: type,
            description: description
        };

        console.log('Adding node:', newNode);

        // Add the new node to the dataset
        nodes.add(newNode);

        // Clear the form
        document.getElementById('entityForm').reset();
    };

    var selectedNodes = [];

    network.on("click", function (params) {
        if (params.nodes.length > 0) {
            var nodeId = params.nodes[0];
            var node = nodes.get(nodeId);

            // Add node to selected nodes for linking
            if (!selectedNodes.includes(nodeId)) {
                selectedNodes.push(nodeId);
            }

            // If two nodes are selected, create a link
            if (selectedNodes.length === 2) {
                var fromNode = selectedNodes[0];
                var toNode = selectedNodes[1];

                // Create an edge between the two nodes
                edges.add({from: fromNode, to: toNode});
                console.log('Link created between:', fromNode, toNode);

                // Clear selected nodes
                selectedNodes = [];
            }
        }
    });
});