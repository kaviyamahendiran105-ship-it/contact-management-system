import React, { useState, useMemo, useCallback } from "react";
import "./App.css";

// Data and helpers
import { initialContacts, initialCalls, initialsFor } from "./data/mockData";

// Modular UI Components
import Header from "./components/Header";
import ContactsPage from "./components/ContactsPage";
import CallHistoryPage from "./components/CallHistoryPage";
import ContactDetailsModal from "./components/ContactDetailsModal";
import AddContactModal from "./components/AddContactModal";
import CallOverlay from "./components/CallOverlay";
import Toast from "./components/Toast";

export default function App() {
  // Navigation & Filter state
  const [activeNav, setActiveNav] = useState("Contacts");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data state
  const [contacts, setContacts] = useState(initialContacts);
  const [calls, setCalls] = useState(initialCalls);

  // Modal & Overlay state
  const [selectedContact, setSelectedContact] = useState(null);
  const [calling, setCalling] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  // Toast feedback state
  const [notice, setNotice] = useState("");

  const showNotice = useCallback((message) => {
    setNotice(message);
    window.setTimeout(() => {
      setNotice((prev) => (prev === message ? "" : prev));
    }, 2800);
  }, []);

  // Filtered contacts based on search query
  const visibleContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((contact) =>
      [contact.name, contact.role, contact.group, contact.phone, contact.email].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [contacts, search]);

  // Filtered calls based on active call filter & search query
  const filteredCalls = useMemo(() => {
    const query = search.trim().toLowerCase();

    return calls.filter((call) => {
      const matchesFilter = activeFilter === "all" || call.type === activeFilter;
      const matchesSearch =
        !query ||
        [call.name, call.phone, call.group].some((field) => field.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [calls, activeFilter, search]);

  // Navigation tab switcher
  const handleSelectNav = (tabName) => {
    setActiveNav(tabName);
    setActiveFilter("all");
    setSearch("");
    setMobileMenuOpen(false);
  };

  // Contact actions
  const toggleFavorite = (id) => {
    setContacts((current) =>
      current.map((c) => {
        if (c.id === id) {
          const updated = !c.favorite;
          showNotice(updated ? `Marked ${c.name} as favorite` : `Removed ${c.name} from favorites`);
          return { ...c, favorite: updated };
        }
        return c;
      })
    );
  };

  const toggleSpam = (id) => {
    setContacts((current) =>
      current.map((c) => {
        if (c.id === id) {
          const updated = !c.spam;
          showNotice(updated ? `Blocked ${c.name}` : `Unblocked ${c.name}`);
          return { ...c, spam: updated };
        }
        return c;
      })
    );
  };

  const handleStartCall = (phone, name = "Unknown Caller") => {
    setCalling({ phone, name });
  };

  const handleEndCallWithDuration = (activeCall, durationStr) => {
    setCalling(null);

    // Automatically append this interaction to Call History
    const newCallEntry = {
      id: Date.now(),
      type: "outgoing",
      name: activeCall.name,
      group: "Recent",
      phone: activeCall.phone,
      date: "Just now",
      duration: durationStr,
    };

    setCalls((prev) => [newCallEntry, ...prev]);
    showNotice(`Call finished with ${activeCall.name} (${durationStr})`);
  };

  const openEmailCompose = (contact) => {
    window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      contact.email
    )}`;
  };

  const openWhatsApp = (contact) => {
    const cleanNumber = contact.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank", "noopener,noreferrer");
  };

  const handleCopyText = (text, confirmationMessage) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    showNotice(confirmationMessage || "Copied to clipboard");
  };

  const handleAddContact = (formData) => {
    const newContact = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      email:
        formData.email ||
        `${formData.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      role: formData.role,
      group: formData.group,
      initials: initialsFor(formData.name),
      color: "blue",
      favorite: false,
      spam: false,
      lastContacted: "Just added",
    };

    setContacts((current) => [newContact, ...current]);
    setAddOpen(false);
    showNotice(`Saved ${formData.name} to directory`);
  };

  // Nav counts
  const counts = {
    contacts: contacts.filter((c) => !c.spam).length,
    favorites: contacts.filter((c) => c.favorite && !c.spam).length,
    calls: calls.length,
  };

  return (
    <div className="app">
      {/* Top Application Header */}
      <Header
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        search={search}
        onSearchChange={setSearch}
        onClearSearch={() => setSearch("")}
        onOpenAdd={() => setAddOpen(true)}
        counts={counts}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Page Content */}
      <main className="main-content">
        {activeNav === "Contacts" && (
          <ContactsPage
            contacts={visibleContacts}
            onAdd={() => setAddOpen(true)}
            onFavorite={toggleFavorite}
            onDetails={setSelectedContact}
            onCall={handleStartCall}
            onEmail={openEmailCompose}
            onWhatsApp={openWhatsApp}
            onSpam={toggleSpam}
          />
        )}

        {activeNav === "Favorites" && (
          <ContactsPage
            contacts={visibleContacts.filter((c) => c.favorite)}
            favoritePage
            onFavorite={toggleFavorite}
            onDetails={setSelectedContact}
            onCall={handleStartCall}
            onEmail={openEmailCompose}
            onWhatsApp={openWhatsApp}
            onSpam={toggleSpam}
          />
        )}

        {activeNav === "Call History" && (
          <CallHistoryPage
            calls={filteredCalls}
            allCalls={calls}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onCall={handleStartCall}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      <Toast notice={notice} onDismiss={() => setNotice("")} />

      {/* Interactive Call Overlay (Live Simulator) */}
      {calling && (
        <CallOverlay
          call={calling}
          onClose={() => setCalling(null)}
          onEndCallWithDuration={handleEndCallWithDuration}
        />
      )}

      {/* Contact Details Modal */}
      {selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onCall={handleStartCall}
          onEmail={openEmailCompose}
          onWhatsApp={openWhatsApp}
          onFavorite={toggleFavorite}
          onSpam={toggleSpam}
          onCopyText={handleCopyText}
        />
      )}

      {/* New Contact Creation Modal */}
      {addOpen && (
        <AddContactModal
          onClose={() => setAddOpen(false)}
          onSubmit={handleAddContact}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <span>© 2025 CallPulse</span>
        <span className="footer-dot">•</span>
        <span>Modern Contact & Communication Directory</span>
      </footer>
    </div>
  );
}
