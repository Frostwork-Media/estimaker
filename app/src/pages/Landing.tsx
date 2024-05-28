import { SignInButton, useAuth } from "@clerk/clerk-react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Tabs from "@radix-ui/react-tabs";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import {
  Edit2,
  Level,
  Mask,
  Messages2,
  People,
  Pharagraphspacing,
  Ranking,
  Share,
} from "iconsax-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Container } from "@/components/Container.tsx";
import { LandingFooter } from "@/components/LandingFooter.tsx";
import { LandingNavbar } from "@/components/LandingNavbar.tsx";
import { cn } from "@/lib/utils";

const lgBlackButton =
  "cursor-pointer rounded-3xl bg-neutral-900 text-white font-bold px-8 py-2 sm:py-4 mt-8 text-lg sm:text-xl inline-flex gap-2 items-center hover:bg-neutral-800/70 hover:scale-[1.025] transition-all transform-z-0";

export default function Landing() {
  const { isSignedIn } = useAuth();
  return (
    <>
      <div className="landing-header py-6 pb-12 sm:pb-24 overflow-hidden">
        <Container className="relative text-center z-10 mb-8">
          <LandingNavbar />
          <h2 className="tracking-tight text-4xl sm:text-7xl font-extrabold mb-6 text-wrap-balance leading-tight">
            Visualise Probability with{" "}
            <span className="squiggle">Precision</span>
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
      <div
        className="bg-gradient-to-b from-orange-100 via-white to-white py-12 sm:py-24 md:py-36 rounded-t-2xl sm:rounded-t-[100px]"
        id="features"
      >
        <Container>
          <Subtitle className="mb-6 sm:mb-6">Features</Subtitle>
          <Tabs.Root defaultValue="tree">
            <Tabs.List className="md:bg-white rounded-lg sm:p-2 md:w-max flex flex-wrap justify-center mx-auto md:mx-0 mb-12 md:mb-0">
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
      <div className="bg-orange-500 py-12 sm:py-24 md:py-36">
        <Container>
          <Subtitle className="mb-8">Why Estimaker?</Subtitle>
          <div className="grid md:grid-cols-3 gap-2 sm:gap-5">
            <WhyEstimakerSection
              icon={Ranking}
              title={`Visualisation`}
              content={`Estimaker allows for a clear visual representation of complex decision scenarios.`}
            />
            <WhyEstimakerSection
              icon={Level}
              title={`Accuracy`}
              content={`Estimaker automates probability calculations, reducing the risk of calculation errors.`}
            />
            <WhyEstimakerSection
              icon={Mask}
              title={`Scenario Analysis`}
              content={`Helps model and analyze different decision paths and their outcomes.`}
            />
            <WhyEstimakerSection
              icon={Pharagraphspacing}
              title={`Sensitivity Analysis`}
              content={`Estimaker allows users to assess the impact of changing probabilities on decisions.`}
            />
            <WhyEstimakerSection
              icon={Share}
              title={`Optimization`}
              content={`Estimaker supports identifying the best decisions based on objectives and probabilities.`}
            />
            <WhyEstimakerSection
              icon={People}
              title={`Communication`}
              content={`Facilitates effective communication of complex decisions and their potential outcomes to stakeholders and team members.`}
            />
          </div>
        </Container>
      </div>
      <div className="bg-orange-50 py-12 sm:py-24 md:py-36">
        <Container className="text-center mb-8 sm:mb-16">
          <Subtitle className="mb-2 sm:mb-6">How it Works</Subtitle>
          <SubtitleMessage>
            Don’t take our word for it. Trust our users
          </SubtitleMessage>
        </Container>
        <Carousel />
      </div>
      {/* <div>discover why they chose estimaker</div> */}
      <div className="py-12 sm:py-24 md:py-36 bg-white">
        <Container>
          <Subtitle className="mb-6">Frequently Asked Questions</Subtitle>
          <Accordion.Root
            defaultValue={["q1"]}
            type="multiple"
            className="border-b-2 border-neutral-100"
          >
            <AccordionItem
              value="q1"
              title="Is Estimaker really free?"
              content="..."
            />
            <AccordionItem
              value="q2"
              title="How secure is your platform?"
              content="..."
            />
            <AccordionItem
              value="q3"
              title="Who is behind Estimaker?"
              content="..."
            />
            <AccordionItem
              value="q3"
              title="How can I join the Estimaker community?"
              content="..."
            />
          </Accordion.Root>
        </Container>
      </div>
      <div className="get-started pt-12 sm:py-24 md:py-36 relative">
        <Container className="z-10 relative text-center sm:text-left">
          <Subtitle className="mb-4">Get Started for Free</Subtitle>
          <SubtitleMessage className="text-foreground/90 sm:w-[400px] text-wrap-balance">
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
        <img
          src="/images/get-started-lines.svg"
          alt="Lines"
          className="mt-12 sm:hidden"
        />
      </div>

      <LandingFooter />
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
      className="p-2 px-4 rounded-md font-medium text-xs sm:text-base text-neutral-900 hover:bg-neutral-100 transition-colors aria-[selected=true]:bg-orange-500"
    >
      {children}
    </Tabs.Trigger>
  );
}

