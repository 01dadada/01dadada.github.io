# AMP-MIC Predictor / Generator

[English](#english) | [中文](#中文)

---

## English

### Overview

**AMP-MIC Predictor / Generator** is a web-based tool for predicting Minimum Inhibitory Concentration (MIC) and generating Antimicrobial Peptides (AMPs) with property predictions. This application provides researchers and scientists with an intuitive interface to explore and analyze antimicrobial peptides across multiple species.

### Features

- 🔬 **MIC Prediction**: Predict the minimum inhibitory concentration for antimicrobial peptides against various bacterial species
- 🧬 **AMP Generation**: Generate antimicrobial peptide sequences with customizable parameters
- 🎯 **Multi-Species Support**: Support for multiple bacterial species targeting
- 📊 **Property Prediction**: Predict physicochemical properties including:
  - Molecular weight (MW)
  - Isoelectric point (pI)
  - Hydrophobicity
  - And more
- 🌐 **Bilingual Interface**: Full support for English and Chinese (中文)
- 📱 **Responsive Design**: Modern, mobile-friendly user interface
- 📥 **Export Functionality**: Download results in various formats

### Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.2.7
- **Styling**: Tailwind CSS 4.1.17
- **Routing**: React Router DOM 6.30.2
- **Internationalization**: i18next & react-i18next
- **Form Handling**: React Hook Form 7.53.0
- **Icons**: Lucide React

### Getting Started

#### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

#### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my_web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

#### Build for Production

```bash
npm run build
```

The production build will be generated in the `dist` directory.

#### Preview Production Build

```bash
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking

### Project Structure

```
my_web/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable React components
│   ├── config/      # Configuration files
│   ├── i18n/        # Internationalization files
│   ├── pages/       # Page components
│   ├── styles/      # CSS and styling files
│   ├── types.ts     # TypeScript type definitions
│   ├── utils/       # Utility functions
│   ├── App.tsx      # Main application component
│   └── main.tsx     # Application entry point
├── index.html       # HTML template
├── package.json     # Project dependencies
└── vite.config.ts   # Vite configuration
```

### Pages

- **Home** (`/`) - Landing page with overview and features
- **MIC Predictor** (`/mic`) - Predict minimum inhibitory concentration
- **AMP Generator** (`/amp`) - Generate antimicrobial peptides
- **Downloads** (`/downloads`) - Download resources and datasets
- **Contact** (`/contact`) - Contact information and support

### Language Support

The application supports two languages:
- English (en)
- 中文 (zh)

Switch between languages using the language toggle button in the header.

### Development

#### Type Checking

```bash
npm run lint
```

This runs TypeScript compiler to check for type errors without emitting files.

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### License

This project is private and proprietary.

### Citation

If you use this tool in your research, please cite:

```bibtex
@article{amp2025,
  title={AMP-MIC Predictor},
  author={Jun et al.},
  journal={Bioinformatics},
  year={2025}
}
```

### Contact

For questions, suggestions, or support, please visit the Contact page or reach out through the provided channels.

---

## 中文

### 项目简介

**AMP-MIC Predictor / Generator** 是一个基于 Web 的抗菌肽最小抑菌浓度（MIC）预测和抗菌肽（AMP）生成工具，支持多种理化性质预测。该应用为研究人员和科学家提供了一个直观的界面，用于探索和分析针对多种细菌物种的抗菌肽。

### 主要功能

- 🔬 **MIC 预测**：预测抗菌肽对多种细菌物种的最小抑菌浓度
- 🧬 **AMP 生成**：生成可自定义参数的抗菌肽序列
- 🎯 **多物种支持**：支持多种细菌物种靶向
- 📊 **性质预测**：预测理化性质，包括：
  - 分子量（MW）
  - 等电点（pI）
  - 疏水性
  - 以及其他性质
- 🌐 **双语界面**：完整支持英文和中文
- 📱 **响应式设计**：现代化、移动端友好的用户界面
- 📥 **导出功能**：支持多种格式的结果下载

### 技术栈

- **前端框架**：React 18.3.1 + TypeScript
- **构建工具**：Vite 7.2.7
- **样式框架**：Tailwind CSS 4.1.17
- **路由管理**：React Router DOM 6.30.2
- **国际化**：i18next & react-i18next
- **表单处理**：React Hook Form 7.53.0
- **图标库**：Lucide React

### 快速开始

#### 环境要求

- Node.js（建议 v16 或更高版本）
- npm 或 yarn 包管理器

#### 安装步骤

1. 克隆仓库：
```bash
git clone <repository-url>
cd my_web
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 在浏览器中打开 `http://localhost:5173`

#### 生产环境构建

```bash
npm run build
```

生产构建文件将生成在 `dist` 目录中。

#### 预览生产构建

```bash
npm run preview
```

### 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 TypeScript 类型检查

### 项目结构

```
my_web/
├── public/          # 静态资源文件
├── src/
│   ├── components/  # 可复用的 React 组件
│   ├── config/      # 配置文件
│   ├── i18n/        # 国际化文件
│   ├── pages/       # 页面组件
│   ├── styles/      # CSS 和样式文件
│   ├── types.ts     # TypeScript 类型定义
│   ├── utils/       # 工具函数
│   ├── App.tsx      # 主应用组件
│   └── main.tsx     # 应用入口文件
├── index.html       # HTML 模板
├── package.json     # 项目依赖
└── vite.config.ts   # Vite 配置
```

### 页面说明

- **首页** (`/`) - 项目概览和功能介绍
- **MIC 预测器** (`/mic`) - 预测最小抑菌浓度
- **AMP 生成器** (`/amp`) - 生成抗菌肽
- **下载** (`/downloads`) - 下载资源和数据集
- **联系** (`/contact`) - 联系信息和支持

### 语言支持

应用支持两种语言：
- 英文（en）
- 中文（zh）

使用页面顶部的语言切换按钮可以在两种语言之间切换。

### 开发

#### 类型检查

```bash
npm run lint
```

此命令运行 TypeScript 编译器进行类型检查，但不生成文件。

### 浏览器支持

- Chrome（最新版本）
- Firefox（最新版本）
- Safari（最新版本）
- Edge（最新版本）

### 许可证

本项目为私有和专有项目。

### 引用

如果您在研究中使用了此工具，请引用：

```bibtex
@article{amp2025,
  title={AMP-MIC Predictor},
  author={Jun et al.},
  journal={},
  year={2025}
}
```

### 联系方式

如有问题、建议或需要支持，请访问联系页面或通过提供的渠道联系我们。

