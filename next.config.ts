import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  webpack: (config, { isServer }) => {
    // let found = config.module.rules.filter(ru => {
    //   if (ru.use.some(u => u.includes('post'))) {
    //     return true
    //   }
    //   return false
    // })

    // config.module.rules.push({
    //   test: /\.css$/i,
    //   use: ["style-loader", "css-loader", "postcss-loader"],
    // })

    // config.module.rules = config.module.rules.filter((rule: any) => {
    //   return rule.loader !== "next-image-loader";
    // });

    // config.module.rules.push({
    //   test: /\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i,
    //   exclude: /node_modules/,
    //   use: [
    //     {
    //       //${config.assetPrefix}
    //       loader: 'file-loader',
    //       options: {
    //         limit: 0, /// config.inlineImageLimit,
    //         fallback: 'file-loader',
    //         publicPath: `/_next/static/images/`,
    //         outputPath: `${isServer ? '../' : ''}static/images/`,
    //         name: '[name]-[hash].[ext]',
    //         esModule: config.esModule || false,
    //       },
    //     },
    //   ],
    // })

    config.module.rules.push({
      test: /\.(glb|gltf|hdr|exr|fbx)$/,
      exclude: /node_modules/,
      use: [
        {
          //${config.assetPrefix}
          loader: "file-loader",
          options: {
            limit: 0, /// config.inlineImageLimit,
            fallback: "file-loader",
            publicPath: `/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[name]-[hash].[ext]",
            esModule: config.esModule || false,
          },
        },
      ],
    });

    // shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"],
    });

    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = false;
    // config.experiments.outputModule = true;

    config.output.environment = config.output.environment || {};
    config.output.environment.asyncFunction = true;
    return config;
  },
};

export default nextConfig;
