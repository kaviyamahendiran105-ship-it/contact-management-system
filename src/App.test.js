import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

test("renders the contacts workspace", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "Contacts" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Favorites" })).toBeInTheDocument();
  expect(screen.queryByTitle("Notifications")).not.toBeInTheDocument();
  expect(screen.queryByText("K")).not.toBeInTheDocument();
});

test("opens Gmail for the selected contact", () => {
  render(<App />);
  delete window.location;
  window.location = { href: "" };
  fireEvent.click(screen.getAllByTitle("Send email")[0]);
  expect(window.location.href).toContain(
    "https://mail.google.com/mail/?view=cm&fs=1&to=priya.sharma%40example.com"
  );
});

test("filters contacts via search input and clears via Escape", () => {
  render(<App />);
  const searchInput = screen.getByLabelText("Search contacts");

  // Search for Karan
  fireEvent.change(searchInput, { target: { value: "Karan" } });
  expect(screen.getByText("Karan Malhotra")).toBeInTheDocument();
  expect(screen.queryByText("Priya Sharma")).not.toBeInTheDocument();

  // Escape clears search
  fireEvent.keyDown(searchInput, { key: "Escape" });
  expect(searchInput.value).toBe("");
  expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
});

test("switches between navigation tabs", () => {
  render(<App />);

  // Switch to Call History
  fireEvent.click(screen.getByRole("button", { name: "Call History" }));
  expect(screen.getByRole("heading", { name: "Call History" })).toBeInTheDocument();

  // Switch to Favorites
  fireEvent.click(screen.getByRole("button", { name: "Favorites" }));
  expect(screen.getByRole("heading", { name: "Favorites" })).toBeInTheDocument();

  // Switch back to Contacts
  fireEvent.click(screen.getByRole("button", { name: "Contacts" }));
  expect(screen.getByRole("heading", { name: "Contacts" })).toBeInTheDocument();
});

test("opens contact details modal and closes it", () => {
  render(<App />);

  // Click on Priya Sharma details button
  fireEvent.click(screen.getByText("Priya Sharma"));
  expect(screen.getByText("Phone")).toBeInTheDocument();
  expect(screen.getAllByText("+1 (555) 234-5678").length).toBeGreaterThanOrEqual(1);

  // Close modal via Close button
  fireEvent.click(screen.getByLabelText("Close details"));
  expect(screen.queryByLabelText("Close details")).not.toBeInTheDocument();
});

test("adds a new contact through Add Contact modal", () => {
  render(<App />);

  // Open modal
  fireEvent.click(screen.getByText("New Contact"));
  expect(screen.getByRole("heading", { name: "Add Contact" })).toBeInTheDocument();

  // Fill in form
  fireEvent.change(screen.getByPlaceholderText("e.g. Maya Patel"), {
    target: { value: "Maya Patel" },
  });
  fireEvent.change(screen.getByPlaceholderText("+1 (555) 000-0000"), {
    target: { value: "+1 (555) 444-5555" },
  });

  // Submit
  fireEvent.click(screen.getByText("Save Contact"));

  // Check added
  expect(screen.getByText("Maya Patel")).toBeInTheDocument();
  expect(screen.getByText("Saved Maya Patel to directory")).toBeInTheDocument();
});

test("simulates starting a call and ending it", () => {
  render(<App />);

  // Click call button on first contact
  fireEvent.click(screen.getAllByTitle("Call")[0]);
  expect(screen.getByRole("dialog", { name: /Calling Priya Sharma/i })).toBeInTheDocument();

  // End call
  fireEvent.click(screen.getByTitle("End call"));
  expect(
    screen.queryByRole("dialog", { name: /Calling Priya Sharma/i })
  ).not.toBeInTheDocument();
});
