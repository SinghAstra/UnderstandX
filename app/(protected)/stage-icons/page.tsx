"use client";

import MultiStepIcons, {
  Stage,
} from "@/components/layoutx-ui/multi-step-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Rocket, Shield, User, UserCircle } from "lucide-react";
import React, { useState } from "react";

// Sample static stages array
const initialStages: Stage[] = [
  {
    id: "signup",
    icon: User,
    status: "completed",
  },
  {
    id: "profile",
    icon: UserCircle,
    status: "current",
  },
  {
    id: "verification",
    icon: Shield,
    status: "pending",
  },
  {
    id: "onboarding",
    icon: Rocket,
    status: "pending",
  },
];

const MultiStepIconsExample = () => {
  const [isHorizontal, setIsHorizontal] = useState(true);

  const toggleDirection = () => {
    setIsHorizontal((isHorizontal) => !isHorizontal);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-5xl mx-auto">
      <MultiStepIcons
        stages={initialStages}
        className={isHorizontal ? "w-full" : "h-full flex-1"}
        direction={isHorizontal ? "horizontal" : "vertical"}
      />
      <Button variant={"outline"} onClick={toggleDirection} className="mt-4">
        {isHorizontal ? "Vertical" : "Horizontal"}
        <Rocket className="ml-2" />
      </Button>
    </div>
  );
};

export default MultiStepIconsExample;
