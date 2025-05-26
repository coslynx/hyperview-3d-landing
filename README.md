<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>

<h1 align="center">
hyperview-3d-landing
</h1>
<h4 align="center">Showcase SaaS products with interactive 3D landing pages</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Framework-React-blue" alt="React">
  <img src="https://img.shields.io/badge/3D Engine-Three.js-green" alt="Three.js">
  <img src="https://img.shields.io/badge/Language-TypeScript-blueviolet" alt="TypeScript">
  <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-lightblue" alt="Tailwind CSS">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/hyperview-3d-landing?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/hyperview-3d-landing?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/hyperview-3d-landing?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
This repository showcases a 3D landing page for SaaS products built using React, Three.js, and TypeScript, providing an interactive experience.

## 📦 Features

|    | Feature                  | Description                                                                                                                                                                                                                                                            |
|----|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🔷 | **Interactive 3D Models** | Utilizes Three.js and React Three Fiber for rendering interactive 3D models, enabling users to explore products in detail. |
| ✨ | **Animations**           | Leverages GSAP and Framer Motion for creating smooth, engaging animations and transitions, enhancing the user experience.                                                                                                                                         |
| 📱 | **Responsive Design**     | Designed to adapt seamlessly across various devices, ensuring a consistent and engaging experience on desktops, tablets, and mobile phones. Built with Tailwind CSS.                                                                                                      |
| 🌙 | **Theme Switching**        | Allows users to toggle between light and dark themes using a custom hook, providing a personalized viewing experience.                                                                                                                                          |
| 🚀 | **Performance Optimized** | Implements memory management, lazy loads 3D objects and uses LOD to deliver smooth and performant renders.                                                                                                                                                        |
| 💎 | **Customizable Materials**| The ability to apply textures and themes to enhance the scene.                                                                                                                                                     |
| 🎭 | **Base Template**          | The ability to setup threejs quickly with base elements like lights, camera, and more.|
| 🎮 | **Interaction Support**   | This allows for users to use mouse or keyboard to move aroudn the created 3D scene.                                                                                                                                                  |

## 📂 Structure

```
3d-landing-page/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── 3d/              # Three.js related components
│   │   │   ├── core/      # scene, camera, renderer
│   │   │   ├── models/    # 3D assets
│   │   │   └── effects/   # shaders, postprocessing
│   │   ├── layout/          # viewport, containers
│   │   └── sections/        # hero, features
│   ├── hooks/             # animation, scroll, three
│   ├── pages/             # index, model
│   ├── styles/            # theme, components
│   ├── utils/             # three, animation, perf
│   ├── App.tsx              # Application
│   ├── main.tsx             # Application
│   └── vite-env.d.ts       # Environment
├── index.html           # HTML
├── vite.config.ts       # Vite
├── tailwind.config.js   # Tailwind
├── tsconfig.json        # Typescript
├── README.md            # Info
├── package.json         # Dependencies
```

## 💻 Installation
> [!WARNING]
> ### 🔧 Prerequisites
> - Node.js v18+
> - npm 6+

### 🚀 Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/coslynx/hyperview-3d-landing.git
   cd hyperview-3d-landing
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🏗️ Usage
### 🏃‍♂️ Running the MVP
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access the application:
   - Web interface: [http://localhost:5173](http://localhost:5173)

> [!TIP]
> ### ⚙️ Configuration
> No need for much configuration, only to provide the API and connect the different features to the server

### 📚 Examples
Provide specific examples relevant to the MVP's core features. For instance:

- 3D model configuration: 
  ```jsx
  <ModelLoader modelUrl="/models/scene.glb" />
  ```

- Base ThreeJS Setup:
  ```jsx
          <ThreeScene >
                ... components
          </ThreeScene>
  ```

- Landing Page:
  ```jsx
              <LandingHero
                    modelUrl="/models/laptop.glb"
                    headline="Experience Immersive 3D Web Design"
                    subheadline="Create stunning, interactive 3D landing pages with ease."
                    ctaLabel="Get Started"
                    ctaLink="/models"
                  />
  ```

## 🌐 Hosting
### 🚀 Deployment Instructions
Provide detailed, step-by-step instructions for deploying to the most suitable platform for this MVP. For example:

#### Deploying to Netlify

 1. Build the project:
  ```bash
  npm run build
  ```
 2. Drag and drop the 'dist' folder.
   You will get a web address for the website and you can assign it to a domain or subdomain you have.

## 📄 License & Attribution

> [!NOTE]
> ## 📜 License & Attribution
>
> ### 📄 License
> This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.
>
> ### 🤖 AI-Generated MVP
> This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).
>
> No human was directly involved in the coding process of the repository: hyperview-3d-landing
>
> ### 📞 Contact
> For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
> - Website: [CosLynx.com](https://coslynx.com)
> - Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

<p align="center">
  <h1 align="center">🌐 CosLynx.com</h1>
</p>
<p align="center">
  <em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
</p>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
<img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
</div>