function FeatureTabContent({ value }: { value: string }) {
  return (
    <Tabs.Content value={value} className="md:pt-24">
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 items-center mb-16">
        <div className="text-center md:text-left">
          <h3 className="text-xl sm:text-4xl font-semibold tracking-tight mb-4">
            Real-time Collaboration
          </h3>
          <p className="text-sm sm:text-xl text-neutral-900/80">
            Ability for multiple users to work together on creating, modifying,
            and analyzing a probability tree diagram in real-time. This
            collaborative approach can be highly beneficial when teams or
            individuals need to collectively model and assess complex
            decision-making scenarios involving uncertainty and probability.
          </p>
        </div>
        <img src="/images/screenshot-realtime.png" alt={value} />
      </div>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <FeatureTabLowerSection
          icon={Edit2}
          title="Simultaneous Editing"
          copy={`Multiple users can work on the same probability tree diagram simultaneously. This means that team members can input events, probabilities, and branches in real time, and all changes are visible to everyone involved.`}
        />
        <FeatureTabLowerSection
          icon={People}
          title="Collaborative Decision-Making"
          copy={`Real-time collaboration allows for discussions and decision-making within estimake environment. Users can exchange ideas, evaluate different scenarios, and make informed decisions as a team.`}
        />

        <FeatureTabLowerSection
          icon={Messages2}
          title="Enhanced Communication"
          copy={`Collaborative tools within Estimaker enable users to communicate and provide feedback on specific elements of the tree. Users can give their own values for any node.`}
        />
      </div>
    </Tabs.Content>
  );
}

function FeatureTabLowerSection({
  icon,
  title,
  copy,
}: {
  icon?: typeof People;
  title: string;
  copy: string;
}) {
  return (
    <div className="grid gap-3 text-center sm:text-left justify-items-center sm:justify-items-start">
      <IconCircle icon={icon} />
      <h4 className="sm:text-lg font-semibold">{title}:</h4>
      <p className="text-sm sm:text-base text-neutral-700">{copy}</p>
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
    <h2 className={cn("text-2xl sm:text-5xl font-extrabold mb-12", className)}>
      {children}
    </h2>
  );
}

function WhyEstimakerSection({
  icon,
  title,
  content,
}: {
  icon: typeof People;
  title: string;
  content: string;
}) {
  return (
    <div className="p-4 bg-white rounded-2xl sm:rounded-3xl grid gap-2 sm:gap-3">
      <IconCircle icon={icon} />
      <h4 className="text-base sm:text-xl font-semibold">{title}</h4>
      <p className="text-sm sm:text-base text-neutral-700">{content}</p>
    </div>
  );
}

function IconCircle({ icon: Icon = People }: { icon?: typeof People }) {
  return (
    <div className="w-9 h-9 sm:w-14 sm:h-14 bg-orange-100 rounded-full flex items-center justify-center">
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-foreground" />
    </div>
  );
}

function SubtitleMessage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-base sm:text-2xl text-neutral-600 text-wrap-balance",
        className,
      )}
    >
      {children}
    </p>
  );
}

function HowItWorksSlide({
  index,
  title,
  content,
}: {
  index: number;
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-2xl bg-white border p-4 pt-8 pb-0 w-[calc(100vw_-_48px)] sm:w-[650px] overflow-hidden">
      <div className="flex gap-6 content-start mb-6">
        <div>
          <h4 className="text-base sm:text-4xl font-semibold mb-4 text-wrap-balance tracking-tight">
            {title}
          </h4>
          <p className="text-neutral-600 text-sm sm:text-lg text-wrap-pretty">
            {content}
          </p>
        </div>
        <div className="rounded-full bg-orange-500 w-16 h-16 shrink-0  items-center justify-center hidden sm:flex">
          <span className="text-xl font-bold">{index}</span>
        </div>
      </div>
      <img
        src="/images/screenshot-realtime.png"
        className="sm:w-full -mb-6 sm:-mb-32"
      />
    </div>
  );
}

