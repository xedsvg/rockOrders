const path = require('path');
const compression = require('compression');
const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const helmet = require('helmet');

const frontendFilesPath = path.join(__dirname, '../../../frontend/web-build');

const createApp = (dependencies = {}) => {
	const app = express();

	let origins = require('../../cors.json').origins;
	console.log(origins);
	setInterval(() => {
		try{
			delete require.cache[require.resolve('../../cors.json')];
			origins = require('../../cors.json').origins;
		} catch(e) {
			console.log('Express: Error reading cors.json file');
		}
	}, 60000);

	app.use(compression({ filter: () => true, level: 6, algorithms: ['br', 'gzip', 'deflate'] }));
	app.use(cors({
		origin: function (origin, callback) {
			if (!origin) return callback(null, true);
			if (origins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				console.log('Express: Blocked by CORS: ' + origin);
				callback('Not allowed by CORS');
			}
		}
	}));
	app.use(express.json());
	app.use(helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ['\'self\'', 'https://unpkg.com', '\'unsafe-inline\'', 'https://123rf.com'],
				scriptSrc: ['\'self\'', '\'unsafe-inline\'', '\'wasm-unsafe-eval\'', 'blob:', 'https://cdn.jsdelivr.net'],
				imgSrc: ['\'self\'', 'https://previews.123rf.com']
			},
		},
	}));

	app.use('/api/user', dependencies.userRoutes || require('../routes/userRoutes'));
	app.use('/api/owner', dependencies.ownerRoutes || require('../routes/ownerRoutes'));
	app.use('/api/status', dependencies.statusRoutes || require('../routes/statusRoutes'));
	app.use('/api/app', dependencies.appRoutes || require('../routes/appRoutes'));

	app.use(
		'/@:random/restaurant-view',
		basicAuth({
			users: { '': '' },
			challenge: true,
			realm: 'tabley',
		}),
		(req) => req.url = '', 
		express.static(frontendFilesPath),
	);
	app.use('/@:random', (req) => req.url = '', express.static(frontendFilesPath));
	app.use('/join', (req) => req.url = '', express.static(frontendFilesPath));
	app.use('/', express.static(frontendFilesPath));

	return app;
};

module.exports = {
	createApp
};