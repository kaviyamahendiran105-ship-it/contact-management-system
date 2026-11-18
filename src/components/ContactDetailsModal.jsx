import React, { useEffect } from "react";
import Avatar from "./Avatar";
import Icon from "./Icon";

export default function ContactDetailsModal({
  contact,
  onClose,
  onCall,
  onEmail,
  onWhatsApp,
  onFavorite,
  onSpam,
  onCopyText,
}) {
  // Listen for Escape key to close modal
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!contact) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-details-title"
    >
      <section className="details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close details"
          title="Close (Esc)"
        >
          <Icon name="close" />
        </button>

        {/* Header Profile */}
        <div className="details-profile-header">
          <Avatar contact={contact} size="large" />
          <h2 id="contact-details-title">{contact.name}</h2>
          <p className="modal-role">
            {contact.role} · <span className="group-pill">{contact.group}</span>
          </p>
        </div>

        {/* Contact Info List with Copy triggers */}
        <div className="details-list">
          <div className="details-row">
            <Icon name="call" />
            <div className="details-row-content">
              <b>Phone</b>
              <span className="details-value">{contact.phone}</span>
            </div>
            <button
              className="copy-btn"
              onClick={() => onCopyText(contact.phone, "Phone number copied")}
              title="Copy phone number"
            >
              <Icon name="content_copy" />
            </button>
          </div>

          <div className="details-row">
            <Icon name="mail" />
            <div className="details-row-content">
              <b>Email</b>
              <span className="details-value">{contact.email}</span>
            </div>
            <button
              className="copy-btn"
              onClick={() => onCopyText(contact.email, "Email address copied")}
              title="Copy email"
            >
              <Icon name="content_copy" />
            </button>
          </div>

          <div className="details-row">
            <Icon name="schedule" />
            <div className="details-row-content">
              <b>Last Contact</b>
              <span className="details-value">{contact.lastContacted || "Today, 11:45 AM"}</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="modal-actions">
          <button
            className="action-pill call-pill"
            onClick={() => onCall(contact.phone, contact.name)}
          >
            <Icon name="call" />
            <span>Call</span>
          </button>
          <button
            className="action-pill email-pill"
            onClick={() => onEmail(contact)}
          >
            <Icon name="mail" />
            <span>Email</span>
          </button>
          <button
            className="action-pill whatsapp-pill"
            onClick={() => onWhatsApp(contact)}
          >
            <Icon name="chat" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Secondary Options */}
        <div className="modal-secondary">
          <button
            className={`secondary-btn ${contact.favorite ? "active" : ""}`}
            onClick={() => onFavorite(contact.id)}
          >
            <Icon name={contact.favorite ? "star" : "star_outline"} />
            <span>{contact.favorite ? "Remove favorite" : "Add to favorites"}</span>
          </button>

          <button
            className="secondary-btn danger-btn"
            onClick={() => {
              onSpam(contact.id);
              onClose();
            }}
          >
            <Icon name={contact.spam ? "check_circle" : "block"} />
            <span>{contact.spam ? "Unblock contact" : "Block contact"}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
