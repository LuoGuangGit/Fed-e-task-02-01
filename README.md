## 简答题
### **1. 谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。**
> 工程化是为了提高开发效率，减少开发过程中的重复工作（公共文件的修改、引入等）

#### 工程化带来的价值：
* 摆脱运行环境带来的兼容性问题（EcmaScript Next，Sass）
* 保证项目的可维护性
* 提供统一开发规范，保证开发质量
* 减少开发过程中不必要的重复工作
* 多人协作开发

### **2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？**
当项目有相同的组织结构、相同的依赖、相同的基础代码、相同的规范、使用相同的框架时，可以节省项目构建时间，在开发工程中提高开发效率。


# 编程题
### **1、概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具**
***通过命令行询问用户使用的配置结合模板生成对应的项目结构文件***  
脚手架工具：`./node-cli`

### **2、尝试使用 Gulp 完成项目的自动化构建**
`./pages-boilerplate`


# Gulp构建项目说明文档
#### 构建实现：
* html、js、sass文件转换、压缩
* 提供热更新开发服务器
* 提供打包构建命令

#### 使用的开发依赖包：
* gulp              => 提供gulp构建工具集
* gulp-load-plugins => 加载所有gulp插件
* gulp-swig         => 将html模板文件转换为静态html
* gulp-babel        => 转换EcmaScript Next语法
* gulp-sass         => 转换sass为css文件
* gulp-useref       => 将构建后的html中引用的多个css或js通过标识合并
* gulp-if           => 判断是什么类型的文件，然后通过对应插件处理文件，如：压缩文件
* gulp-htmlmin      => 压缩html
* gulp-uglify       => 压缩js
* gulp-clean-css    => 压缩css
* gulp-imagemin     => 无损压缩图片文件
* @babel/core       => 转换js语法依赖插件
* @babel/preset-env => 转换js语法依赖插件
* del               => 构建前后清理文件夹
* browser-sync      => 提供热更新服务器插件

#### 项目结构：
```bash
├── gulpfile.js
├── LICENSE
├── package.json
├── public
│   └── favicon.ico
├── README.md
├── src
│   ├── about.html
│   ├── assets
│   │   ├── fonts
│   │   │   ├── pages.eot
│   │   │   ├── pages.svg
│   │   │   ├── pages.ttf
│   │   │   └── pages.woff
│   │   ├── images
│   │   │   ├── brands.svg
│   │   │   └── logo.png
│   │   ├── scripts
│   │   │   └── main.js
│   │   └── styles
│   │       ├── main.scss
│   │       ├── _icons.scss
│   │       └── _variables.scss
│   ├── index.html
│   ├── layouts
│   │   └── basic.html
│   └── partials
│       ├── footer.html
│       └── header.html
└── yarn.lock
```
> html布局文件放置在：`src/layouts` 中，页面文件放置在：`src` 下，公共文件放置在：`src/partials` 下  
> js、sass、图片、字体文件依次放置在：`src/assets` 下的 `scripts` `styles` `images` `fonts`
#### 构建目录结构：
```bash
├── assets
│   ├── fonts
│   │   ├── pages.eot
│   │   ├── pages.svg
│   │   ├── pages.ttf
│   │   └── pages.woff
│   ├── images
│   │   ├── brands.svg
│   │   └── logo.png
│   ├── scripts
│   │   ├── main.js
│   │   └── vendor.js
│   └── styles
│       ├── main.css
│       └── vendor.css
├── favicon.ico
├── index.html
└── about.html
```

#### 构建命令
```bash
## 清理构建的代码
yarn clean

## 构建生成环境代码，压缩文件
yarn build

## 启动热更新服务器，开发环境
yarn dev
```
