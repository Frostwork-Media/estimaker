import { IconBrandTwitterFilled } from "@tabler/icons-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Container } from "@/components/Container.tsx";
import { cn } from "@/lib/utils.ts";

const smallWhiteLink =
  "text-neutral-400 hover:text-neutral-300 hover:underline";

export function LandingFooter() {
  return (
    <div className="bg-neutral-950 text-white py-6 sm:py-32">
      <Container>
        <Link to={"/"}>
          <LogoName className="sm:hidden" />
        </Link>
        <div className="landing-footer-grid">
          <div>
            <Link to={"/"}>
              <LogoName className="hidden sm:flex mb-12" />
            </Link>
            <div className="flex gap-3 items-center mb-3">
              <SocialLink
                href="https://twitter.com/nathanpmyoung"
                icon={
                  <IconBrandTwitterFilled className="w-4 h-4 text-neutral-950" />
                }
              />
            </div>
            <span className="text-[12px] text-neutral-400">
              © {new Date().getFullYear() /* TODO: get from package.json */}{" "}
              Estimaker. All rights reserved.
            </span>
          </div>
          <div className="mb-12 sm:mb-0">
            <p className="font-bold mb-1.5">Resources</p>
            <ul className="text-neutral-400 grid gap-1.5">
              <li>
                <a
                  href="https://chat.whatsapp.com/BKIVdkX4dQ0Gk3Oy4ZTm0M"
                  target="_blank"
                  className={smallWhiteLink}
                >
                  Join the community
                </a>
              </li>
              <li>GDPR</li>
              <li>
                <Link to="/privacy">Terms & Privacy</Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}

function LogoName({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center mb-12", className)}>
      <img src="/logo.svg" className="h-7 w-7 mr-1" />
      <h1 className="text-2xl font-extrabold">estimaker</h1>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: ReactNode }) {
  return (
    <a
      className="w-8 h-8 rounded-full bg-neutral-400 flex justify-center items-center hover:bg-white transition-colors"
      href={href}
      target="_blank"
    >
      {icon}
    </a>
  );
}
