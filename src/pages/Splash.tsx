import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo-splash.png";

const Splash = () => {
  const nav = useNavigate();
  useEffect(() => {
    const seenOnboarding = localStorage.getItem("ejada_onboarded");
    const signedIn = !!localStorage.getItem("ejada_user_profile");
    const dest = !seenOnboarding ? "/onboarding" : (signedIn ? "/home" : "/auth");
    const t = setTimeout(() => nav(dest, { replace: true }), 1600);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div className="phone-frame bg-gradient-primary flex flex-col items-center justify-center text-n8">
      <div className="animate-confetti">
        <img src={logo} alt="Ejada" className="w-56 h-56 object-contain" />
      </div>
      <p className="text-body opacity-80 mt-4">Premium Electronics · KSA</p>
      <div className="absolute bottom-12 flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2 h-2 bg-n8/60 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
};
export default Splash;
