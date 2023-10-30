const { env } = require("./src/server/env");
const { withSentryConfig } = require("@sentry/nextjs");
const path = require("path");

function getConfig(config) {
  return config;
}

const moduleExports = {
  // Your existing module.exports
  distDir: "build",
  // Use SKIP_TYPE_CHECK env variable to skip type checking during build
  ...(process.env.SKIP_TYPE_CHECK
    ? {
        typescript: {
          ignoreBuildErrors: true,
        },
      }
    : null),
  ...(process.env.SKIP_LINT_CHECK
    ? {
        eslint: {
          ignoreDuringBuilds: true,
        },
      }
    : null),

  publicRuntimeConfig: {
    NODE_ENV: env.NODE_ENV,
  },
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
    disableServerWebpackPlugin: process.env.SENTRY_AUTH_TOKEN ? false : true,
    disableClientWebpackPlugin: process.env.SENTRY_AUTH_TOKEN ? false : true,
  },
  images: {
    domains: [
      "images.clerk.dev",
      "s3.us-east-1.amazonaws.com",
      "kiefa-media-bucket.s3.us-east-1.amazonaws.com",
      "kiefa-media-bucket-prod.s3.us-east-1.amazonaws.com",
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack: (config, { buildId, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.BUILD_ID": JSON.stringify(buildId),
      }),
    );
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.module.rules.push({
      test: /\.csv$/,
      type: "asset/resource",
      generator: {
        filename: (content) => {
          return content.filename;
        },
      },
    });
    if (process.env.NODE_ENV === "production")
      config.plugins.push(
        new webpack.DefinePlugin({
          __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })",
        }),
      );
    return config;
  },
  transpilePackages: ["mui-tree-select"],
  async redirects() {
    return [
      {
        source: "/incidents",
        destination: "/issues",
        permanent: true,
      },
      {
        source: "/growtech/incidents",
        destination: "/growtech/issues",
        permanent: true,
      },
      {
        source: "/incidents/:path*",
        destination: "/issues/:path*",
        permanent: true,
      },
      {
        source: "/remediation",
        destination: "/reactionPlans",
        permanent: true,
      },
      {
        source: "/growmap/editor",
        destination: "/",
        permanent: true,
      },
      {
        source: "/growmap/map",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  dryRun: process.env.SENTRY_AUTH_TOKEN ? false : true,
  silent: false, // Suppresses all logs
  release: process.env.SENTRY_AUTH_TOKEN ? process.env.SENTRY_RELEASE : "",
  include: "./build",
  ignore: [
    "node_modules",
    "middleware-build-manifest.js",
    "middleware-react-loadable-manifest.js",
    "_buildManifest.js",
    "polyfills-*.js",
  ],
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = getConfig(
  withSentryConfig(moduleExports, sentryWebpackPluginOptions),
);
