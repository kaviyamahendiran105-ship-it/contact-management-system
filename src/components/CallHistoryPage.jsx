import React from "react";
import Icon from "./Icon";

export default function CallHistoryPage({
  calls,
  allCalls,
  activeFilter,
  setActiveFilter,
  onCall,
}) {
  const filterTabs = [
    { key: "all", label: "All Calls", count: allCalls.length },
    {
      key: "incoming",
      label: "Incoming",
      count: allCalls.filter((c) => c.type === "incoming").length,
    },
    {
      key: "outgoing",
      label: "Outgoing",
      count: allCalls.filter((c) => c.type === "outgoing").length,
    },
    {
      key: "missed",
      label: "Missed",
      count: allCalls.filter((c) => c.type === "missed").length,
    },
  ];

  return (
    <div className="call-history-view">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <span className="section-label">COMMUNICATIONS</span>
          <h1 className="page-title">Call History</h1>
          <p className="page-description">
            Review recent incoming, outgoing, and missed communications.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon call-total-icon">
            <Icon name="phone" />
          </div>
          <div>
            <span>Total Logged</span>
            <strong>{allCalls.length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon incoming-icon">
            <Icon name="call_received" />
          </div>
          <div>
            <span>Incoming</span>
            <strong>{allCalls.filter((c) => c.type === "incoming").length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon outgoing-icon">
            <Icon name="call_made" />
          </div>
          <div>
            <span>Outgoing</span>
            <strong>{allCalls.filter((c) => c.type === "outgoing").length}</strong>
          </div>
        </div>

        <div className="summary-card missed-summary">
          <div className="summary-icon missed-icon">
            <Icon name="call_missed" />
          </div>
          <div>
            <span>Missed Calls</span>
            <strong>{allCalls.filter((c) => c.type === "missed").length}</strong>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Auto Sync Indicator */}
      <div className="filter-section">
        <div className="filter-tabs" role="tablist">
          {filterTabs.map((filter) => (
            <button
              key={filter.key}
              role="tab"
              aria-selected={activeFilter === filter.key}
              className={`filter-tab ${activeFilter === filter.key ? "active" : ""}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
              <span className="filter-count">{filter.count}</span>
            </button>
          ))}
        </div>

        <div className="sync-status">
          <Icon name="sync" />
          <span>Auto-synced just now</span>
        </div>
      </div>

      {/* Call List */}
      {calls.length > 0 ? (
        <div className="call-list">
          {calls.map((call) => {
            const iconName =
              call.type === "incoming"
                ? "call_received"
                : call.type === "outgoing"
                ? "call_made"
                : "call_missed";

            return (
              <article className={`call-card ${call.type}`} key={call.id}>
                <div className="call-info">
                  <div className="call-type-icon" title={call.type}>
                    <Icon name={iconName} />
                  </div>

                  <div className="call-details">
                    <div className="person-info">
                      <span className="person-name">{call.name}</span>
                      <span className="group-badge">{call.group}</span>
                    </div>

                    <div className="phone-number">{call.phone}</div>
                    <div className="call-date">{call.date}</div>

                    <div
                      className={`call-duration ${
                        call.type === "missed" ? "missed-duration" : ""
                      }`}
                    >
                      <Icon name="schedule" />
                      <span>{call.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="call-actions">
                  <button
                    className="action-icon-btn redial-btn"
                    onClick={() => onCall(call.phone, call.name)}
                    title="Call back"
                    aria-label={`Call back ${call.name}`}
                  >
                    <Icon name="call" />
                  </button>
                  <button
                    className="action-icon-btn message-btn"
                    onClick={() => {
                      const num = call.phone.replace(/[^0-9]/g, "");
                      window.open(`https://wa.me/${num}`, "_blank", "noopener,noreferrer");
                    }}
                    title="Send WhatsApp message"
                    aria-label={`Send message to ${call.name}`}
                  >
                    <Icon name="chat" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icon name="phone_disabled" />
          </div>
          <h3>No calls match your criteria</h3>
          <p>Try switching filter tabs or clearing your search term.</p>
          {activeFilter !== "all" && (
            <button
              className="secondary-action-btn"
              onClick={() => setActiveFilter("all")}
            >
              View all calls
            </button>
          )}
        </div>
      )}
    </div>
  );
}
