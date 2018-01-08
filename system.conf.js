System.config({
    paths: {
        'systemjs': 'node_modules/systemjs/dist/system.js',
        'traceur': 'node_modules/traceur/dist/commonjs/traceur.js'
    },

    packages: {
        './': {defaultExtension: 'js'}
    }
});
