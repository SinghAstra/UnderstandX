"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { slideFadeInVariantFromTopToBottom } from "@/lib/variants";
import { motion } from "framer-motion";
import { ZapIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [scroll, setScroll] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 8) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 inset-x-0 p-4 w-full z-50 transition-all duration-300 ease-in-out border-b border-transparent",
          scroll && "bg-background/80 backdrop-blur-md border-border/50"
        )}
      >
        <motion.div
          variants={slideFadeInVariantFromTopToBottom}
          initial="hidden"
          whileInView="visible"
        >
          <div className="flex items-center justify-between max-w-[1200px] mx-auto">
            <Link href="/" className="text-lg logo font-normal text-primary">
              {siteConfig.name}
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.AUTH.SIGN_IN}
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                  className:
                    "ease-in-out hover:bg-muted/40 active:scale-[0.98]",
                })}
              >
                Sign In
              </Link>
              <Link href={ROUTES.AUTH.SIGN_UP}>
                <Button size={"sm"} className="ease-in-out active:scale-[0.98]">
                  Get Started
                  <ZapIcon
                    className="size-4 text-orange-500 fill-orange-500"
                    strokeWidth={2}
                  />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </header>
    </>
  );
};

export default Navbar;
