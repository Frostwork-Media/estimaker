import { SignInButton, useAuth } from "@clerk/clerk-react";
import { IconChevronRight } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

const smOrangeLink =
  "py-1 sm:py-2 px-3 pl-5 bg-orange-500 text-foreground font-bold text-sm rounded-3xl flex items-center gap-1 cursor-pointer hover:bg-orange-600 transition-colors";

export function LandingNavbar() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  /**
   * Smooth scroll to the features section
   */
  function scrollToFeatures() {
    const features = document.getElementById("features");
    if (features) {
      features.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#features");
    }
  }

  return (
    <div className="bg-neutral-900 text-white rounded-full w-full max-w-2xl mx-auto p-2 sm:p-5 sm:pl-12 mb-12 sm:mb-20 flex justify-between">
      <div className="flex items-center">
        <Link to={"/"} className="flex">
          <img src="/logo.svg" className="h-5 w-5 sm:h-7 sm:w-7 mr-1" />
          <h1 className="text-base sm:text-2xl font-extrabold">estimaker</h1>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <button
          className="font-bold text-sm hidden sm:block"
          onClick={scrollToFeatures}
        >
          Features
        </button>
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
  );
}
