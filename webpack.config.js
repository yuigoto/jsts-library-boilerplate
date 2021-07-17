/**
 * webpack.config
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.dev>
 * @since     0.0.1
 */
const autoprefixer            = require("autoprefixer");
const fs                      = require("fs");
const htmlWebpack             = require("html-webpack-plugin");
const miniCssExtract          = require("mini-css-extract-plugin");
const nodeExternals           = require("webpack-node-externals");
const path                    = require("path");
const sass                    = require("sass");
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

/**
 * Path to the current working directory.
 *
 * @type {string}
 */
const WORK_DIR = process.cwd();

/**
 * Returns an `index` file from the folder, relative to the current working
 * directory.
 *
 * Searches for files with the current extensions in this order of priority:
 * - TSX
 * - JSX
 * - TS
 * - JS
 *
 * Tweak it according to your needs.
 *
 * By default, if not file is found, it'll always return `index.js`.
 *
 * @param {string} folder
 *     Path to the folder with the entry point, relative to the working dir
 * @returns {string}
 */
const getEntryPointFile = (folder) => {
  const files = fs.readdirSync(
    path.resolve(WORK_DIR, folder)
  );

  // Extensions in priority
  const _ext = ["tsx", "jsx", "ts"];

  for (let ext of _ext) {
    if (files.includes(`index.${ext}`)) {
      return `index.${ext}`;
    }
  }

  return `index.js`;
};

module.exports = (env, argv) => {
  // PROPERTIES
  // --------------------------------------------------------------------

  const isProduction = (argv.mode === "production");

  const resolvePaths = [
    path.resolve(WORK_DIR, "./src"),
  ];

  if (!isProduction) {
    resolvePaths.push(path.resolve(WORK_DIR, "./docs"));
  }

  // LOADERS
  // --------------------------------------------------------------------

  const cssLoader = {
    loader: "css-loader",
    options: {
      importLoaders: 2,
      sourceMap: false,
    },
  };

  const cssModuleLoader = {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: (isProduction)
          ? "[hash:8]"
          : "[name]_[local]_[hash:base64:5]",
        exportLocalsConvention: "camelCase",
      },
      importLoaders: 2,
      sourceMap: false,
    },
  };

  const postcssLoader = {
    loader: "postcss-loader",
    options: {
      sourceMap: false,
      postcssOptions: {
        plugins: [
          autoprefixer({
            flexbox: "no-2009",
          }),
        ],
      },
    },
  };

  const sassLoader = {
    loader: "sass-loader",
    options: {
      implementation: sass,
      sourceMap: false,
      sassOptions: {
        precision: 8,
        outputStyle: "compressed",
        sourceComments: false,
        quietDeps: false,
        includePaths: [
          path.resolve(WORK_DIR, "src", "styles"),
        ],
      },
    },
  };

  const styleLoader = (isProduction)
    ? miniCssExtract.loader
    : "style-loader";

  // WEBPACK CONFIGURATION
  // --------------------------------------------------------------------

  /** @type {import("webpack").Configuration} **/
  const config = {};

  config.devtool = false;

  config.entry = {
    index: path.resolve(WORK_DIR, "./src", getEntryPointFile("./src")),
  };

  config.mode = (isProduction) ? "production" : "development";

  config.module = {
    rules: [
      {
        test: /\.(jsx?|tsx?|mjs)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: true,
            },
          },
        ],
      },
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: [
          styleLoader,
          cssModuleLoader,
          postcssLoader,
          sassLoader,
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [
          styleLoader,
          cssLoader,
          postcssLoader,
          sassLoader,
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
          },
        },
      },
    ],
  };

  config.optimization = {
    minimize: isProduction,
  };

  config.output = {
    pathinfo: false,
    path: path.resolve(WORK_DIR, "build"),
    filename: "[name].js",
    publicPath: "/",
    clean: true,
  };

  config.plugins = [
    new miniCssExtract({
      filename: "[name].css",
    }),
  ];

  config.resolve = {
    modules: [
      ...resolvePaths,
      "node_modules"
    ],
    extensions: [
      ".js",
      ".jsx",
      ".mjs",
      ".ts",
      ".ts",
      ".tsx"
    ],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "tsconfig.build.json",
      }),
    ],
  };

  config.stats = {
    colors: true,
    hash: false,
    version: false,
    timings: true,
    assets: true,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false,
  };

  config.target = "web";

  // PRODUCTION ONLY
  // --------------------------------------------------------------------
  if (isProduction) {
    // Exclude node_modules from the final build
    config.externals = [
      nodeExternals()
    ];

    // Set output library type
    config.output.library = {
      type: "commonjs2",
    };

    // Add ts-loader to module rules do definitions file is generated
    config.module.rules.push({
      test: /\.tsx?$/,
      use: {
        loader: "ts-loader",
        options: {
          configFile: path.resolve(WORK_DIR, "tsconfig.build.json"),
          onlyCompileBundledFiles: true
        }
      },
    });
  }

  // DEVELOPMENT ONLY
  // --------------------------------------------------------------------
  if (!isProduction) {
    config.devServer = {
      hot: "true",
      port: 8080,
      historyApiFallback: true
    };

    // Add aliases to use for dev project
    config.resolve.alias = {
      "@docs": path.resolve(WORK_DIR, "./docs"),
      "@lib": path.resolve(WORK_DIR, "./src"),
    };

    // Set docs page entry point
    config.entry.docs = path.resolve(
      WORK_DIR,
      "./docs",
      getEntryPointFile("./docs")
    );

    // Generate HTML template and inject scripts/stylesheets
    config.plugins.push(
      new htmlWebpack({
        inject: true,
        filename: "index.html",
        template: path.resolve(WORK_DIR, "public", "index.html"),
        hash: true,
        minify: {
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          collapseWhitespace: true,
        },
      })
    );
  }

  return config;
};
