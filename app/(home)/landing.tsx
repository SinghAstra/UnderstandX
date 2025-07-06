"use client";

import AuthDialog from "@/components/componentX/auth-dialog";
import ConicGradientBackground from "@/components/componentX/conic-gradient-background";
import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import GradientInsetBackground from "@/components/ui/gradient-inset-background";
import MovingBackground from "@/components/ui/moving-background";
import MovingGlow from "@/components/ui/moving-glow";
import DashboardPreview from "@/components/ui/preview/dashboard-preview";
import RadialFadePulsatingBackground from "@/components/ui/radial-fade-pulsating-background";
import { siteConfig } from "@/config/site";
import { RepositoryPreview } from "@/interfaces/github";
import {
  blurInVariant,
  containerVariant,
  scaleInVariant,
} from "@/lib/variants";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { FaGithub, FaTwitterSquare } from "react-icons/fa";

const LandingPage = ({
  previewRepos,
}: {
  previewRepos: RepositoryPreview[];
}) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const toggleAuthDialog = () => {
    setShowAuthDialog(!showAuthDialog);
  };

  return (
    <div>
      <Navbar toggleAuthDialog={toggleAuthDialog} />
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
      >
        <div className="px-3 py-20 flex flex-col items-center justify-center text-center">
          <RadialFadePulsatingBackground />
          <motion.a
            href={siteConfig.links.twitter}
            target="_blank"
            variants={scaleInVariant}
            className="rounded group relative text-foreground px-3 py-1"
          >
            <MovingGlow />
            <GradientInsetBackground />
            <div className="absolute inset-0 group-hover:bg-muted/40 transition-all duration-200 z-[-3]" />
            <span
              className="z-10 text-sm 
          flex items-center justify-center gap-2"
            >
              <FaTwitterSquare className="size-3 " /> Follow For Updates
              <ArrowRightIcon className="size-3 transform-all duration-300 group-hover:translate-x-1" />
            </span>
          </motion.a>

          <motion.h1
            variants={blurInVariant}
            className="text-foreground text-center py-6 text-6xl md:text-7xl lg:text-8xl font-medium "
          >
            Understand <br />
            <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text">
              Repository
            </span>
          </motion.h1>
          <motion.p
            variants={blurInVariant}
            className="mb-8 text-lg md:text-xl tracking-tight text-muted-foreground "
          >
            Give me public github repository url &
            <br />I will explain the codebase.
          </motion.p>
          <div className="flex items-center justify-center gap-4">
            <motion.div
              variants={scaleInVariant}
              className="relative border px-3 py-1 rounded flex items-center group cursor-pointer"
              onClick={toggleAuthDialog}
            >
              <MovingBackground />
              Get started
              <ArrowRightIcon
                className="ml-1 size-4 transition-all duration-300 
                group-hover:translate-x-1"
              />
            </motion.div>
            <motion.a
              href={siteConfig.links.githubRepo}
              target="_blank"
              variants={scaleInVariant}
              className="rounded group relative text-foreground px-3 py-1"
            >
              <MovingGlow />
              <GradientInsetBackground />
              <div className="absolute inset-0 group-hover:bg-muted/40 transition-all duration-200 z-[-3]" />
              <span className="z-10 flex items-center justify-center gap-2">
                <FaGithub className="size-3 " /> Github
              </span>
            </motion.a>
          </div>
        </div>
        <div className="relative px-4 sm:px-8 ">
          <div className="relative  overflow-hidden rounded-sm border">
            <MovingGlow
              animationDuration={12}
              borderWidth={4}
              initialTransparent={300}
            />
            <div
              className="relative m-4 rounded-inherit "
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 80%, transparent 100%)",
              }}
            >
              <DashboardPreview previewRepos={previewRepos} />
            </div>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 h-1/4"
            style={{
              background:
                "linear-gradient(180deg,hsla(var(--background)/0),hsl(var(--background)))",
            }}
          />
        </div>

        <div className="min-h-screen relative px-4 sm:px-8 flex items-center">
          <div className="flex flex-col gap-4 sm:gap-8 sm:max-w-[60%] text-balance">
            <h1 className="text-5xl text-balance leading-[1.3]">
              Understand any Public Github Repository by generating Context
              Aware File Analysis
            </h1>
            <motion.div
              variants={scaleInVariant}
              className="relative border px-6 py-2 text-xl rounded flex items-center group cursor-pointer w-fit"
              onClick={toggleAuthDialog}
            >
              <MovingGlow />
              <GradientInsetBackground />
              Get started
              <ArrowRightIcon
                className="ml-1 size-4 transition-all duration-300 
                group-hover:translate-x-1"
              />
            </motion.div>
          </div>
          <ConicGradientBackground />
        </div>
        <AuthDialog
          isDialogVisible={showAuthDialog}
          setIsDialogVisible={setShowAuthDialog}
        />
      </motion.div>
      <Footer />
    </div>
  );
};

export default LandingPage;
