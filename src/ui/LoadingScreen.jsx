import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../store/useStore";
import { Fan, Swords, Crown, Sparkles } from "lucide-react";

export default function LoadingScreen() {
  const { TRANSITION_DURATION, transition, screen, setScreen, setIsMobile } =
    useStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="select-none pointer-events-none">
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20
      text-white text-center font-doodle text-7xl md:text-8xl pointer-events-none"
        variants={{
          visible: {
            opacity: 1,
            transition: {
              duration: TRANSITION_DURATION / 2,
              delay: TRANSITION_DURATION - 0.3,
            },
          },
          hidden: {
            opacity: 0,
            transition: {
              duration: TRANSITION_DURATION / 2,
            },
          },
        }}
        initial={{
          opacity: 1,
        }}
        animate={transition ? "visible" : "hidden"}
      >
        Code<span className="text-black">X</span>
      </motion.div>
      {/* Intro  */}
      <motion.section
        animate={!transition && screen === "home" ? "visible" : "hidden"}
        className={`z-10 fixed top-0 h-full w-full  flex justify-center items-center flex-col
        ${screen === "home" ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <motion.h2
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: TRANSITION_DURATION,
                duration: 1.5,
              },
            },
            hidden: {
              opacity: 0,
              y: 50,
              transition: {
                delay: 0.6,
                duration: 1.5,
              },
            },
          }}
          initial={{
            opacity: 0,
            y: 50,
          }}
          className="lg:text-6xl text-3xl font-gummy tracking-tight text-white"
        >
          In the Beginning
        </motion.h2>
        <motion.p
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: TRANSITION_DURATION + 0.3,
                duration: 1.5,
              },
            },
            hidden: {
              opacity: 0,
              y: 50,
              transition: {
                delay: 0.3,
                duration: 1.5,
              },
            },
          }}
          initial={{
            opacity: 0,
            y: 50,
          }}
          className="text-white/80 max-w-[600px] text-center tracking-tight leading-relaxed font-funnel"
        >
          Design, develop, optimise and maintain their websites for SEO and UX
          purposes, with a focus on getting an edge on the competition and a
          return on investment.
        </motion.p>
        <motion.button
          onClick={() => setScreen("menu")}
          className="text-sm bg-transparent hover:bg-white font-semibold
           text-white hover:text-black border-2
            border-white  transition-colors duration-500 px-4 py-2 mt-4 rounded-lg uppercase"
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: TRANSITION_DURATION + 0.6,
                duration: 1.5,
              },
            },
            hidden: {
              opacity: 0,
              y: 50,
              transition: {
                duration: 1.5,
              },
            },
          }}
          initial={{
            opacity: 0,
            y: 50,
          }}
        >
          Explore
        </motion.button>
      </motion.section>
      {/* MENU */}
      <motion.section
        animate={screen === "menu" ? "visible" : "hidden"}
        className={`absolute  z-20 lg:top-0 bottom-0 sm:bottom-0 left-0 text-white lg:h-full flex  lg:items-center items-end p-6 lg:w-1/2 justify-center  sm:w-full 
          ${screen === "menu" ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <motion.div
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1, delay: TRANSITION_DURATION },
            },
            hidden: { opacity: 0, y: 50, transition: { duration: 1 } },
          }}
          initial={{
            opacity: 0,
            y: 50,
          }}
        >
          <MenuSection />
        </motion.div>
      </motion.section>
    </main>
  );
}

const MenuSection = () => {
  const { index, setIndex, isMobile } = useStore();
  const data = [
    {
      logo: <Fan />,
      title: "Three.js",
      desc: `Three.js is a cross-browser JavaScript library and application programming interface used to create and display animated 3D computer graphics in a web browser using WebGL`,
      descMob: `Three.js is a cross-browser JavaScript library and application programming interface used to create 3d websites.`,
    },
    {
      logo: <Swords />,
      title: "OpenGL ",
      desc: `OpenGL Shading Language is a high-level shading language with a syntax based on the C programming language. It was created by the OpenGL ARB to give developers more direct control of the graphics pipeline without having to use ARB assembly language or hardware-specific languages.`,
      descMob: `OpenGL Shading Language is a high-level shading language with a syntax based on the C programming language. .`,
    },
    {
      logo: <Crown />,
      title: "Virtual reality",
      desc: `(VR) is a technology that simulates a computer-generated environment and makes it possible to interact with it in a very realistic way. with applications in fields such as gaming, education, healthcare, and entertainment`,
      descMob: `(VR) is a technology that simulates a computer-generated environment and makes it possible to interact with it in a very realistic way. `,
    },
    {
      logo: <Sparkles />,
      title: "Augmented reality",
      desc: `Augmented reality is an interactive experience that enhances the real world with computer-generated perceptual information. Using software, apps, and hardware such as AR glasses, augmented reality overlays digital content onto real-life environments and objects.`,
      descMob: `Augmented reality is an interactive experience that enhances the real world with computer-generated perceptual information.`,
    },
  ];
  return (
    <>
      <div className="flex flex-col  ">
        <div className="border rounded-xl p-2 max-w-[500px] mb-5 ">
          <AnimatePresence mode="wait">
            <motion.div className="flex flex-col gap-1">
              <motion.h1
                className="text-3xl overflow-clip font-gummy"
                key={`title-${index}`}
                initial={{ opacity: 0, y: 20 }}
                exit={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {data[index].title}
              </motion.h1>
              <motion.p
                key={`desc-${index}`}
                initial={{ opacity: 0, y: 20 }}
                exit={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-clip font-funnel"
              >
                {isMobile ? data[index].descMob : data[index].desc}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          {data.map((info, i) => (
            <motion.button
              animate={{
                y: index === i ? -5 : 0,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
              key={i}
              onClick={() => setIndex(i)}
              s
              className={`rounded-lg p-2 ${
                index === i
                  ? "bg-white text-zinc-800"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {info.logo}
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
};
