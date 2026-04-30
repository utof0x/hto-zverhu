import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import wrongSrc from "../assets/wrong.mp3";

const TIMER_SECONDS = 30;
const TURNS = 4;

const base = import.meta.env.BASE_URL;
const roleMSrc = `${base}audio/role-swap-m.mp3`;
const roleWSrc = `${base}audio/role-swap-w.mp3`;
const menVideoSrc = `${base}m-role-swap.MP4`;
const womenVideoSrc = `${base}w-role-swap.mp4`;

type SeqItem =
  | { type: "men-video" }
  | { type: "men-timer"; turn: number }
  | { type: "women-timer"; turn: number }
  | { type: "women-video" };

const SEQUENCE: SeqItem[] = [
  { type: "men-video" },
  { type: "men-timer", turn: 0 },
  { type: "men-timer", turn: 1 },
  { type: "men-timer", turn: 2 },
  { type: "men-timer", turn: 3 },
  { type: "women-video" },
  { type: "women-timer", turn: 0 },
  { type: "women-timer", turn: 1 },
  { type: "women-timer", turn: 2 },
  { type: "women-timer", turn: 3 },
];

interface Props {
  onAdvance: () => void;
  onBack: () => void;
}

export default function RoleSwapChallenge({ onAdvance, onBack }: Props) {
  const [seqIdx, setSeqIdx] = useState(0);
  const [subStep, setSubStep] = useState<"active" | "idle" | "blank">("active");
  const [remaining, setRemaining] = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const current = SEQUENCE[seqIdx];
  const isTimer =
    current.type === "men-timer" || current.type === "women-timer";

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }

  function replayVideo() {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }

  // Start timer + audio when entering a timer item as 'active'
  useEffect(() => {
    if (subStep !== "active" || !isTimer) return;
    setRemaining(TIMER_SECONDS);
    setTimerDone(false);
    setTimerActive(true);

    stopAudio();
    const src = current.type === "men-timer" ? roleMSrc : roleWSrc;
    const audio = new Audio(src);
    audio.loop = true;
    audioRef.current = audio;
    audio.play().catch(() => {});

    return () => stopAudio();
  }, [seqIdx, subStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown tick
  useEffect(() => {
    if (!timerActive || timerDone) return;
    if (remaining <= 0) {
      setTimerDone(true);
      stopAudio();
      new Audio(wrongSrc).play().catch(() => {});
      setTimerActive(false);
      setSubStep(seqIdx >= SEQUENCE.length - 1 ? "blank" : "idle");
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, remaining, timerDone, seqIdx]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isForward =
        e.code === "Space" || e.code === "Enter" || e.code === "ArrowRight";
      const isBack = e.code === "ArrowLeft";
      if (!isForward && !isBack) return;
      e.preventDefault();
      e.stopImmediatePropagation();

      if (isForward) {
        setTimerActive(false);
        stopAudio();
        if (subStep === "idle") {
          setSeqIdx((i) => i + 1);
          setSubStep("active");
        } else if (subStep === "active") {
          if (seqIdx >= SEQUENCE.length - 1) setSubStep("blank");
          else setSubStep("idle");
        } else {
          onAdvance();
        }
      } else {
        setTimerActive(false);
        stopAudio();
        if (subStep === "blank") {
          setSubStep("active");
        } else if (subStep === "idle") {
          setSubStep("active");
        } else {
          if (seqIdx === 0) onBack();
          else {
            setSeqIdx((i) => i - 1);
            setSubStep("idle");
          }
        }
      }
    }
    window.addEventListener("keydown", onKey, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKey, { capture: true });
  }, [seqIdx, subStep, onAdvance, onBack]);

  if (subStep !== "active") return <div className="screen" />;

  if (current.type === "men-video" || current.type === "women-video") {
    const src = current.type === "men-video" ? menVideoSrc : womenVideoSrc;
    return (
      <div className="screen">
        <video
          ref={videoRef}
          src={src}
          className="final-video"
          autoPlay
          playsInline
          key={seqIdx}
        />
        <button className="final-video-reload" onClick={replayVideo}>
          ↺
        </button>
      </div>
    );
  }

  const isMen = current.type === "men-timer";
  const teamClass = isMen ? "bonus-men" : "bonus-women";
  const counterClass = isMen
    ? "challenge-counter-men"
    : "challenge-counter-women";

  return (
    <div className="screen">
      <div className={`challenge-counter ${counterClass}`}>
        {current.turn + 1} / {TURNS}
      </div>
      <motion.div
        className={`role-swap-timer ${teamClass}`}
        key={seqIdx}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
      >
        {remaining}
      </motion.div>
    </div>
  );
}
