const {
    FuseBox,
    SVGPlugin,
    CSSPlugin,
    // TypeScriptHelpers,
    QuantumPlugin,
    WebIndexPlugin,
    Sparky
} = require("fuse-box");

const {execSync} = require("child_process");

let fuse, app, vendor, isProduction;

Sparky.task("config", () => {
    fuse = new FuseBox({
      homeDir: "src/",
      sourceMaps: !isProduction,
      hash: isProduction,
      output: "dist/$name.js",
      plugins: [
        SVGPlugin(),
        CSSPlugin(),
        WebIndexPlugin({
            template: "src/index.html"
        }),
        // isProduction && QuantumPlugin({
        //     removeExportsInterop: false,
        //     uglify: true
        // })
      ]
    });
    // vendor
    // vendor = fuse.bundle("vendor")
    //       // .target("electron")
    //       .instructions("~ index.tsx")

    // bundle app
    app = fuse.bundle("index")
          .target("electron")
          .instructions("> [index.tsx]")
});

Sparky.task("default", ["clean", "config", "copy-svg"], () => {
    fuse.dev();
    app.watch().hmr();
    return fuse.run().then(() => {
        // launch the app
        // spawn('node', [`${ __dirname }/node_modules/electron/cli.js`,  __dirname ]);
        // execSync(`npm run dev3`);
    });
});

Sparky.task("clean", () => Sparky.src("dist/").clean("dist/*.{js|html}"));
Sparky.task("copy-svg", () => Sparky.src("src/svg/*.svg").dest("dist/svg/$name"));
// Sparky.task("prod-env", ["clean"], () => { isProduction = true })
// Sparky.task("dist", ["prod-env", "config"], () => {
//     // comment out to prevent dev server from running (left for the demo)
//     fuse.dev();
//     return fuse.run();
// });
