# 🕊️ Memorial 3D Viewer

Веб-приложение на **Next.js + React Three Fiber**, позволяющее просматривать 3D-скан памятника/мемориала в браузере.  
Проект объединяет **технологии 3D-визуализации** и **память о близких людях**, чтобы дать возможность посетить место даже на расстоянии.

---

## ✨ Возможности

- Загрузка и отображение 3D-модели (`.glb`) через [`react-three/fiber`](https://github.com/pmndrs/react-three-fiber) и [`@react-three/drei`](https://github.com/pmndrs/drei)  
- Полноэкранный **прелоадер** с прогрессом загрузки  
- **Автоматическая корректировка материалов** модели (DoubleSide, цветовое пространство, depthWrite/test)  
- **Камера со смещением проекции** (только на десктопах, отключено на мобильных)  
- **Управление камерой** через `OrbitControls` (зум, орбита, панорамирование)  
- **Адаптивный интерфейс**:  
  - 📱 На мобильных текст прячется в раскрывающуюся панель  
  - 💻 На десктопе отображается фиксированный блок с описанием сбоку  
- Текстовое описание с **ссылками на творчество** (стихи, музыка, видео)  

---

## 🚀 Технологии

- [Next.js 14](https://nextjs.org/) (App Router)  
- [React](https://react.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [react-three-fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)  
- [@react-three/drei](https://github.com/pmndrs/drei)  
- [Three.js](https://threejs.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  

---

## 📂 Структура проекта

```bash
components/
  Viewer.tsx            # основной компонент со сценой и UI
  Model.tsx             # загрузка и обработка GLB модели
  FullscreenLoader.tsx  # глобальный прелоадер
  ProjectionOffset.tsx  # смещение камеры на десктопе
