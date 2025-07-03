"use client";

import GradientInsetBackground from "@/components/ui/gradient-inset-background";
import MovingBackground from "@/components/ui/moving-background";
import MovingGlow from "@/components/ui/moving-glow";
import RadialFadePulsatingBackground from "@/components/ui/radial-fade-pulsating-background";
import { siteConfig } from "@/config/site";
import {
  blurInVariant,
  containerVariant,
  scaleInVariant,
} from "@/lib/variants";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaTwitterSquare } from "react-icons/fa";
interface HeroSectionProps {
  isAuthenticated: boolean;
}

const HeroSection = ({ isAuthenticated }: HeroSectionProps) => {
  // const href = isAuthenticated ? "/dashboard" : "/auth/sign-in";

  // const handleGetStarted = () => {
  //   if (!isAuthenticated) {
  //     redirect("/auth/sign-in");
  //   }

  //   if (isAuthenticated) {
  //     redirect("/dashboard");
  //   }
  // };

  return (
    <motion.div
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
    >
      {/* Hero Section */}
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
            className="relative border px-3 py-1 rounded"
          >
            <MovingBackground />
            <Link
              href={isAuthenticated ? "/dashboard" : "/auth/sign-in"}
              className="flex items-center group"
            >
              Get started
              <ArrowRightIcon
                className="ml-1 size-4 transition-all duration-300 
                group-hover:translate-x-1"
              />
            </Link>
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
      <div className="relative mx-4 sm:mx-8 overflow-hidden rounded-sm border">
        <MovingGlow
          animationDuration={12}
          borderWidth={4}
          initialTransparent={300}
        />
        <div className="relative m-4 rounded-inherit ">
          <Image
            src="/assets/hero.png"
            alt="Dashboard"
            width={1200}
            height={1200}
            quality={100}
            className="w-full h-full "
          />
        </div>
        {/* <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
          <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div> */}
      </div>

      {/* Features Section */}
      {/* <MaxWidthWrapper className="pt-10">
        <FadeSlideIn delay={0.1}>
          <div className="flex flex-col w-full items-center lg:items-center justify-center py-8">
            <MagicBadge title="Process" />
          </div>
        </FadeSlideIn>
        <FadeSlideIn delay={0.2}>
          <ProcessGrid className="py-8 ">
            {Steps(href).map((step, idx) => (
              <ProcessCard key={idx} {...step} />
            ))}
          </ProcessGrid>
        </FadeSlideIn>
      </MaxWidthWrapper> */}

      {/* CTA Section */}
      {/* <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
        <LampContainer>
          <motion.div
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center gap-8  "
          >
            <h1 className="mt-8  text-foreground py-4  text-center text-4xl font-medium tracking-tight md:text-7xl">
              Understand <br />
              <span className="text-transparent bg-gradient-to-r from-yellow-500 to-pink-500 bg-clip-text">
                Github Repo
              </span>
              <br /> with{" "}
              <span className="text-transparent bg-gradient-to-r from-yellow-500 to-pink-500 bg-clip-text">
                UnderstandX
              </span>
            </h1>
            <BackgroundShine>
              <Link
                href={isAuthenticated ? "/dashboard" : "/auth/sign-in"}
                className="flex items-center "
              >
                Get started for free
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </BackgroundShine>
          </motion.div>
        </LampContainer>
      </MaxWidthWrapper> */}
    </motion.div>
  );
};

export default HeroSection;
