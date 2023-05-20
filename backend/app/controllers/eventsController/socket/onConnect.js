module.exports = (socket) => {
    socket.join("641ef47dd6a1260012acd8c7:owner");
    socket.join("641ef47dd6a1260012acd8c7:client");
    console.log("New client connected");
};