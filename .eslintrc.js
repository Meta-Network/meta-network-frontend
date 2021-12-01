module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		'next',
		'next/core-web-vitals'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
