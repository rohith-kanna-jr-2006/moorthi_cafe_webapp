const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

/**
 * Custom plugin to copy public/images to dist/images during production builds
 */
class CopyImagesPlugin {
  apply(compiler) {
    const isProduction = compiler.options.mode === 'production';
    const publicImagesPath = path.resolve(__dirname, 'public/images');
    const outputImagesPath = path.resolve(__dirname, 'dist/images');

    if (!isProduction) {
      return;
    }

    // Fail if source images directory doesn't exist
    if (!fs.existsSync(publicImagesPath)) {
      throw new Error(`[CopyImagesPlugin] Source directory not found: ${publicImagesPath}`);
    }

    compiler.hooks.afterEmit.tapAsync('CopyImagesPlugin', (compilation, callback) => {
      try {
        // Ensure output directory exists
        fs.mkdirSync(outputImagesPath, { recursive: true });

        // Copy entire public/images directory recursively
        fs.cpSync(publicImagesPath, outputImagesPath, { recursive: true });

        // Count copied files
        const copiedFiles = [];
        function collectFiles(dir, prefix = '') {
          for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              collectFiles(fullPath, path.join(prefix, entry.name));
            } else {
              copiedFiles.push(path.join(prefix, entry.name));
            }
          }
        }
        collectFiles(outputImagesPath);

        console.log(`[CopyImagesPlugin] ✅ Copied ${copiedFiles.length} image asset(s) to dist/images/`);
        if (copiedFiles.length > 0) {
          console.log(`[CopyImagesPlugin]   Examples: ${copiedFiles.slice(0, 5).join(', ')}${copiedFiles.length > 5 ? '...' : ''}`);
        }
        callback();
      } catch (err) {
        callback(new Error(`[CopyImagesPlugin] Failed to copy images: ${err.message}`));
      }
    });
  }
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CopyImagesPlugin()
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 9004,
    historyApiFallback: true
  }
};