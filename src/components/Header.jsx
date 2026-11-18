import React from "react";
import Icon from "./Icon";

export default function Header({
  activeNav,
  onSelectNav,
  search,
  onSearchChange,
  onClearSearch,
  onOpenAdd,
  counts,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  return (
    <header className="top-header">
      <div className="header-container">
        <div className="header-main">
          {/* Brand */}
          <div className="brand">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon name={mobileMenuOpen ? "close" : "menu"} />
            </button>
            <div className="brand-icon">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                <path d="M14.05 2a9 9 0 0 1 8 7.94" />
                <path d="M14.05 6a5 5 0 0 1 4 4" />
              </svg>
            </div>
            <span className="brand-name">CallPulse</span>
          </div>

          {/* Search bar */}
          <div className="search-container">
            <Icon name="search" className="search-icon" />
            <input
              aria-label="Search contacts"
              type="search"
              placeholder={
                activeNav === "Call History"
                  ? "Search calls by name or phone..."
                  : "Search contacts by name, role, or phone..."
              }
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") onClearSearch();
              }}
            />
            {search && (
              <button
                className="clear-search"
                onClick={onClearSearch}
                aria-label="Clear search"
                title="Clear search"
              >
                <Icon name="close" />
              </button>
            )}
          </div>

          {/* Header Action: Add Contact button */}
          <div className="header-actions">
            <button className="primary-action-btn" onClick={onOpenAdd}>
              <Icon name="person_add" />
              <span>New Contact</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="navigation-row">
          <nav className="navigation" aria-label="Main navigation">
            <button
              className={`nav-item ${activeNav === "Contacts" ? "active" : ""}`}
              onClick={() => onSelectNav("Contacts")}
              aria-label="Contacts"
            >
              <Icon name="person" />
              <span>Contacts</span>
              <span className="nav-badge" aria-hidden="true">{counts.contacts}</span>
            </button>

            <button
              className={`nav-item ${activeNav === "Favorites" ? "active" : ""}`}
              onClick={() => onSelectNav("Favorites")}
              aria-label="Favorites"
            >
              <Icon name="star" />
              <span>Favorites</span>
              <span className="nav-badge" aria-hidden="true">{counts.favorites}</span>
            </button>

            <button
              className={`nav-item ${activeNav === "Call History" ? "active" : ""}`}
              onClick={() => onSelectNav("Call History")}
              aria-label="Call History"
            >
              <Icon name="history" />
              <span>Call History</span>
              <span className="nav-badge" aria-hidden="true">{counts.calls}</span>
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <button
              className={`mobile-nav-item ${activeNav === "Contacts" ? "active" : ""}`}
              onClick={() => onSelectNav("Contacts")}
              aria-label="Contacts"
            >
              <Icon name="person" />
              <span>Contacts</span>
              <span className="nav-badge" aria-hidden="true">{counts.contacts}</span>
            </button>
            <button
              className={`mobile-nav-item ${activeNav === "Favorites" ? "active" : ""}`}
              onClick={() => onSelectNav("Favorites")}
              aria-label="Favorites"
            >
              <Icon name="star" />
              <span>Favorites</span>
              <span className="nav-badge" aria-hidden="true">{counts.favorites}</span>
            </button>
            <button
              className={`mobile-nav-item ${activeNav === "Call History" ? "active" : ""}`}
              onClick={() => onSelectNav("Call History")}
              aria-label="Call History"
            >
              <Icon name="history" />
              <span>Call History</span>
              <span className="nav-badge" aria-hidden="true">{counts.calls}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
