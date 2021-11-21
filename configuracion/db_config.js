const mongoose = require('mongoose');

const MongoServer = require('mongodb-memory-server').MongoMemoryServer;

MongoServer.create()
            .then(mongoServer => mongoose.connect(mongoServer.getUri(), {
                dbName: "ejercicio_3"
            }))
            .then(() => {
                console.info("Conectado a la base de datos");
            })
            .catch((error) => {
                console.error("Error conectando a la base da datos ", error);
            });

process.on("SIGINT",() => {
    mongoose.disconnect();
});