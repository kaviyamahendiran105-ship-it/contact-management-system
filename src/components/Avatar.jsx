import React from "react";

export default function Avatar({ contact, size = "default", className = "" }) {
  const color = contact?.color || "blue";
  const initials = contact?.initials || "--";
  const sizeClass = size === "small" ? "contact-avatar-small" : size === "large" ? "contact-avatar-large" : "";

  return (
    <div
      className={`contact-avatar ${color} ${sizeClass} ${className}`.trim()}
      aria-label={`${contact?.name || "User"} avatar`}
    >
      {initials}
    </div>
  );
}
