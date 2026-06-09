import { useState } from "react";

const navItems = [
  { icon: "history", label: "History" },
  { icon: "bookmark_border", label: "Saved Snippets" },
  { icon: "groups", label: "Team Sessions" },
  { icon: "insert_chart_outlined", label: "Usage Analytics" },
  { icon: "settings", label: "Settings" },


  
];

export default function Slider({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState("New Review");

  return (
    <>
      <aside
        className="relative flex h-full shrink-0 flex-col overflow-hidden border-r border-white/6 bg-[#121317] transition-all duration-300 ease-in-out"
        style={{ width: isOpen ? "240px" : "72px" }}
      >
        <div className="flex h-full flex-col">
          <div
            className="flex items-center gap-3 transition-all duration-300"
            style={{ padding: isOpen ? "18px 16px 26px" : "18px 12px 26px" }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#5260ff]/40 bg-[#17203c]">
              <span className="material-icons text-[18px] text-[#9ea9ff]">code</span>
            </div>
            {isOpen && (
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold tracking-tight text-[#93a2ff]">
                  CritiqueAI
                </p>
                <p className="text-xs text-white/40">Pro Dashboard</p>
              </div>
            )}
          </div>

          <div className="mb-5" style={{ padding: isOpen ? "0 12px" : "0 10px" }}>
            <button
              type="button"
              onClick={() => setActive("New Review")}
              className="flex w-full items-center justify-center rounded-xl border border-[#2d6fe1] bg-[#1477f8] text-sm font-bold text-white transition active:scale-[0.98]"
              style={{
                padding: isOpen ? "11px 14px" : "11px 10px",
                gap: isOpen ? "10px" : "0",
              }}
            >
              <span className="material-icons text-[18px]">add</span>
              {isOpen && "New Review"}
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col gap-1"
            style={{ padding: isOpen ? "0 10px" : "0 8px" }}
          >
            {navItems.map((item) => {
              const selected = active === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActive(item.label)}
                  className="flex items-center rounded-xl text-sm font-medium transition-colors duration-150"
                  style={{
                    justifyContent: isOpen ? "flex-start" : "center",
                    gap: isOpen ? "12px" : "0",
                    padding: isOpen ? "11px 14px" : "11px 0",
                    color: selected ? "#ffffff" : "rgba(255,255,255,0.72)",
                    background: selected ? "rgba(255,255,255,0.06)" : "transparent",
                  }}
                >
                  <span
                    className="material-icons text-[18px]"
                    style={{ color: selected ? "#9ea9ff" : "rgba(255,255,255,0.55)" }}
                  >
                    {item.icon}
                  </span>
                  {isOpen && item.label}
                </button>
              );
            })}
          </nav>

          <div
            className="mt-auto space-y-1 border-t border-white/6 pt-3"
            style={{
              paddingLeft: isOpen ? "10px" : "8px",
              paddingRight: isOpen ? "10px" : "8px",
            }}
          >
            {[
              { icon: "help_outline", label: "Support" },
              { icon: "logout", label: "Sign Out" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.label === "Sign Out") {
                    onNavigate?.("login");
                  }
                }}
                className="flex w-full items-center rounded-xl text-sm text-white/75 transition-colors hover:bg-white/5"
                style={{
                  justifyContent: isOpen ? "flex-start" : "center",
                  gap: isOpen ? "12px" : "0",
                  padding: isOpen ? "11px 14px" : "11px 0",
                }}
              >
                <span className="material-icons text-[18px] text-white/60">{item.icon}</span>
                {isOpen && item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="absolute left-0 top-6 z-20 flex h-10 w-5 -translate-x-0 items-center justify-center rounded-r-lg border border-l-0 border-white/10 bg-[#1b1c23] text-white/60 transition"
        style={{ left: isOpen ? "240px" : "72px" }}
      >
        <span className="material-icons text-[14px]">
          {isOpen ? "chevron_left" : "chevron_right"}
        </span>
      </button>
    </>
  );
}
