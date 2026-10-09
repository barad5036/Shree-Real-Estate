import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

/**
 * CustomDropdown — premium, animated, fully accessible dropdown.
 *
 * Props:
 *   label       {string}   — optional label above the trigger
 *   options     {Array}    — [{ value, label, icon? }]  OR  ["string", ...]
 *   value       {string}   — currently selected value
 *   onChange    {fn}       — called with the selected value string
 *   placeholder {string}   — text shown when nothing is selected
 *   icon        {ReactNode} — optional left icon inside the trigger
 *   disabled    {boolean}
 *   size        {"sm"|"md"} — "sm" for compact (table cells), "md" default
 *   dark        {boolean}  — white-on-blue variant (for gradient headers)
 */
const CustomDropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  icon,
  disabled = false,
  size = "md",
  dark = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Normalise options to { value, label, icon? }
  const normalised = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  const selected = normalised.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const isSm = size === "sm";

  // ── Trigger styles ──────────────────────────────────────────────────────────
  const triggerBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
    cursor: disabled ? "not-allowed" : "pointer",
    userSelect: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: 0,
  };

  const triggerWrapStyle = dark
    ? {
        background: open ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.14)",
        border: "1.5px solid rgba(255,255,255,0.3)",
        borderRadius: 12,
        padding: isSm ? "6px 10px" : "10px 14px",
        boxShadow: open ? "0 0 0 3px rgba(255,255,255,0.12)" : "none",
        transition: "all 0.2s ease",
      }
    : {
        background: open ? "#fff" : "#fafbfc",
        border: open ? "2px solid #3A76DA" : "2px solid #f0f3f7",
        borderRadius: 12,
        padding: isSm ? "6px 10px" : "10px 14px",
        boxShadow: open ? "0 0 0 3px rgba(58,118,218,0.12)" : "none",
        transition: "all 0.2s ease",
      };

  // ── Dropdown panel ──────────────────────────────────────────────────────────
  const panelStyle = {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    zIndex: 9999,
    background: "#fff",
    borderRadius: 14,
    border: "1.5px solid #e8ecf2",
    boxShadow: "0 16px 48px rgba(58,118,218,0.16), 0 4px 16px rgba(0,0,0,0.08)",
    overflow: "hidden",
    animation: "dropdownFade 0.18s ease",
    minWidth: 160,
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      {/* Label */}
      {label && (
        <p
          className="font-Poppins font-semibold mb-1.5"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: dark ? "rgba(255,255,255,0.75)" : "#8bace2",
          }}
        >
          {label}
        </p>
      )}

      {/* Trigger */}
      <div
        style={triggerWrapStyle}
        onClick={() => !disabled && setOpen((v) => !v)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) setOpen((v) => !v);
          }
        }}
      >
        <button type="button" style={triggerBase} disabled={disabled}>
          <span
            className="flex items-center gap-2 font-Poppins"
            style={{
              fontSize: isSm ? 12 : 13,
              fontWeight: 600,
              color: selected
                ? dark ? "#fff" : "#00040a"
                : dark ? "rgba(255,255,255,0.6)" : "#666565",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {icon && (
              <span style={{ color: dark ? "rgba(255,255,255,0.8)" : "#3A76DA", flexShrink: 0 }}>
                {icon}
              </span>
            )}
            {selected?.icon && (
              <span style={{ flexShrink: 0 }}>{selected.icon}</span>
            )}
            {selected ? selected.label : placeholder}
          </span>

          <FaChevronDown
            style={{
              fontSize: 10,
              flexShrink: 0,
              color: dark ? "rgba(255,255,255,0.7)" : "#8bace2",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.22s ease",
            }}
          />
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div style={panelStyle} role="listbox">
          {normalised.map((opt, i) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value ?? i}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 font-Poppins"
                style={{
                  padding: isSm ? "8px 12px" : "11px 14px",
                  fontSize: isSm ? 12 : 13,
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  background: isSelected
                    ? "linear-gradient(135deg,rgba(58,118,218,0.1),rgba(139,172,226,0.12))"
                    : "transparent",
                  color: isSelected ? "#3A76DA" : "#00040a",
                  borderBottom: i < normalised.length - 1 ? "1px solid #f8f9fb" : "none",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "#f8faff";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                {opt.icon && <span style={{ flexShrink: 0 }}>{opt.icon}</span>}
                <span style={{ flex: 1 }}>{opt.label}</span>
                {isSelected && (
                  <FaCheck style={{ fontSize: 10, color: "#3A76DA", flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
