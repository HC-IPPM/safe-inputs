/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
	context: __dirname,
	entry: {
		main: "./src/main.tsx"
	},
	builtins: {
		html: [
			{
				template: "./index.html"
			}
		]
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset",
			},
			{
				test: /\.tsx$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									jsx: true,
								},
								transform: {
									react: {
										pragma: "React.createElement",
										pragmaFrag: "React.Fragment",
										throwIfNamespace: true,
										development: false,
										useBuiltins: false,
									},
								},
							},
						},
					},
					{
						loader: 'babel-loader',
						options: {
							plugins: [
								"macros"
							],
						}
					},
				]
			},
		]
	}
};