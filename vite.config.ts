import { defineConfig } from "vite";
import mdx from "@mdx-js/rollup";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { staticAssetsAdapter } from "@vinext/cloudflare/cache/static-assets-adapter";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import rehypeHighlight from "rehype-highlight";

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm, [remarkEmoji, { emoticon: true }], remarkSmartypants],
      rehypePlugins: [rehypeHighlight],
    }),
    vinext({
      cache: { cdn: staticAssetsAdapter() },
      prerender: { routes: "*" },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
