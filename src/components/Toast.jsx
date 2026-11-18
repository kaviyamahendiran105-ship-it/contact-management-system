import React from "react";
import Icon from "./Icon";

export default function Toast({ notice, onDismiss }) {
  if (!notice) return null;

  return (
    <div className="toast" role="status" onClick={onDismiss}>
      <Icon name="check_circle" />
      <span>{notice}</span>
    </div>
  );
}
