const path = require('path');
const webpack = require('webpack');

const cwd = process.cwd();

module.exports = {
    mode: 'production',
    context: cwd,
    entry: {
        vendor: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    },
    output: {
        path: path.join(cwd, 'dist_base'),
        filename: 'dll.[name].js',
        library: '[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(cwd, `dist_base/[name]-manifest.json`),
            name: '[name]',
        }),
    ],
};
