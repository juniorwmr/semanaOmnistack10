const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections } = require("../websocket");
const { sendMessage } = require("../websocket");

module.exports = {
	async index(req, res) {
		const devs = await Dev.find();
		return res.json(devs);
	},
	async store(req, res) {
		const { github_username, techs, latitude, longitude } = req.body;

		let dev = await Dev.findOne({ github_username });
		if (!dev) {
			const apiResponse = await axios.get(
				`https://api.github.com/users/${github_username}`
			);
			const { name = login, bio, avatar_url } = apiResponse.data;

			const techsArray = parseStringAsArray(techs);

			const location = {
				type: "Point",
				coordinates: [longitude, latitude]
			};

			dev = await Dev.create({
				github_username,
				name,
				avatar_url,
				bio,
				techs: techsArray,
				location
			});

			// filtrar as conexões que estão no máximo 10km de
			// distância e que o novo deve tenha pelo menos
			// uma das tecnologias filtradas
			const sendSocketMessageTo = findConnections(
				{ latitude, longitude },
				techsArray
			);

			console.log(sendSocketMessageTo);
			sendMessage(sendSocketMessageTo, "new-dev", dev);
		}

		return res.json(dev);
	},
	// UPDATE através do github_username
	async update(req, res) {
		const { github_username } = req.params;
		const username = req.body["github_username"];
		if (!username) {
			try {
				await Dev.findOneAndUpdate({ github_username }, req.body, {
					new: true
				});
				return res.status(200).json({ message: "Usuário editado." });
			} catch (e) {
				return res.status(500).json({ message: "Não podemos editar." });
			}
		} else {
			return res
				.status(401)
				.json({ message: "Você não pode editar o github_username." });
		}
	},

	// DESTROY através do github_username
	async destroy(req, res) {
		const { github_username } = req.params;
		const dev = await Dev.findOne({ github_username });
		if (!dev) {
			return res.status(500).json({ message: "Usuário não existe." });
		} else {
			dev.deleteOne();
			return res.status(200).json({ message: "Usuário deletado." });
		}
	}
};
