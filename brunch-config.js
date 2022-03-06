module.exports = {

	files: {
		javascripts: {joinTo: 'app.js'}
		, stylesheets: {joinTo: 'app.css'}
	}

	, plugins: {
		babel: {
			presets:   ['@babel/preset-env']
			, plugins: ["@babel/plugin-proposal-class-properties"]
		}
		, raw: {
			pattern: /\.(html|svg)$/,
			wrapper: content => `module.exports = ${JSON.stringify(content)}`
		}
		, preval:{
			tokens: { BUILD_TIME: ()=> Date.now() }
		}
	}

	, paths: {
		watched:  ['source']
		, public: './docs'
	}

	, watcher: {
		awaitWriteFinish: true
	}

	, modules: {
		nameCleaner: path => path.replace(/^(source)?\//, 'arctype/')
	}

	, npm: {
		enabled: true
		, styles: {
			// arctype: ["arc-type.css"]
		}
	}
};
