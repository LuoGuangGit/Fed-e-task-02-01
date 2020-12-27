// 实现这个项目的构建任务
const { src, dest, series, parallel, watch } = require('gulp'); // gulp 提供 api
const LoadPlugins = require('gulp-load-plugins'); // 通过此插件自动引入 gulp 的所有插件
const del = require('del'); // 清理文件目录插件
const browserSync = require('browser-sync'); // 引入热更新服务器

const plugins = new LoadPlugins(); // gulp 插件集
const bs = browserSync.create(); // 创建热更新服务器

// html 模板文件中使用的数据
const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
};

const clean = () => {
  /**
   * 清理文件夹
   * 在构建打包时先执行清理
   */
  return del(['dist', 'temp']);
}

const pages = () => {
  /**
   * html 构建任务
   * 通过 src 得到 html 文件流
   * 通过 gulp-swig 插件将模板文件转换成单个 html 文件
   * 将转换后的 html 文件写入到 temp 文件夹中（没有直接写入到 dist 文件夹是为了避免使用 gulp-useref 插件合并 html 中的标识的文件和压缩文件并写入 dist 中时产生空白文件的问题）
   * 通过 bs.reload({ stream: true }) 在修改源文件时构建刷新浏览器，stream: true 以流的方式推到浏览器，也可以在 bs.init 中设置 files: 'dist/**' 监听 dist 目录文件更改时更新
   * defaults: { cache: false } 不缓存，防止因浏览器缓存机制而导致的页面没有更新的问题
   */
  return src('src/*.html', { base: 'src' })
    .pipe(plugins.swig({ data, defaults: { cache: false } }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
}
const scripts = () => {
  /**
   * js 文件构建
   * 通过 src 得到 js 文件
   * 通过 gulp-babel 指定预设插件 @babel/preset-env 转换 js 文件中使用的 ECMAScript Next 语法
   * 后续两个步骤与 html 构建任务中的同义
   */
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({
      presets: ['@babel/preset-env'],
    }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
}
const styles = () => {
  /**
   * sass 文件构建
   * 通过 src 得到 sass 文件
   * 通过 gulp-sass 插件转换 sass => css 接收参数 { outputStyle: 'expanded' } 表示是否展开生成后的 css
   * 后续两个步骤与 html、js 构建任务中的同义
   */
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
}
/**
 * !图片、字体、额外文件 构建区别
 * 这些构建任务只执行了无损压缩，它们并不影响在开发阶段的展示，
 * 只是为了在上线前能够减少一些体积，因此这些构建任务在开发阶段并没有太大的意义，
 * 所以在开发阶段不执行这个构建任务（在 bs.init => server 中设置根目录设置相应路径以保证开发阶段的正常显示）
 */
const images = () => {
  /**
   * 图片文件构建
   * 通过 src 得到图片文件
   * 通过 gulp-imagemin 无损压缩图片
   */
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'));
}
const fonts = () => {
  /**
   * 字体文件构建任务
   * 因为字体中有部分 svg 文件，因此需要使用 gulp-imagemin 插件，如果是是支持的文件类型，插件不会执行
   */
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'));
}
const extras = () => {
  /**
   * 将 public 下的文件写入到 dist 目录下
   */
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'));
}
const useref = () => {
  /**
   * 上面的任务将 html、js、sass 文件临时写入了 temp 目录当中（解决读写冲突导致的空白文件）
   * 使用 gulp-if 判断文件类型，再使用相应的 gulp 插件进行压缩
   * 最后再写入到 dist 目录下
   */
  return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      minifyJS: true, // 将 html 中 script 标签内的 js 压缩
      minifyCSS: true,  // 将 html 中 style 标签内的 css 压缩
      collapseWhitespace: true, // 默认只会将 html 属性当中的一些空白字符去掉，并不会压缩 html 所以需要设置这个属性为 true
    })))
    .pipe(dest('dist'))
}
const server = () => {
  // 监听文件变化，执行相应的任务
  watch('src/*.html', pages);
  watch('src/assets/scripts/*.js', scripts);
  watch('src/assets/styles/*.scss', styles);
  // 在开发阶段不需要执行构建任务，因此只监听开发阶段文件的变化刷新浏览器，以减少
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**',
  ], bs.reload);

  bs.init({
    port: 8080, // 热更新服务器启动端口
    notify: false, // 关闭服务器启动时的提示信息，避免影响开发调试
    server: {
      baseDir: ['temp', 'src', 'public'], // 指定根目录，在开发阶段，图片、字体文件和 public 下的文件不需要打包，因此设置在遇到这些文件时去相应目录找到并展示
      routes: { // 设置一些路由，当有相应请求时去拿到相应路由下的文件，优先级高于 baseDir
        '/node_modules': 'node_modules',
      }
    }
  })
}
// 读取流 => [转换流] => 写入流

/**
 * parallel 并行任务，多个任务同时执行
 * series 串行任务，一个任务执行完再执行下一个任务
 */
const compile = parallel(pages, scripts, styles);
const build = series(clean, parallel(series(compile, useref), images, fonts, extras)); // 打包构建任务
const dev = series(clean, compile, server); // 开发阶段构建任务

module.exports = {
  clean,
  build,
  dev,
}