function AccordionItem({
  value,
  title,
  content,
}: {
  value: string;
  title: string;
  content: ReactNode;
}) {
  return (
    <Accordion.Item
      value={value}
      className="group data-[state=open]:pb-6 border-t-2 border-neutral-100"
    >
      <Accordion.Header>
        <Accordion.Trigger className="flex items-center justify-between w-full pt-6 pb-6 group-data-[state=open]:pb-4 text-left">
          <h3 className="font-semibold text-base sm:text-xl">{title}</h3>
          <span className="w-9 h-9 shrink-0 rounded-full bg-neutral-100 group-hover:bg-neutral-200 justify-center items-center flex group-data-[state=open]:bg-orange-500">
            <IconPlus size={16} className="group-data-[state=open]:hidden" />
            <IconMinus
              size={16}
              className="hidden group-data-[state=open]:block"
            />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="sm:text-xl leading-normal text-neutral-600">
        {content}
      </Accordion.Content>
    </Accordion.Item>
  );
}

function Carousel() {
  const slidesRef = useRef<HTMLDivElement>(null);
  const numSlides = 3;
  const [currentSlide, setCurrentSlide] = useState(0);
  const focusSlide = useCallback((index: number) => {
    if (!slidesRef.current) return;

    // get the offset of the slide from the ref
    const slides = slidesRef.current.children;
    const slideOffset = slides[index].getBoundingClientRect().left;
    const parentOffset = slidesRef.current.getBoundingClientRect().left;
    const offset = slideOffset - parentOffset;

    // translate the parent to the offset
    slidesRef.current.style.transform = `translateX(-${offset}px)`;

    setCurrentSlide(index);
  }, []);

  const autoplayTimer = useRef<number | null>(null);
  const startAutoplay = useCallback(() => {
    // start an interval to autoplay the carousel
    autoplayTimer.current = window.setInterval(() => {
      focusSlide((currentSlide + 1) % numSlides);
    }, 5000);
  }, [currentSlide, focusSlide]);
  const stopAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
  }, []);
  useEffect(() => {
    startAutoplay();

    // clear the interval when the component unmounts
    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  return (
    <>
      <div className="overflow-hidden pl-4 sm:pl-[calc((100vw-72rem)/2)] mb-8">
        <div
          ref={slidesRef}
          className="flex gap-8 w-max transition-all duration-500"
        >
          <HowItWorksSlide
            index={1}
            title={`Create Your Tree`}
            content={`Multiple users can work on the same probability tree diagram simultaneously. This means that team members can input events`}
          />
          <HowItWorksSlide
            index={2}
            title={`Assign Probabilities`}
            content={`Multiple users can work on the same probability tree diagram simultaneously. This means that team members can input events`}
          />
          <HowItWorksSlide
            index={3}
            title={`Create Your Tree`}
            content={`Multiple users can work on the same probability tree diagram simultaneously. This means that team members can input events`}
          />
        </div>
      </div>
      <div className="flex items-center">
        <div
          className="grow flex gap-1 justify-center sm:pl-[160px]"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          {Array.from({ length: numSlides }).map((_, index) => (
            <button
              key={index}
              className={cn("w-2.5 h-2.5 rounded-full bg-neutral-200", {
                "bg-orange-500": index === currentSlide,
              })}
              onClick={() => focusSlide(index)}
            />
          ))}
        </div>
        <div
          className="hidden sm:flex gap-4 mr-8"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          <button
            className={nextPrevBtn}
            onClick={() =>
              focusSlide((currentSlide - 1 + numSlides) % numSlides)
            }
          >
            <IconChevronLeft className="text-neutral-700 -ml-1" />
          </button>
          <button
            className={nextPrevBtn}
            onClick={() => focusSlide((currentSlide + 1) % numSlides)}
          >
            <IconChevronRight className="text-neutral-700 ml-px" />
          </button>
        </div>
      </div>
    </>
  );
}

const nextPrevBtn =
  "w-12 h-12 rounded-full bg-white shadow-md flex justify-center items-center hover:bg-neutral-100 transition-colors";
