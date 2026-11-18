import React from "react";
import Avatar from "./Avatar";
import Icon from "./Icon";

export default function ContactCard({
  contact,
  onFavorite,
  onDetails,
  onCall,
  onEmail,
  onWhatsApp,
  onSpam,
  spam = false,
}) {
  return (
    <article className={`contact-card ${contact.spam ? "is-spam" : ""}`}>
      {/* Top: Avatar & Favorite Toggle */}
      <div className="contact-card-top">
        <Avatar contact={contact} />
        <button
          className={`favorite-button ${contact.favorite ? "selected" : ""}`}
          onClick={() => onFavorite(contact.id)}
          title="Toggle favorite"
          aria-label={contact.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Icon name={contact.favorite ? "star" : "star_outline"} />
        </button>
      </div>

      {/* Main Info */}
      <button
        className="contact-name-button"
        onClick={() => onDetails(contact)}
        title="View details"
      >
        <h3 className="contact-name">{contact.name}</h3>
        <p className="contact-role">{contact.role}</p>
      </button>

      {/* Meta tags: Group & Phone */}
      <div className="contact-meta">
        <span className="contact-meta-item group-pill">
          <Icon name="tag" />
          {contact.group}
        </span>
        <span className="contact-meta-item phone-pill" title={contact.phone}>
          <Icon name="call" />
          {contact.phone}
        </span>
      </div>

      {/* Quick Action Buttons */}
      <div className="card-actions">
        <button
          className="action-btn call-action"
          onClick={() => onCall(contact.phone, contact.name)}
          title="Call"
          aria-label={`Call ${contact.name}`}
        >
          <Icon name="call" />
        </button>

        <button
          className="action-btn email-action"
          onClick={() => onEmail(contact)}
          title="Send email"
          aria-label={`Send email to ${contact.name}`}
        >
          <Icon name="mail" />
        </button>

        <button
          className="action-btn whatsapp-action"
          onClick={() => onWhatsApp(contact)}
          title="Open WhatsApp"
          aria-label={`WhatsApp ${contact.name}`}
        >
          <Icon name="chat" />
        </button>

        <button
          className="open-contact-btn"
          onClick={() => onDetails(contact)}
          title="View profile details"
        >
          <span>Details</span>
          <Icon name="arrow_forward" />
        </button>
      </div>

      {/* Block / Spam Toggle */}
      <div className="card-footer">
        <button
          className="spam-toggle-btn"
          onClick={() => onSpam(contact.id)}
          title={contact.spam ? "Unblock this contact" : "Mark contact as spam / blocked"}
        >
          <Icon name={contact.spam ? "check_circle" : "block"} />
          <span>{contact.spam ? "Remove from spam" : "Mark as spam"}</span>
        </button>
      </div>
    </article>
  );
}
