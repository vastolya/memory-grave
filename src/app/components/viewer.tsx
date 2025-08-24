"use client";

import * as THREE from "three";
import React from "react";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useProgress, useGLTF, Center } from "@react-three/drei";
import Link from "next/link";

function FullscreenLoader({ show }: { show: boolean }) {
  const { progress, active, errors } = useProgress();
  // Показываем, пока явно не "ready" ИЛИ пока есть активные загрузки
  const visible = show || active;

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-[#0b0b0b]"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 220ms ease-out",
      }}
    >
      <div
        className="text-neutral-300"
        style={{ fontFamily: "system-ui", fontSize: 14 }}
      >
        {errors.length
          ? "Ошибка загрузки модели"
          : `Загрузка… ${Math.round(progress)}%`}
      </div>
    </div>
  );
}

function Model({ onReady }: { onReady?: () => void }) {
  const { scene } = useGLTF("/grave.glb");

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scene.traverse((o: any) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        m.side = THREE.DoubleSide;
        if ("transparent" in m && m.transparent) m.transparent = false;
        if ("depthWrite" in m) m.depthWrite = true;
        if ("depthTest" in m) m.depthTest = true;
        if ("map" in m && m.map) m.map.colorSpace = THREE.SRGBColorSpace;
        m.needsUpdate = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    const id = requestAnimationFrame(() => onReady?.());
    return () => cancelAnimationFrame(id);
  }, [onReady]);

  return <primitive object={scene} />;
}

function useIsCoarsePointer() {
  const [isCoarse, setIsCoarse] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(pointer: coarse)");
    const onChange = () => setIsCoarse(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return isCoarse;
}

function ProjectionOffset({ percent = 0.1 }: { percent?: number }) {
  const { camera, size } = useThree();
  const isCoarse = useIsCoarsePointer();

  const enabled = !isCoarse && size.width >= 992;

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;

    if (enabled) {
      const px = Math.round(size.width * percent); // 10% вправо
      cam.setViewOffset(
        size.width,
        size.height,
        -px,
        0,
        size.width,
        size.height
      );
    } else {
      cam.clearViewOffset();
    }

    cam.updateProjectionMatrix();

    return () => {
      cam.clearViewOffset();
      cam.updateProjectionMatrix();
    };
  }, [camera, size.width, size.height, percent, enabled]);

  return null;
}

function MemorialText() {
  return (
    <div className="flex flex-col gap-8 z-10">
      <p>
        Два года назад мой друг Жека Сотников и моя подруга Алина Шарыпова
        трагически погибли в автокатастрофе
      </p>
      <p>
        Евгений был и остается по сей день талантливым поэтом, если вы не
        знакомы с его творчеством, то вот{" "}
        <Link
          href="https://stihi.ru/avtor/linelye"
          target="_blank"
          className="underline"
        >
          ссылка
        </Link>
      </p>
      <p>
        Помимо всего прочего, Евгнений был музыкантом: послушайте его альбом
        «Новомерье»{" "}
        <Link
          href="https://vk.com/music/album/-2000172182_18172182_902a49336333445e90"
          target="_blank"
          className="underline"
        >
          ВК
        </Link>{" "}
        ,{" "}
        <Link
          href="https://music.yandex.ru/album/26104875"
          target="_blank"
          className="underline"
        >
          Яндекс Музыка
        </Link>
      </p>
      <p>
        За несколько дней до трагедии мы с Жекой готовили{" "}
        <Link
          href="https://youtu.be/OzAqraffMJ0?si=fxncQT7Oqr-3BRAy"
          target="_blank"
          className="underline"
        >
          клип
        </Link>{" "}
        на новую{" "}
        <Link
          href="https://vk.com/artist/layneli_mty5njkzotgyoa?z=audio_playlist-2000042102_19042102_c67fdeb2d469a859db"
          target="_blank"
          className="underline"
        >
          песню
        </Link>
        , доделывать который пришлось уже без него, очень жаль, что он его так у
        не увидел, уверен, он был бы в восторге. Тут еще{" "}
        <Link
          href="https://www.youtube.com/@%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%D0%A1%D0%BE%D1%82%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2-%D0%B14%D1%8A"
          target="_blank"
          className="underline"
        >
          видео записи лайвов
        </Link>{" "}
        группы «Лайнели»
      </p>
      <p>
        Женя и Алина были и являются для меня образцом жизнелюбия, очень жаль,
        фатум жесток, мне вас не хватает
      </p>
      <p>Это для тех, кто хочет посететь могилу друга и подруги, но не может</p>
    </div>
  );
}

