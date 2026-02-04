"use client";
import LampBackground from "@/components/component-x/lamp-background";
import MaskedGridBackground from "@/components/component-x/masked-grid-background";
import MovingBorder from "@/components/component-x/moving-border";
import Footer from "@/components/navigation/footer";
import Navbar from "@/components/navigation/navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import MagicCard from "@/components/ui/magic-card";
import { siteConfig } from "@/config/site";
import { FAQ, processSteps, reviews } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import {
  containerVariant,
  slideFadeInVariantFromBottomToTop,
} from "@/lib/variants";
import { motion } from "framer-motion";
import { ArrowRight, ArrowRightIcon, StarIcon } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="w-full">
      <Navbar />
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        className="min-h-screen relative flex flex-col gap-16 px-4 md:px-6 lg:px-8"
      >
        <div className="flex flex-col items-center justify-center w-full text-center min-h-screen relative max-w-300 mx-auto">
          <MaskedGridBackground />
          <motion.div
            variants={slideFadeInVariantFromBottomToTop}
            initial="hidden"
            whileInView="visible"
            className="flex flex-col items-center justify-center w-full text-center "
          >
            <Link href={siteConfig.links.twitter} target="_blank">
              <MovingBorder className="rounded">
                <div className="w-full h-full bg-background group transition-all duration-300 ease-in-out active:scale-[0.98]">
                  <div className="w-full rounded flex items-center justify-center gap-2 px-4 py-2 hover:bg-muted/20 transition-all duration-300 ease-in-out">
                    <h3 className="text-foreground text-xs font-medium uppercase tracking-wider">
                      Follow the journey on X
                    </h3>
                    <ArrowRight
                      className="size-4 ml-1 group-hover:translate-x-1 transition-all duration-300 ease-in-out text-muted-foreground"
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </MovingBorder>
            </Link>
            <h1 className="text-center py-6 text-5xl font-medium text-balance tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-tight w-full">
              Understand any codebase{" "}
              <span className="opacity-50">instantly.</span>
            </h1>
            <p className="mb-12 text-lg tracking-normal leading-relaxed text-muted-foreground md:text-xl text-balance max-w-3xl">
              Navigate complex GitHub repositories with context-aware analysis.
              <br className="hidden md:block" />
              <span className="hidden md:block">
                From architecture to line-by-line logic, we explain it all.
              </span>
            </p>
            <Link href={ROUTES.AUTH.SIGN_IN}>
              <Button
                size={"lg"}
                className="text-lg group transition-all duration-300 ease-in-out active:scale-[0.98]"
              >
                Start Analyzing Now
                <ArrowRight
                  className="size-4 transition-all duration-300 ease-in-out group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="max-w-300 mx-auto w-full">
          <motion.div
            variants={slideFadeInVariantFromBottomToTop}
            initial="hidden"
            whileInView="visible"
          >
            <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto gap-4">
              <MovingBorder className="rounded">
                <div className="w-full h-full bg-background group transition-all duration-300 ease-in-out active:scale-[0.98]">
                  <div className="w-full rounded flex items-center justify-center px-4 py-2 hover:bg-muted/20 transition-all duration-300 ease-in-out">
                    <h3 className="text-foreground text-xs font-medium uppercase tracking-wider">
                      The Workflow
                    </h3>
                  </div>
                </div>
              </MovingBorder>
              <h2 className="text-center text-3xl md:text-5xl font-medium tracking-tight mt-4">
                Zero to Comprehension in Seconds
              </h2>
              <p className="text-center lg:text-center text-lg tracking-normal leading-relaxed text-muted-foreground max-w-lg">
                Just drop a link, let our engine digest the context, and explore
                the code like a maintainer.
              </p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full py-8 gap-4">
            {processSteps.map((process, id) => (
              <motion.div
                variants={slideFadeInVariantFromBottomToTop}
                initial="hidden"
                whileInView="visible"
                key={id}
              >
                <MagicCard className="flex flex-col items-start justify-center w-full p-6 border border-border rounded-lg transition-all duration-300 ease-in-out hover:shadow-md hover:border-foreground/20 active:scale-[0.98]">
                  <div className="flex items-center justify-between w-full">
                    <process.icon
                      strokeWidth={2}
                      className="size-8 text-foreground"
                    />
                    <span className="border-2 text-foreground font-medium text-2xl rounded-full w-12 h-12 flex items-center justify-center bg-background">
                      {id + 1}
                    </span>
                  </div>

                  <div className="flex flex-col items-start gap-2 mt-6">
                    <h3 className="font-medium text-foreground tracking-tight">
                      {process.title}
                    </h3>
                    <p className="text-sm tracking-normal leading-relaxed text-muted-foreground">
                      {process.description}
                    </p>
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="max-w-300 mx-auto w-full">
          <motion.div
            variants={slideFadeInVariantFromBottomToTop}
            initial="hidden"
            whileInView="visible"
          >
            <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto gap-4">
              <MovingBorder className="rounded">
                <div className="w-full h-full group transition-all duration-300 ease-in-out active:scale-[0.98]">
                  <div className="w-full rounded flex items-center justify-center px-4 py-2 hover:bg-muted/20 transition-all duration-300 ease-in-out">
                    <h3 className="text-foreground text-xs font-medium uppercase tracking-wider">
                      Trusted by Developers
                    </h3>
                  </div>
                </div>
              </MovingBorder>
              <h2 className="text-center lg:text-center text-3xl md:text-5xl leading-[1.1] font-medium font-heading text-foreground tracking-tight mt-4">
                Loved by engineers, <br className="hidden md:block" />
                built for clarity.
              </h2>
              <p className="text-center text-lg tracking-normal leading-relaxed text-muted-foreground max-w-lg">
                See how developers are using {siteConfig.name} to master complex
                codebases and ship faster.
              </p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
            {reviews.map((review, index) => (
              <motion.div
                variants={slideFadeInVariantFromBottomToTop}
                initial="hidden"
                whileInView="visible"
                className="row-span-1"
                key={index}
              >
                <MagicCard className="flex flex-col justify-between p-6 border border-border rounded-lg transition-all duration-300 ease-in-out hover:shadow-md  active:scale-[0.98] h-full">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-medium text-muted-foreground tracking-tight">
                      {review.name}
                    </h4>
                    <p className="text-muted-foreground pb-4 tracking-normal leading-relaxed">
                      {review.review}
                    </p>
                  </div>

                  <div className="w-full flex flex-row gap-1">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <StarIcon
                        key={i}
                        className="size-4 fill-yellow-500 text-yellow-500"
                        strokeWidth={2}
                      />
                    ))}
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          variants={slideFadeInVariantFromBottomToTop}
          initial="hidden"
          whileInView="visible"
          className="relative min-h-screen flex flex-col items-center justify-center max-w-300  w-full mx-auto"
        >
          <LampBackground />
          <div className="flex flex-col items-center justify-center relative w-full text-center gap-6">
            <h2 className="text-center text-4xl md:text-7xl font-medium tracking-tight">
              Decode the complexity <br />
              of open source.
            </h2>
            <p className="text-muted-foreground text-lg tracking-normal leading-relaxed max-w-md mx-auto">
              Stop grepping through folders and guessing dependencies.
              {siteConfig.name} provides the structural clarity you need to
              master any codebase and start contributing in record time.
            </p>
            <div>
              <Link href={ROUTES.AUTH.SIGN_IN}>
                <Button
                  className="group cursor-pointer text-lg transition-all duration-300 ease-in-out active:scale-[0.98]"
                  size={"lg"}
                >
                  Get Started for free
                  <ArrowRightIcon
                    className="size-4 transition-all duration-300 ease-in-out group-hover:translate-x-1 cursor-pointer"
                    strokeWidth={2}
                  />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={slideFadeInVariantFromBottomToTop}
          initial="hidden"
          whileInView="visible"
          className="relative min-h-screen flex flex-col items-center justify-center gap-8 mb-20 px-4 sm:px-8 max-w-300 mx-auto w-full"
        >
          <div className="flex flex-col items-center justify-center w-full pt-12 gap-4">
            <h2 className="text-3xl font-medium text-center md:text-5xl tracking-tight text-foreground">
              Everything you need to know
            </h2>
            <p className="max-w-lg text-center text-muted-foreground text-lg tracking-normal leading-relaxed">
              Common questions about {siteConfig.name} and how we help you
              master complex codebases faster.
            </p>
          </div>
          <Accordion
            type="single"
            className="rounded w-full mx-auto mt-20"
            collapsible
          >
            {FAQ.map((faq) => (
              <AccordionItem
                className="hover:bg-muted/20 px-4 transition-all duration-300 ease-in-out"
                key={faq.id}
                value={faq.id}
              >
                <AccordionTrigger className="text-xl font-normal cursor-pointer tracking-normal">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground tracking-normal leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        <Footer />
      </motion.div>
    </div>
  );
};

export default HomePage;
