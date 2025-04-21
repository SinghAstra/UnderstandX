import { siteConfig } from "@/config/site";
import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import BorderHoverLink from "../ui/border-hover-link";

interface FooterProps {
  withDelay?: boolean;
}

const Footer = ({ withDelay = true }: FooterProps) => {
  return (
    <MaxWidthWrapper>
      <footer className="flex  py-4 relative items-center justify-between border-t border-border  w-full  mx-auto  bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]">
        <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>

        {withDelay ? (
          <AnimationContainer delay={0.1}>
            <span className="text-muted-foreground flex gap-2 items-center tracking-wider">
              Made by{" "}
              <BorderHoverLink
                href={siteConfig.links.github}
                className="text-foreground tracking-wider"
              >
                SinghAstra
              </BorderHoverLink>
            </span>
          </AnimationContainer>
        ) : (
          <span className="text-muted-foreground flex gap-2 items-center tracking-wider">
            Made by{" "}
            <BorderHoverLink
              href={siteConfig.links.github}
              className="text-foreground tracking-wider"
            >
              SinghAstra
            </BorderHoverLink>
          </span>
        )}

        {withDelay ? (
          <AnimationContainer delay={0.4}>
            <BorderHoverLink
              href={siteConfig.links.twitter}
              className="text-foreground tracking-wider"
            >
              Connect on X
            </BorderHoverLink>
          </AnimationContainer>
        ) : (
          <BorderHoverLink
            href={siteConfig.links.twitter}
            className="text-foreground tracking-wider"
          >
            Connect on X
          </BorderHoverLink>
        )}
      </footer>
    </MaxWidthWrapper>
  );
};

export default Footer;
