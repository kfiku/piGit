const {
    FuseBox,
    CSSPlugin,
    WebIndexPlugin,
    Sparky,
    QuantumPlugin,
    EnvPlugin
} = require('fuse-box')

const express = require('express')
const path = require('path')
const {spawn} = require('child_process')

let production = false

Sparky.task('build:renderer', () => {
  const fuse = FuseBox.init({
    homeDir: 'src/renderer',
    sourceMaps: { project: true, vendor: true },
    output: 'dist/renderer/$name.js',
    hash: production,
    target: 'electron',
    experimentalFeatures: true,
    cache: !production,
    plugins: [
      EnvPlugin({ NODE_ENV: production ? 'production' : 'development' }),
            [CSSPlugin()],
      WebIndexPlugin({
        title: 'FuseBox electron demo',
        template: 'src/renderer/index.html',
        path: production ? '.' : '/renderer/'
      }),
      production && QuantumPlugin({
        bakeApiIntoBundle: 'renderer',
        target: 'electron',
        treeshake: true,
        removeExportsInterop: false,
        // uglify: true
      })
    ]
  })

  if (!production) {
        // Configure development server
    fuse.dev({ root: false }, server => {
      const dist = path.join(__dirname, 'dist')
      const app = server.httpServer.app
      app.use('/renderer/', express.static(path.join(dist, 'renderer')))
      app.use('/svg/', express.static(path.join(dist, 'renderer', 'svg')))
      app.use('/fonts/', express.static(path.join(dist, 'renderer', 'fonts')))
      app.get('/', function (req, res) {
        res.sendFile(path.join(dist, 'renderer/index.html'))
      })
    })
  }

  const app = fuse.bundle('renderer')
        .instructions('> [index.tsx] + fuse-box-css')

  if (!production) {
    app.hmr({ reload: true }).watch()
  }

  return fuse.run()
})

Sparky.task('build:main', () => {
  const fuse = FuseBox.init({
    homeDir: 'src/main',
    sourceMaps: { project: true, vendor: true },
    output: 'dist/main/$name.js',
    target: 'server',
    experimentalFeatures: true,
    cache: !production,
    plugins: [
      EnvPlugin({ NODE_ENV: production ? 'production' : 'development' }),
      production && QuantumPlugin({
        bakeApiIntoBundle: 'main',
        target: 'server',
        treeshake: true,
        removeExportsInterop: false,
        // uglify: true
      })
    ]
  })

  const app = fuse.bundle('main')
        .instructions('> [main.ts]')

  if (!production) {
    app.watch()

    return fuse.run().then(() => {
            // launch electron the app
      const child = spawn('npm', [ 'run', 'start:electron:watch' ])
      child.stdout.on('data', function (data) {
        console.log(data.toString())
                // Here is where the output goes
      })
      child.stderr.on('data', function (data) {
        console.error(data.toString())
                // Here is where the error output goes
      })
    })
  }

  return fuse.run()
})

// main task
Sparky.task('default', ['clean:dist', 'clean:cache', 'copy-svg', 'copy-fonts', 'build:renderer', 'build:main'], () => {})

Sparky.task('copy-svg', () => Sparky.src('src/renderer/svg/*.svg').dest('dist/renderer/svg/$name'))
Sparky.task('copy-fonts', () => Sparky.src('src/renderer/fonts/*.*').dest('dist/renderer/fonts/$name'))
// wipe it all
Sparky.task('clean:dist', () => Sparky.src('dist/*').clean('dist/'))
// wipe it all from .fusebox - cache dir
Sparky.task('clean:cache', () => Sparky.src('.fusebox/*').clean('.fusebox/'))

// prod build
Sparky.task('set-production-env', () => production = true)
Sparky.task('dist', ['clean:dist', 'clean:cache', 'set-production-env', 'copy-svg', 'copy-fonts', 'build:main', 'build:renderer'], () => {})
