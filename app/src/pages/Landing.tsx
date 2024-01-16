import { SignInButton, useAuth } from "@clerk/clerk-react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Tabs from "@radix-ui/react-tabs";
import {
  IconBrandTwitterFilled,
  IconChevronLeft,
  IconChevronRight,
  IconMessages,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

const smOrangeLink =
  "py-2 px-3 pl-5 bg-orange-500 text-foreground font-bold text-sm rounded-3xl flex items-center gap-1 cursor-pointer";

const lgBlackButton =
  "rounded-2xl bg-neutral-900 text-white font-bold px-8 py-4 mt-8 text-xl inline-flex gap-2 items-center";

export default function Landing() {
  const { isSignedIn } = useAuth();
  return (
    <>
      <div className="landing-header py-6 pb-24">
        <Container className="relative text-center z-10 mb-8">
          <div className="bg-neutral-900 text-white rounded-full w-full max-w-2xl mx-auto p-5 pl-12 mb-20 flex justify-between">
            <div className="flex items-center">
              <img src="/logo.svg" className="h-7 w-7 mr-1" />
              <h1 className="text-2xl font-extrabold">estimaker</h1>
            </div>
            <div className="flex gap-6">
              <button className="font-bold text-sm">Features</button>
              {isSignedIn ? (
                <Link to="/projects" className={smOrangeLink}>
                  Go to the app
                  <IconChevronRight />
                </Link>
              ) : (
                <SignInButton>
                  <div className={smOrangeLink}>
                    Try the app
                    <IconChevronRight />
                  </div>
                </SignInButton>
              )}
            </div>
          </div>
          <h2 className="text-7xl font-extrabold mb-6 text-wrap-balance leading-tight">
            Visualize Probability with Precision
          </h2>
          <SubtitleMessage>
            Simplify Complex Decisions with Our Probability Tree Generator
          </SubtitleMessage>
          {isSignedIn ? (
            <Link to="/projects" className={lgBlackButton}>
              Go to the app
              <IconChevronRight />
            </Link>
          ) : (
            <SignInButton>
              <div className={lgBlackButton}>
                Try the app
                <IconChevronRight />
              </div>
            </SignInButton>
          )}
        </Container>
        <div className="relative landing-lines">
          <Container className="z-10 relative">
            <img src="/images/screenshot.png" className="w-full" />
          </Container>
        </div>
      </div>
      <div className="bg-gradient-to-b from-orange-100 to-white py-36 rounded-t-[100px]">
        <Container>
          <Subtitle>Features</Subtitle>
          <Tabs.Root defaultValue="tree">
            <Tabs.List className="bg-white rounded-lg p-2 w-max">
              <FeatureTabTrigger value="tree">
                Intuitive Probability Tree Builder
              </FeatureTabTrigger>
              <FeatureTabTrigger value="realtime">
                Real-time Collaboration
              </FeatureTabTrigger>
              <FeatureTabTrigger value="analysis">
                Interactive Decision Analysis
              </FeatureTabTrigger>
              <FeatureTabTrigger value="export">
                Export and Share Results
              </FeatureTabTrigger>
            </Tabs.List>
            <FeatureTabContent value="tree" />
            <FeatureTabContent value="realtime" />
            <FeatureTabContent value="analysis" />
            <FeatureTabContent value="export" />
          </Tabs.Root>
        </Container>
      </div>
      <div className="bg-orange-500 py-36">
        <Container>
          <Subtitle className="mb-8">Why Estimaker?</Subtitle>
          <div className="grid grid-cols-3 gap-5">
            <WhyEstimakerSection />
            <WhyEstimakerSection />
            <WhyEstimakerSection />
            <WhyEstimakerSection />
            <WhyEstimakerSection />
            <WhyEstimakerSection />
          </div>
        </Container>
      </div>
      <div className="bg-orange-50 py-36">
        <Container className="text-center mb-16">
          <Subtitle className="mb-6">How it Works</Subtitle>
          <SubtitleMessage>
            Don’t take our word for it. Trust our users
          </SubtitleMessage>
        </Container>
        <div className="overflow-hidden ml-[calc((100vw-72rem)/2)] mb-8">
          <div className="flex gap-8 w-max">
            <HowItWorksSlide />
            <HowItWorksSlide />
            <HowItWorksSlide />
            <HowItWorksSlide />
          </div>
        </div>
        <div className="flex items-center">
          <div className="grow flex gap-1 justify-center pl-[160px]">
            <span className="bg-orange-500 w-2.5 h-2.5 rounded-full" />
            <span className="bg-neutral-200 w-2.5 h-2.5 rounded-full" />
            <span className="bg-neutral-200 w-2.5 h-2.5 rounded-full" />
          </div>
          <div className="flex gap-4 mr-8">
            <button className="w-12 h-12 rounded-full bg-white shadow-md flex justify-center items-center">
              <IconChevronLeft className="text-neutral-700 -ml-1" />
            </button>
            <button className="w-12 h-12 rounded-full bg-white shadow-md flex justify-center items-center">
              <IconChevronRight className="text-neutral-700 ml-px" />
            </button>
          </div>
        </div>
      </div>
      {/* <div>discover why they chose estimaker</div> */}
      <div className="py-36 bg-white">
        <Container>
          <Subtitle className="mb-6">Frequently Asked Questions</Subtitle>
          <Accordion.Root
            defaultValue={["q1"]}
            type="multiple"
            className="border-b-2 border-neutral-100"
          >
            <AccordionItem value="q1" />
            <AccordionItem value="q2" />
            <AccordionItem value="q3" />
          </Accordion.Root>
        </Container>
      </div>
      <div className="get-started py-36 relative">
        <Container className="z-10 relative">
          <Subtitle className="mb-4">Get Started for Free</Subtitle>
          <p className="text-xl text-foreground/90 w-[400px] text-wrap-balance">
            Simplify Complex Decisions with Our Probability Tree Generator
          </p>
          {isSignedIn ? (
            <Link to="/projects" className={lgBlackButton}>
              Go to the app
              <IconChevronRight />
            </Link>
          ) : (
            <SignInButton>
              <div className={lgBlackButton}>
                Try the app
                <IconChevronRight />
              </div>
            </SignInButton>
          )}
        </Container>
      </div>
      <div className="bg-neutral-950 text-white py-32">
        <Container>
          <div className="grid items-center grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-12">
            <div>
              <div className="flex items-center mb-10">
                <img src="/logo.svg" className="h-7 w-7 mr-1" />
                <h1 className="text-2xl font-extrabold">estimaker</h1>
              </div>
              <div className="flex gap-3 items-center mb-3">
                <SocialLink />
                <SocialLink />
                <SocialLink />
              </div>
              <span className="text-[12px] text-neutral-400">
                © {new Date().getFullYear() /* TODO: get from package.json */}{" "}
                Estimaker. All rights reserved.
              </span>
            </div>
            <div>
              <p className="font-bold mb-1.5">Resources</p>
              <ul className="text-neutral-400 grid gap-1.5">
                <li>Join the community</li>
                <li>GDPR</li>
                <li>Terms & Privacy</li>
                <li>Libraries</li>
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </>
    // <div className="p-12">
    //   <h1 className="text-3xl font-extrabold mb-6">Estimaker</h1>
    //   {isSignedIn ? (
    //     <Link to="/projects">Go To Dashboard</Link>
    //   ) : (
    //     <SignInButton afterSignInUrl="/projects" afterSignUpUrl="/projects">
    //       Log In
    //     </SignInButton>
    //   )}
    // </div>
  );
}

function FeatureTabTrigger({ children, ...props }: Tabs.TabsTriggerProps) {
  return (
    <Tabs.Trigger
      {...props}
      className="p-2 px-4 rounded-md font-medium text-neutral-900 hover:bg-neutral-100 transition-colors aria-[selected=true]:bg-orange-500"
    >
      {children}
    </Tabs.Trigger>
  );
}

function FeatureTabContent({ value }: { value: string }) {
  return (
    <Tabs.Content value={value} className="pt-24">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 items-center mb-16">
        <div>
          <h3 className="text-4xl font-semibold tracking-tight mb-4">
            Real-time Collaboration
          </h3>
          <p className="text-xl text-neutral-900/70">
            Ability for multiple users to work together on creating, modifying,
            and analyzing a probability tree diagram in real-time. This
            collaborative approach can be highly beneficial when teams or
            individuals need to collectively model and assess complex
            decision-making scenarios involving uncertainty and probability.
          </p>
        </div>
        <img src="/images/screenshot-realtime.png" alt={value} />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <FeatureTabLowerSection />
        <FeatureTabLowerSection />
        <FeatureTabLowerSection />
      </div>
    </Tabs.Content>
  );
}

function FeatureTabLowerSection() {
  return (
    <div className="grid gap-2">
      <IconCircle />
      <h4 className="text-lg font-semibold">Simultaneous Editing:</h4>
      <p className="text-neutral-700">
        Multiple users can work on the same probability tree diagram
        simultaneously. This means that team members can input events,
        probabilities, and branches in real time, and all changes are visible to
        everyone involved.
      </p>
    </div>
  );
}

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container mx-auto px-4 max-w-6xl", className)}>
      {children}
    </div>
  );
}

function Subtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-5xl font-extrabold mb-12", className)}>
      {children}
    </h2>
  );
}

function WhyEstimakerSection() {
  return (
    <div className="p-4 bg-white rounded-3xl grid gap-3">
      <IconCircle />
      <h4 className="text-xl font-semibold">Visualisation</h4>
      <p className="text-neutral-700">
        Estimaker allows for a clear visual representation of complex decision
        scenarios.
      </p>
    </div>
  );
}

function IconCircle() {
  return (
    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
      <IconMessages className="w-8 h-8 text-foreground" />
    </div>
  );
}

function SubtitleMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-2xl text-neutral-600">{children}</p>;
}

function HowItWorksSlide() {
  return (
    <div className="rounded-2xl bg-white border p-4 pt-8 pb-0 w-[650px] overflow-hidden">
      <div className="flex gap-6 content-start mb-6">
        <div>
          <h4 className="text-4xl font-semibold mb-4 text-wrap-balance tracking-tight">
            Create Your Tree
          </h4>
          <p className="text-neutral-600 text-lg text-wrap-pretty">
            Multiple users can work on the same probability tree diagram
            simultaneously. This means that team members can input events
          </p>
        </div>
        <div className="rounded-full bg-orange-500 w-16 h-16 shrink-0 flex items-center justify-center">
          <span className="text-xl font-bold">1</span>
        </div>
      </div>
      <img src="/images/screenshot-realtime.png" className="w-full -mb-32" />
    </div>
  );
}

function AccordionItem({ value }: { value: string }) {
  return (
    <Accordion.Item
      value={value}
      className="group data-[state=open]:pb-6 border-t-2 border-neutral-100"
    >
      <Accordion.Header>
        <Accordion.Trigger className="flex items-center justify-between w-full pt-6 pb-6 group-data-[state=open]:pb-4">
          <h3 className="font-semibold text-xl">Is Estimaker really free?</h3>
          <span className="w-9 h-9 rounded-full bg-neutral-100 group-hover:bg-neutral-200 justify-center items-center flex group-data-[state=open]:bg-orange-500">
            <IconPlus size={16} className="group-data-[state=open]:hidden" />
            <IconMinus
              size={16}
              className="hidden group-data-[state=open]:block"
            />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="text-xl leading-normal text-neutral-600">
        This information has been designed to assist you to use our service more
        effectively. If you don’t find an answer or need further help, feel free
        to contact us.
      </Accordion.Content>
    </Accordion.Item>
  );
}

function SocialLink() {
  return (
    <button className="w-8 h-8 rounded-full bg-neutral-400 flex justify-center items-center">
      <IconBrandTwitterFilled className="w-4 h-4 text-neutral-950" />
    </button>
  );
}
