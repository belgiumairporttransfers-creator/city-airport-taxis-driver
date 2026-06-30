"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  useCompleteTrip,
  useMarkPassengerOnboard,
  useMarkTripArrived,
  useStartTrip,
} from "@/hooks/queries/use-trips";
import {
  getNextTripAction,
  tripActionLabels,
  type TripAction,
} from "@/lib/trips/trip-utils";

type TripActionBarProps = {
  bookingId: string;
  status: string;
};

const TripActionBar = ({ bookingId, status }: TripActionBarProps) => {
  const nextAction = getNextTripAction(status);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const markArrived = useMarkTripArrived(bookingId);
  const markOnboard = useMarkPassengerOnboard(bookingId);
  const startTrip = useStartTrip(bookingId);
  const completeTrip = useCompleteTrip(bookingId);

  const mutationMap = {
    arrived: markArrived,
    "passenger-onboard": markOnboard,
    start: startTrip,
    complete: completeTrip,
  } as const;

  const activeMutation = nextAction ? mutationMap[nextAction] : null;
  const isPending = activeMutation?.isPending ?? false;

  const runAction = async (action: TripAction) => {
    await mutationMap[action].mutateAsync();
  };

  if (!nextAction) {
    return (
      <motion.p
        key="completed"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-success"
      >
        This trip has been completed.
      </motion.p>
    );
  }

  const handlePrimaryClick = () => {
    if (nextAction === "complete") {
      setConfirmOpen(true);
      return;
    }

    void runAction(nextAction);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={nextAction}
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <Button onClick={handlePrimaryClick} disabled={isPending}>
            {isPending ? "Please wait..." : tripActionLabels[nextAction]}
          </Button>
        </motion.div>
      </AnimatePresence>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await runAction("complete");
          setConfirmOpen(false);
        }}
        title="Complete trip?"
        description="Confirm that the passenger has been dropped off and the trip is finished."
        confirmLabel="Complete trip"
      />
    </>
  );
};

export default TripActionBar;
