import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest, getStudentRequests } from "../services/requestService";
import "./RequestPage.css";

function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function RequestPage({ user }) {
  const navigate = useNavigate();
  const studentId = user?.username || user?.registerNo || "student";
  const [requests, setRequests] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    try {
      setRequests(getStudentRequests(studentId));
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [studentId]);

  const submitRequest = event => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const request = createRequest({ subject, message, user });
      setRequests(current => [request, ...current]);
      setSubject("");
      setMessage("");
      setSuccess(`Your query was submitted. Reference: ${request.id}`);
    } catch (submitError) {
      setError(submitError.message || "Unable to submit your query. Please try again.");
    }
  };

  return (
    <main className="request-page">
      <div className="request-breadcrumb">
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <span>/</span>
        <strong>Request</strong>
      </div>

      <header className="request-header">
        <div>
          <span className="eyebrow">CAMPUS SUPPORT</span>
          <h1>Submit a query</h1>
          <p>Send a question or request to the campus team and keep track of your submissions.</p>
        </div>
        <div className="request-count"><strong>{requests.length}</strong><span>Your queries</span></div>
      </header>

      <div className="request-layout">
        <section className="request-card">
          <div className="request-card-heading">
            <div className="request-card-icon">＋</div>
            <div><h2>New query</h2><p>Provide a short subject and the details of your query.</p></div>
          </div>

          {error && <div className="request-message request-error" role="alert">{error}</div>}
          {success && <div className="request-message request-success" role="status">{success}</div>}

          <form className="request-form" onSubmit={submitRequest}>
            <label>
              <span>Subject</span>
              <input
                value={subject}
                onChange={event => setSubject(event.target.value)}
                maxLength={100}
                required
                placeholder="What is your query about?"
              />
            </label>
            <label>
              <span>Query details</span>
              <textarea
                value={message}
                onChange={event => setMessage(event.target.value)}
                maxLength={1000}
                minLength={10}
                required
                rows={6}
                placeholder="Describe your question or request..."
              />
              <small>{message.length}/1000 characters</small>
            </label>
            <button className="primary-button" type="submit">Submit query</button>
          </form>
        </section>

        <section className="request-card request-history">
          <div className="request-card-heading">
            <div className="request-card-icon">▤</div>
            <div><h2>Your submitted queries</h2><p>Queries submitted from your account appear here.</p></div>
          </div>
          {requests.length === 0 ? (
            <div className="request-empty">
              <strong>No queries yet</strong>
              <p>Once you submit a query, you can review its reference and status here.</p>
            </div>
          ) : (
            <div className="request-list">
              {requests.map(request => (
                <article className="request-item" key={request.id}>
                  <div className="request-item-heading">
                    <div><h3>{request.subject}</h3><span>{request.id} · {formatDate(request.createdAt)}</span></div>
                    <span className="request-status">{request.status}</span>
                  </div>
                  <p>{request.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
