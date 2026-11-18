import React, { useEffect, useState } from "react";
import Icon from "./Icon";

export default function AddContactModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [group, setGroup] = useState("Work");

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      role: role.trim() || "Contact",
      group: group || "Work",
    });
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-modal-title"
    >
      <form className="add-modal" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close add contact"
          title="Close (Esc)"
        >
          <Icon name="close" />
        </button>

        <span className="section-label">NEW DIRECTORY ENTRY</span>
        <h2 id="add-modal-title">Add Contact</h2>
        <p className="modal-description">
          Add someone new to your CallPulse directory.
        </p>

        <label className="form-field">
          <span className="field-label">Full Name *</span>
          <input
            name="name"
            required
            autoFocus
            placeholder="e.g. Maya Patel"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="form-row">
          <label className="form-field">
            <span className="field-label">Phone Number *</span>
            <input
              name="phone"
              required
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <label className="form-field">
            <span className="field-label">Email Address</span>
            <input
              name="email"
              type="email"
              placeholder={
                name
                  ? `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`
                  : "name@example.com"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <div className="form-row">
          <label className="form-field">
            <span className="field-label">Role / Title</span>
            <input
              name="role"
              placeholder="e.g. Design Director"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>

          <label className="form-field">
            <span className="field-label">Category Group</span>
            <select
              name="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value="Work">Work</option>
              <option value="Family">Family</option>
              <option value="Clients">Clients</option>
              <option value="Helpdesk">Helpdesk</option>
              <option value="Personal">Personal</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="submit">
            <Icon name="person_add" />
            <span>Save Contact</span>
          </button>
        </div>
      </form>
    </div>
  );
}
