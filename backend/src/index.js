const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const http = require("http");
const { setupWebsocket } = require("./websocket");

const app = express();
// servidor HTTP fora do express
const server = http.Server(app);

setupWebsocket(server);

// Iniciando o DB
var mongoDB =
	"mongodb+srv://fanboost:scylla123@cluster0-amajz.mongodb.net/omnistack?retryWrites=true&w=majority";
mongoose.connect(
	mongoDB,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	},
	() => {
		console.log("Database is ON!");
	}
);

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
