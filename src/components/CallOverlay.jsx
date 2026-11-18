import React, { useState, useEffect, useCallback } from "react";
import Icon from "./Icon";

export default function CallOverlay({ call, onClose, onEndCallWithDuration }) {
  const [callStatus, setCallStatus] = useState("Calling...");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedDigits, setDialedDigits] = useState("");

  // Transition from "Calling..." to "Connected"
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setCallStatus("Connected");
    }, 2200);

    return () => clearTimeout(connectTimer);
  }, []);

  // Timer when connected
  useEffect(() => {
    let interval = null;
    if (callStatus === "Connected") {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const handleEnd = useCallback(() => {
    const durationStr =
      elapsedSeconds > 0
        ? `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`
        : "Missed (0s)";

    if (onEndCallWithDuration) {
      onEndCallWithDuration(call, durationStr);
    } else {
      onClose();
    }
  }, [elapsedSeconds, call, onEndCallWithDuration, onClose]);

  // Handle Escape key to end call
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        handleEnd();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleEnd]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleKeypadPress = (digit) => {
    setDialedDigits((prev) => prev + digit);
  };

  return (
    <div
      className="call-overlay"
      role="dialog"
      aria-label={`Calling ${call.name}`}
      aria-modal="true"
    >
      <div className="call-popup">
        {/* Pulsing Avatar / Wave animation */}
        <div className={`call-pulse ${callStatus === "Connected" ? "in-call" : ""}`}>
          <Icon name={callStatus === "Connected" ? "call" : "ring_volume"} />
        </div>

        <span className="call-status">
          {callStatus === "Connected" ? formatTimer(elapsedSeconds) : callStatus}
        </span>

        <h2 className="call-target-name">{call.name}</h2>
        <p className="call-target-phone">{call.phone}</p>

        {dialedDigits && (
          <div className="dialed-digits-preview">
            <span>DTMF: {dialedDigits}</span>
          </div>
        )}

        {/* In-Call Controls */}
        <div className="call-control-grid">
          <button
            className={`call-control-btn ${isMuted ? "active" : ""}`}
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute microphone" : "Mute microphone"}
          >
            <Icon name={isMuted ? "mic_off" : "mic"} />
            <span>{isMuted ? "Muted" : "Mute"}</span>
          </button>

          <button
            className={`call-control-btn ${showKeypad ? "active" : ""}`}
            onClick={() => setShowKeypad(!showKeypad)}
            title="Toggle keypad"
          >
            <Icon name="dialpad" />
            <span>Keypad</span>
          </button>

          <button
            className={`call-control-btn ${isSpeaker ? "active" : ""}`}
            onClick={() => setIsSpeaker(!isSpeaker)}
            title={isSpeaker ? "Speaker On" : "Speaker Off"}
          >
            <Icon name={isSpeaker ? "volume_up" : "volume_down"} />
            <span>Speaker</span>
          </button>
        </div>

        {/* Optional Keypad Drawer */}
        {showKeypad && (
          <div className="keypad-grid">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((d) => (
              <button
                key={d}
                type="button"
                className="keypad-digit-btn"
                onClick={() => handleKeypadPress(d)}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* End Call Button */}
        <div className="end-call-container">
          <button
            className="end-call"
            onClick={handleEnd}
            aria-label="End call"
            title="End call"
          >
            <Icon name="call_end" />
          </button>
        </div>

        <small className="call-hint">
          {callStatus === "Connected"
            ? "Tap the red button or press Esc to end call"
            : "Connecting secure line..."}
        </small>
      </div>
    </div>
  );
}
