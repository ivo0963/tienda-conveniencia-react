// karma.conf.cjs
// Ejecuta las pruebas unitarias (Jasmine) en Chrome Headless. Webpack + Babel
// compilan el JSX y babel-plugin-istanbul instrumenta el código para la cobertura.
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],

    files: [
      { pattern: 'test/index.js', watched: false },
      // Imágenes de /public servidas igual que en Vite (/img/...).
      { pattern: 'public/img/*', watched: false, included: false, served: true },
    ],

    proxies: {
      '/img/': '/base/public/img/',
    },

    preprocessors: {
      'test/index.js': ['webpack'],
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          // El proyecto usa "type": "module"; permite importar sin extensión como en Vite.
          { test: /\.m?jsx?$/, resolve: { fullySpecified: false } },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '120' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: [['istanbul', { include: ['src/**'], exclude: ['src/main.jsx'] }]],
              },
            },
          },
        ],
      },
    },

    client: {
      // SEMILLA permite repetir un orden aleatorio concreto: SEMILLA=1234 npm test
      jasmine: { random: true, seed: process.env.SEMILLA },
      clearContext: false,
    },

    reporters: ['spec', 'coverage'],

    specReporter: {
      suppressSkipped: true,
      showSpecTiming: false,
    },

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
        { type: 'text-summary' },
        { type: 'text', subdir: '.', file: 'resumen.txt' },
      ],
    },

    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: 1,
  });
};
