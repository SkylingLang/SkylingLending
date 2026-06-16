"use client";

import { useEffect, useRef, useState } from "react";

type LessonCard = {
  number: string;
  title: string;
  text: string;
};

type CardState = {
  opacity: number;
  rotate: number;
  scale: number;
  y: number;
  z: number;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

function getCardState(progress: number, index: number): CardState {
  const start = index * 0.2;
  const enter = clamp((progress - start) / 0.25);
  const settle = easeOutCubic(enter);
  const nextStart = (index + 1) * 0.2;
  const nextEnter = clamp((progress - nextStart) / 0.25);
  const nextPressure = index < 3 ? clamp((nextEnter - 0.2) / 0.58) : 0;
  const fadeOut = easeInOutCubic(nextPressure);
  const direction = index % 2 === 0 ? -1 : 1;
  const enterOpacity = enter <= 0 ? 0 : clamp(easeOutCubic(enter / 0.22));

  return {
    y: 760 - settle * 760 - fadeOut * 54,
    rotate: direction * (8 - settle * 8),
    scale: 1 - fadeOut * 0.2,
    opacity: clamp(enterOpacity - fadeOut),
    z: 10 + index,
  };
}

export default function MovingLessonSection({ cards }: { cards: LessonCard[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const raw = travel > 0 ? -rect.top / travel : 0;
      setProgress(clamp(raw));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const finalFade = easeInOutCubic(clamp((progress - 0.66) / 0.2));
  const leftStyle = {
    opacity: 1 - finalFade,
    transform: `scale(${1 - finalFade * 0.12}) translateY(${finalFade * -22}px)`,
  };

  return (
    <section className="movingLessons" id="trial" ref={sectionRef}>
      <div className="lessonSticky">
        <div className="lessonLeft" style={leftStyle}>
          <h2>
            Про школу
            <br />
            Skyling
          </h2>
        </div>

        <div className="lessonDeck" aria-label="Карточки пробного урока">
          {cards.map((card, index) => {
            const state = getCardState(progress, index);
            const lastExit = index === cards.length - 1 ? finalFade : 0;

            return (
              <article
                className="movingLessonCard"
                key={card.number}
                style={{
                  opacity: Math.max(0, state.opacity - lastExit),
                  zIndex: state.z,
                  transform: `translate3d(0, ${state.y}px, 0) rotate(${state.rotate}deg) scale(${
                    state.scale - lastExit * 0.12
                  })`,
                }}
              >
                <span className="lessonNumber">{card.number}</span>
                <div className="lessonImage">
                  <span>Фото урока {card.number}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
