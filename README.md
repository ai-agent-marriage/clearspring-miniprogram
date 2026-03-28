# 清如 ClearSpring 小程序

清如 ClearSpring 服务类微信小程序

## 项目信息

- **小程序 AppID**: wxa914ecc15836bda6
- **开发框架**: 微信小程序原生开发
- **基础库版本**: 3.3.4

## 项目结构

```
clearspring-miniprogram/
├── app.js                 # 小程序入口文件
├── app.json               # 小程序全局配置
├── app.wxss               # 全局样式
├── project.config.json    # 项目配置文件
├── project.private.config.json  # 私有配置（不提交）
├── sitemap.json           # 索引配置
├── pages/                 # 页面目录
│   ├── index/            # 首页
│   ├── service/          # 服务页
│   ├── order/            # 订单页
│   └── profile/          # 个人页
├── components/           # 自定义组件
├── utils/                # 工具函数
└── images/               # 图片资源
```

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/clearspring-mini/clearspring-miniprogram.git
cd clearspring-miniprogram
```

### 2. 微信开发者工具

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入项目（选择项目目录）
3. 填入自己的 AppID
4. 编译运行

### 3. 配置云开发

参考 `cloud/` 目录下的云函数配置文档。

## 功能模块

- ✅ 首页展示
- ✅ 服务列表
- ✅ 订单管理
- ✅ 个人中心
- ⏳ 云开发集成
- ⏳ 微信支付

## 开发规范

- 使用 ES6+ 语法
- 遵循微信小程序开发规范
- 代码提交前请确保编译通过

## 许可证

Copyright © 2026 清如 ClearSpring
