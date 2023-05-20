FROM mongo

# Start MongoDB as a replica set
CMD ["mongod", "--replSet", "ordersReplicaSet"]

# Wait for MongoDB to start
HEALTHCHECK CMD mongo --eval "printjson(db.adminCommand('ping'))" || exit 1

# Initialize the replica set
RUN sleep 5 && mongosh --eval 'rs.initiate({_id: "ordersReplicaSet", version: 1, members: [{ _id: 0, host : "localhost:27017" }]})'
