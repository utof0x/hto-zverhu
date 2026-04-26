import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { Team } from "../types";
import progressSrc from "../assets/progress.mp3";

interface Props {
  team: Team;
  answer: number;
  tolerance: number;
  question: string;
  onDone: () => void;
}

const PILL_WIDTH = 180;

export default function BonusScreen({
  team,
  answer,
  question,
  onDone,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [pillLeft, setPillLeft] = useState(8);
  const trackRef = useRef<HTMLDivElement>(null);

  const count = useMotionValue(0);
  const displayCount = useTransform(count, (v) => `${Math.round(v)}%`);

  const teamClass = team === "men" ? "bonus-men" : "bonus-women";

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (!revealed) {
          const trackWidth = trackRef.current?.clientWidth ?? 800;
          const padding = 8;
          const maxLeft = trackWidth - PILL_WIDTH - padding;
          const target = (answer / 100) * trackWidth - PILL_WIDTH / 2;
          setPillLeft(Math.max(padding, Math.min(maxLeft, target)));
          setRevealed(true);
          const audio = new Audio(progressSrc);
          audio.play().catch(() => {});
          animate(count, answer, {
            duration: 2,
            ease: "easeInOut",
            onComplete: () => setAnimDone(true),
          });
        } else if (animDone) {
          onDone();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, animDone, answer, count, onDone]);

  return (
    <div className="screen">
      <div className="bonus-content">
        <motion.div
          className={`bonus-team-badge ${teamClass}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Бонусне питання!
        </motion.div>

        <motion.div
          className={`bonus-question-placeholder ${teamClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {question}
        </motion.div>

        <div className="bonus-track-wrapper" style={{ visibility: revealed ? 'visible' : 'hidden' }}>
          <div className={`bonus-track ${teamClass}`} ref={trackRef}>
            {revealed && (
              <motion.div
                className="bonus-pill"
                style={{ width: PILL_WIDTH }}
                initial={{ left: 8 }}
                animate={{ left: pillLeft }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <motion.span
                  className="bonus-pill-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {displayCount}
                </motion.span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
