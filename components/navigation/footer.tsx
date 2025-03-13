import { siteConfig } from "@/config/site";
import Link from "next/link";
import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";

const Footer = () => {
  return (
    <MaxWidthWrapper>
      <footer className="flex  py-4 relative items-center justify-between border-t border-border  w-full  mx-auto  bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]">
        <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>

        <AnimationContainer delay={0.1}>
          <span className=" text-neutral-200 text-sm flex items-center tracking-wider">
            Made by{" "}
            <Link href={siteConfig.links.github} className="ml-1 underline ">
              SinghAstra
            </Link>
          </span>
        </AnimationContainer>
        <AnimationContainer delay={0.4}>
          <span className="text-neutral-200 text-sm flex items-center tracking-wider">
            <Link href={siteConfig.links.twitter} className="underline">
              Connect on X
            </Link>
          </span>
        </AnimationContainer>
      </footer>
    </MaxWidthWrapper>
  );
};

export default Footer;