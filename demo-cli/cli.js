#!/usr/bin/env node

/**
 * 脚手架工作过程
 * 1.通过命令行交互询问用户问题
 * 2.根据用户回答的结果生成文件
 */
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const ejs = require('ejs');

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Project name'
  }
]).then(answers => {
  // 模板目录
  const tmpDir = path.join(__dirname, 'templates');
  // 目标目录
  const destDir = process.cwd();
  // 将模板下的文件全部转换到目标目录
  fs.readdir(tmpDir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      // 通过模板引擎渲染文件
      ejs.renderFile(path.join(tmpDir, file), answers, (err, result) => {
        if (err) throw err;
        // 将结果写入目标文件路径
        fs.writeFileSync(path.join(destDir, file), result);
      })
    })
  })
});