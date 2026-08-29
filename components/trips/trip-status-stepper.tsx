"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { tripSteps } from "@/lib/trips/trip-utils";

type TripStatusStepperProps = {
  activeStep: number;
  status: string;
};

const usePrevious = <T,>(value: T) => {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const TripStatusStepper = ({ activeStep, status }: TripStatusStepperProps) => {
  const previousStep = usePrevious(activeStep);
  const didAdvance = previousStep !== undefined && activeStep > previousStep;
  const isTripComplete = status === "completed";

  const progress =
    tripSteps.length <= 1
      ? 0
      : isTripComplete
        ? 100
        : (Math.min(activeStep, tripSteps.length - 1) / (tripSteps.length - 1)) * 100;

  const getStepState = (index: number) => {
    if (isTripComplete || index < activeStep) {
      return "completed";
    }

    if (index === activeStep) {
      return "current";
    }

    return "pending";
  };

  return (
    <div className="relative w-full px-1 pt-1">
      <div className="absolute left-5 right-5 top-5 h-1 rounded-full bg-default-200" />
      <motion.div
        className="absolute left-5 top-5 h-1 rounded-full bg-primary"
        initial={false}
        animate={{ width: `calc((100% - 2.5rem) * ${progress / 100})` }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      />

      <ol className="relative flex w-full items-start justify-between">
        {tripSteps.map((label, index) => {
          const stepState = getStepState(index);
          const justActivated = didAdvance && index === activeStep;
          const justCompleted = didAdvance && index === previousStep;

          return (
            <li key={label} className="flex flex-col items-center gap-2">
              <motion.div
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300",
                  stepState === "completed" &&
                    "border-primary bg-primary text-primary-foreground",
                  stepState === "current" &&
                    "border-primary bg-background text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]",
                  stepState === "pending" &&
                    "border-default-200 bg-default-200 text-default-600"
                )}
                initial={false}
                animate={
                  justCompleted
                    ? { scale: [1, 1.14, 1] }
                    : justActivated
                      ? { scale: [1, 1.18, 1], rotate: [0, -4, 0] }
                      : stepState === "current"
                        ? { scale: [1, 1.06, 1] }
                        : { scale: 1 }
                }
                transition={
                  justCompleted
                    ? { duration: 0.4, ease: "easeOut" }
                    : justActivated
                      ? { duration: 0.45, ease: "easeOut" }
                      : stepState === "current"
                        ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.3 }
                }
              >
                <AnimatePresence mode="wait">
                  {stepState === "completed" ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, rotate: -90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                      className="flex items-center justify-center"
                    >
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`number-${index}`}
                      initial={
                        justActivated ? { y: 8, opacity: 0, scale: 0.6 } : false
                      }
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -8, opacity: 0, scale: 0.6 }}
                      transition={{ type: "spring", stiffness: 380, damping: 24 }}
                    >
                      {index + 1}
                    </motion.span>
                  )}
                </AnimatePresence>

                {stepState === "current" ? (
                  <motion.span
                    className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.35, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                  />
                ) : null}
              </motion.div>

              <motion.span
                className={cn(
                  "text-center text-xs font-medium sm:text-sm",
                  stepState === "completed" && "text-primary",
                  stepState === "current" && "text-default-900",
                  stepState === "pending" && "text-default-500"
                )}
                animate={
                  justActivated
                    ? { opacity: [0.5, 1], y: [4, 0] }
                    : { opacity: 1, y: 0 }
                }
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {label}
              </motion.span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default TripStatusStepper;
