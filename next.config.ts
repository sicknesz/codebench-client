import type { NextConfig } from "next";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(`Will load Next.js config from: ${__dirname}`);


const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,

  assetPrefix: './',
  transpilePackages: [
    "@codingame/monaco-vscode-api",
    // plus any other @codingame/* packages you use
  ],
  // allowedDevOrigins: ['192.168.1.2'],
  // serverExternalPackages: ['@codingame/monaco-vscode-typescript-language-features-default-extension', 'monaco-languageclient', 'node_modules'],
  turbopack: {
    // root: resolve(__dirname),
    rules: {

      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },

      // Target the specific broken dependency file
      // You can use a glob pattern to match the file inside node_modules
      './node_modules/@codingame/monaco-vscode-typescript-language-features-default-extension/index.js': {
        loaders: [
          {
            loader: resolve(__dirname, 'loaders/manipulate.cjs'),
            options: {
              target: 'browser'
            }
          }
        ],
        // "as": "*.js" tells Turbopack to treat the output as a JS module
        as: '*.js'
      }
    }
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
  //         { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
  //       ]
  //     }
  //   ];
  // },
};

export default nextConfig;
