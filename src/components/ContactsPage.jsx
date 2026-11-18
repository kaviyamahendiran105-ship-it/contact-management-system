import React, { useState, useMemo } from "react";
import ContactCard from "./ContactCard";
import Icon from "./Icon";

export default function ContactsPage({
  contacts,
  favoritePage = false,
  onAdd,
  onFavorite,
  onDetails,
  onCall,
  onEmail,
  onWhatsApp,
  onSpam,
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  // Available category groups
  const categories = useMemo(() => {
    return [
      { key: "all", label: "All" },
      { key: "Work", label: "Work" },
      { key: "Family", label: "Family" },
      { key: "Clients", label: "Clients" },
      { key: "blocked", label: "Blocked" },
    ];
  }, []);

  // Filter contacts by category and sort
  const filteredContacts = useMemo(() => {
    let result = [...contacts];

    if (selectedCategory === "blocked") {
      result = result.filter((c) => c.spam);
    } else {
      // For all standard categories, filter out blocked contacts
      result = result.filter((c) => !c.spam);
      if (selectedCategory !== "all") {
        result = result.filter((c) => c.group.toLowerCase() === selectedCategory.toLowerCase());
      }
    }

    // Sort order (default maintains original natural directory order)
    if (sortOrder === "az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "za") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [contacts, selectedCategory, sortOrder]);

  const title = favoritePage ? "Favorites" : "Contacts";
  const eyebrow = favoritePage ? "QUICK REACH" : "PEOPLE DIRECTORY";
  const description = favoritePage
    ? "The people you connect with most, one tap away."
    : "Your organized phonebook and communication hub.";

  return (
    <div className="contacts-view">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <span className="section-label">{eyebrow}</span>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{description}</p>
        </div>

        {!favoritePage && onAdd && (
          <button className="primary-button" onClick={onAdd}>
            <Icon name="person_add" />
            <span>New contact</span>
          </button>
        )}
      </div>

      {/* Category Pills & Controls Toolbar */}
      <div className="filters-toolbar">
        <div className="category-chips" role="tablist" aria-label="Contact categories">
          {categories.map((cat) => {
            const count =
              cat.key === "blocked"
                ? contacts.filter((c) => c.spam).length
                : cat.key === "all"
                ? contacts.filter((c) => !c.spam).length
                : contacts.filter((c) => !c.spam && c.group.toLowerCase() === cat.key.toLowerCase()).length;

            return (
              <button
                key={cat.key}
                role="tab"
                aria-selected={selectedCategory === cat.key}
                className={`category-chip ${selectedCategory === cat.key ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.key)}
              >
                <span>{cat.label}</span>
                <span className="chip-count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="toolbar-controls">
          <label className="sort-label">
            <Icon name="sort" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort contacts"
            >
              <option value="default">Default order</option>
              <option value="az">Sort A–Z</option>
              <option value="za">Sort Z–A</option>
            </select>
          </label>
        </div>
      </div>

      {/* Status toolbar */}
      <div className="content-toolbar">
        <span className="result-count">
          {filteredContacts.length} {selectedCategory === "blocked" ? "blocked contacts" : "contacts"}
        </span>
        <span className="directory-hint">
          <Icon name="bolt" /> Quick actions available on every card
        </span>
      </div>

      {/* Cards Grid */}
      {filteredContacts.length > 0 ? (
        <div className="contact-grid">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onFavorite={onFavorite}
              onDetails={onDetails}
              onCall={onCall}
              onEmail={onEmail}
              onWhatsApp={onWhatsApp}
              onSpam={onSpam}
              spam={contact.spam}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icon
              name={
                favoritePage
                  ? "star"
                  : selectedCategory === "blocked"
                  ? "shield_person"
                  : "person_search"
              }
            />
          </div>
          <h3>
            {favoritePage
              ? "No favorites yet"
              : selectedCategory === "blocked"
              ? "No blocked contacts"
              : "No contacts found"}
          </h3>
          <p>
            {favoritePage
              ? "Star any contact to have them show up here for quick access."
              : selectedCategory === "blocked"
              ? "Contacts you block or mark as spam will be listed here."
              : "Try adjusting your search or category filter to find what you need."}
          </p>
          {selectedCategory !== "all" && (
            <button
              className="secondary-action-btn"
              onClick={() => setSelectedCategory("all")}
            >
              Show all contacts
            </button>
          )}
        </div>
      )}
    </div>
  );
}
