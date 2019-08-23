module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
  // loaders: [
  //   {
  //     test: /\.(graphql|gql)$/,
  //     exclude: /node_modules/,
  //     loader: 'graphql-tag/loader'
  //   }
  // ],
};