export default function Viewer() {
  const [ready, setReady] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="w-screen h-screen">
      <FullscreenLoader show={!ready} />
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 45, position: [2.6, 1.2, 5.8] }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <color attach="background" args={["#0b0b0b"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 4, 2]} intensity={2.2} />

        <ProjectionOffset percent={0.1} />

        <Suspense>
          <Center>
            <Model onReady={() => setReady(true)} />
          </Center>
        </Suspense>

        <OrbitControls makeDefault enableDamping />
      </Canvas>
      <div
        className="hidden md:block fixed top-4 md:top-1/2 md:-translate-y-1/2 left-1 md:left-[7.5rem] z-50
                md:max-w-[28.33vw] md:w-[min(90vw,28.33vw)] px-6"
      >
        <div className="rounded-2xl p-6 md:p-8 bg-#0b0b0b/15 backdrop-blur-md backdrop-saturate-50">
          <div className="md:text-[1vw] text-neutral-100 flex flex-col gap-8 z-10">
            <p>
              Два года назад мой друг Жека Сотников и моя подруга Алина Шарыпова
              трагически погибли в автокатастрофе
            </p>
            <p>
              Евгений был и остается по сей день талантливым поэтом, если вы не
              знакомы с его творчеством, то вот{" "}
              <Link
                href="https://stihi.ru/avtor/linelye"
                target="_blank"
                className="underline"
              >
                ссылка
              </Link>
            </p>

            <p>
              Помимо всего прочего, Евгнений был музыкантом: послушайте его
              альбом «Новомерье»{" "}
              <Link
                href="https://vk.com/music/album/-2000172182_18172182_902a49336333445e90"
                target="_blank"
                className="underline"
              >
                ВК
              </Link>{" "}
              ,{" "}
              <Link
                href="https://music.yandex.ru/album/26104875"
                target="_blank"
                className="underline"
              >
                Яндекс Музыка
              </Link>
            </p>

            <p>
              За несколько дней до трагедии мы с Жекой готовили{" "}
              <Link
                href="https://youtu.be/OzAqraffMJ0?si=fxncQT7Oqr-3BRAy"
                target="_blank"
                className="underline"
              >
                клип
              </Link>{" "}
              на новую{" "}
              <Link
                href="https://vk.com/artist/layneli_mty5njkzotgyoa?z=audio_playlist-2000042102_19042102_c67fdeb2d469a859db"
                target="_blank"
                className="underline"
              >
                песню
              </Link>{" "}
              , доделывать который пришлось уже без него, очень жаль, что он его
              так у не увидел, уверен, он был бы в восторге. Тут еще{" "}
              <Link
                href="https://www.youtube.com/@%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%D0%A1%D0%BE%D1%82%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2-%D0%B14%D1%8A"
                target="_blank"
                className="underline"
              >
                видео записи лайвов
              </Link>{" "}
              группы «Лайнели»
            </p>

            <p>
              Женя и Алина были и являются для меня образцом жизнелюбия, очень
              жаль, фатум жесток, мне вас не хватает
            </p>

            <p>
              Это для тех, кто хочет посететь могилу друга и подруги, но не
              может
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setInfoOpen((v) => !v)}
        className="md:hidden fixed top-12 z-50 rounded-full px-3 py-2  w-full 
              backdrop-blur-md text-neutral-100 text-xl"
        aria-expanded={infoOpen}
        aria-controls="memorial-panel"
      >
        {infoOpen ? "Скрыть описание" : "Показать описание"}
      </button>

      <div
        id="memorial-panel"
        className={`md:hidden fixed top-24 left-2 right-2 z-50 transition-all duration-300
              ${
                infoOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
      >
        <div
          className="rounded-2xl p-4 bg-[#0b0b0b]/80 backdrop-blur-md backdrop-saturate-50
                  max-h-[65vh] overflow-auto"
        >
          <div className="text-neutral-100 text-sm">
            <MemorialText />
          </div>
        </div>
      </div>
      <div className="hidden md:flex fixed bottom-30 right-30 text-xs text-neutral-300 ">
        Колесо — зум, ЛКМ — орбита, ПКМ — пан
      </div>
    </div>
  );
}
