import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Laptop, Smartphone, Headphones, Watch, Camera, Gamepad2, Tv, Tablet } from "lucide-react";
import logo from "@/assets/logo-splash.png";

const FLOATERS = [
  { Icon: Laptop,     top: "10%",  left: "12%", size: 28, delay: "0s",   fx: "10px",  fy: "-18px", rot: "-8deg" },
  { Icon: Smartphone, top: "16%",  left: "78%", size: 24, delay: "0.4s", fx: "-12px", fy: "-14px", rot: "10deg" },
  { Icon: Headphones, top: "32%",  left: "6%",  size: 30, delay: "0.8s", fx: "8px",   fy: "16px",  rot: "6deg" },
  { Icon: Watch,      top: "30%",  left: "84%", size: 22, delay: "0.2s", fx: "-10px", fy: "12px",  rot: "-6deg" },
  { Icon: Camera,     top: "68%",  left: "10%", size: 26, delay: "0.6s", fx: "12px",  fy: "-12px", rot: "8deg" },
  { Icon: Gamepad2,   top: "72%",  left: "76%", size: 28, delay: "1s",   fx: "-14px", fy: "-16px", rot: "-10deg" },
  { Icon: Tv,         top: "84%",  left: "20%", size: 24, delay: "0.3s", fx: "10px",  fy: "10px",  rot: "4deg" },
  { Icon: Tablet,     top: "82%",  left: "70%", size: 24, delay: "0.7s", fx: "-10px", fy: "14px",  rot: "-4deg" },
];

const Splash = () => {
  const nav = useNavigate();
  useEffect(() => {
    const seenOnboarding = localStorage.getItem("ejada_onboarded");
    const signedIn = !!localStorage.getItem("ejada_user_profile");
    const dest = !seenOnboarding ? "/onboarding" : (signedIn ? "/home" : "/auth");
    const t = setTimeout(() => nav(dest, { replace: true }), 2400);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div className="phone-frame bg-gradient-primary flex flex-col items-center justify-center text-n8 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-20 -start-16 w-72 h-72 rounded-full bg-n8/10 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -end-16 w-80 h-80 rounded-full bg-primary-light/30 blur-3xl animate-pulse" style={{ animationDelay: "0.6s" }} />
      <div className="pointer-events-none absolute top-1/3 start-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-s2/20 blur-2xl" />

      {/* Floating product icons */}
      {FLOATERS.map(({ Icon, top, left, size, delay, fx, fy, rot }, i) => (
        <div
          key={i}
          className="pointer-events-none absolute animate-splash-pop"
          style={{ top, left, animationDelay: delay }}
        >
          <div
            className="animate-splash-float"
            style={{
              ["--fx" as never]: fx,
              ["--fy" as never]: fy,
              ["--rot" as never]: rot,
              animationDelay: delay,
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-n8/15 backdrop-blur-md border border-n8/25 shadow-elev2 flex items-center justify-center">
              <Icon size={size} className="text-n8" strokeWidth={1.75} />
            </div>
          </div>
        </div>
      ))}

      {/* Logo with pulsing rings + shine */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <span className="absolute inset-6 rounded-full border border-n8/40 animate-splash-ring" />
          <span className="absolute inset-6 rounded-full border border-n8/30 animate-splash-ring" style={{ animationDelay: "0.8s" }} />
          <span className="absolute inset-6 rounded-full border border-n8/20 animate-splash-ring" style={{ animationDelay: "1.6s" }} />

          <div className="relative animate-splash-logo overflow-hidden rounded-3xl">
            <img src={logo} alt="Ejada" className="w-56 h-56 object-contain relative z-10" />
            <span className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-n8/40 to-transparent w-1/3 animate-splash-shine" />
          </div>
        </div>
        <p className="text-body opacity-90 mt-2 tracking-wide animate-fade-in" style={{ animationDelay: "0.4s" }}>
          Premium Electronics · KSA
        </p>
      </div>

      <div className="absolute bottom-12 flex gap-1.5 z-10">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2 h-2 bg-n8/70 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
};
export default Splash;
