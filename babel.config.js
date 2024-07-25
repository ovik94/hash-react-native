module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "react-native-dotenv",
          path: ".env",
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
    overrides: [
      {
        plugins: [
          [
            "@babel/plugin-transform-private-methods",
            {
              loose: true,
            },
          ],
        ],
      },
    ],
  };
};
