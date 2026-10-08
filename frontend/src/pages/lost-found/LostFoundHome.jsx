import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllItems, searchItems } from "../../services/lostFoundService";

const filters = ["All", "Lost", "Found", "Recovered"];

function MiniIcon({ type }) {
  return <span className="mini-icon">{type === "lost" ? "!" : type === "found" ? "✓" : type === "recovered" ? "↗" : "⌕"}</span>;
}

export default function LostFoundHome({ user }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const refresh = () => getAllItems().then(setItems);
  useEffect(() => { refresh(); }, []);

  const visible = useMemo(() => {
    const status = filter.toLowerCase();
    return items.filter(item => {
      const matchesStatus = filter === "All" || item.status === status;
      const text = `${item.itemName} ${item.category} ${item.location} ${item.description}`.toLowerCase();
      return matchesStatus && (!query || text.includes(query.toLowerCase()));
    });
  }, [items, filter, query]);

  const counts = {
    all: items.length,
    lost: items.filter(i => i.status === "lost").length,
    found: items.filter(i => i.status === "found").length,
    recovered: items.filter(i => i.status === "recovered").length
  };

  return (
    <main className="lf-page">
      <div className="lf-breadcrumb"><button onClick={() => navigate("/dashboard")}>Dashboard</button><span>/</span><strong>Lost &amp; Found</strong></div>

      <section className="lf-hero">
        <div>
          <div className="eyebrow">CAMPUS SERVICES / LOST &amp; FOUND</div>
          <h1>Find what’s lost. Return what’s found.</h1>
          <p>A central place to report missing belongings, discover found items, submit ownership claims and track your reports.</p>
        </div>
        <div className="lf-hero-actions">
          <button className="secondary-button light" onClick={() => navigate("/lost-found/activity")}>My Activity</button>
          <button className="primary-button white-primary" onClick={() => navigate("/lost-found/report")}>＋ Report an Item</button>
        </div>
      </section>

      <section className="lf-stat-grid">
        <div className="lf-stat"><div className="lf-stat-icon blue">⌕</div><div><span>Total Reports</span><strong>{counts.all}</strong><small>Campus-wide reports</small></div></div>
        <div className="lf-stat"><div className="lf-stat-icon amber">!</div><div><span>Lost Items</span><strong>{counts.lost}</strong><small>Waiting to be found</small></div></div>
        <div className="lf-stat"><div className="lf-stat-icon green">✓</div><div><span>Found Items</span><strong>{counts.found}</strong><small>Ready for identification</small></div></div>
        <div className="lf-stat"><div className="lf-stat-icon purple">↗</div><div><span>Recovered</span><strong>{counts.recovered}</strong><small>Successfully returned</small></div></div>
      </section>

      <section className="lf-content-grid">
        <div className="lf-main-column">
          <div className="lf-section-heading">
            <div><span className="eyebrow">RECENT ACTIVITY</span><h2>Recent reports</h2></div>
            <button className="text-button" onClick={() => navigate("/lost-found/search")}>View all items →</button>
          </div>

          <div className="lf-toolbar">
            <div className="lf-search">
              <span>⌕</span>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by item, category or location..." />
            </div>
            <div className="filter-pills">
              {filters.map(f => <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}<span>{counts[f.toLowerCase()]}</span></button>)}
            </div>
          </div>

          <div className="lf-list">
            {visible.slice(0, 6).map(item => (
              <article className="lf-list-card" key={item.id} onClick={() => navigate(`/lost-found/item/${item.id}`)}>
                <div className="lf-item-thumb">
                  {item.image ? <img src={item.image} alt={item.itemName}/> : <MiniIcon type={item.status}/>}
                </div>
                <div className="lf-item-main">
                  <div className="lf-item-top"><span className={`status-pill ${item.status}`}>{item.status}</span><span>{item.category}</span></div>
                  <h3>{item.itemName}</h3>
                  <p>{item.description || "No description provided."}</p>
                  <div className="lf-item-meta"><span>⌖ {item.location || "Location not specified"}</span><span>•</span><span>{item.dateLost || "Recently reported"}</span></div>
                </div>
                <span className="list-chevron">›</span>
              </article>
            ))}
          </div>

          {visible.length === 0 && <div className="empty-state"><h3>No matching reports</h3><p>Try another keyword or filter.</p></div>}
        </div>

        <aside className="lf-right-column">
          <div className="action-panel">
            <div className="panel-heading"><span className="eyebrow">QUICK ACTIONS</span><span className="panel-dot">●</span></div>
            <button onClick={() => navigate("/lost-found/report")}><span className="action-icon amber-bg">+</span><div><strong>Report Lost / Found</strong><small>Create a new campus report</small></div><b>›</b></button>
            <button onClick={() => navigate("/lost-found/search")}><span className="action-icon blue-bg">⌕</span><div><strong>Search Reports</strong><small>Find an item by details</small></div><b>›</b></button>
            <button onClick={() => navigate("/lost-found/activity")}><span className="action-icon purple-bg">◷</span><div><strong>My Activity</strong><small>Track reports and claims</small></div><b>›</b></button>
          </div>

          <div className="how-panel">
            <span className="eyebrow">HOW IT WORKS</span>
            <h3>Recover an item in 3 steps</h3>
            <div className="how-step"><span>1</span><div><strong>Report</strong><small>Add item details and location.</small></div></div>
            <div className="how-step"><span>2</span><div><strong>Search &amp; match</strong><small>Browse reports from campus.</small></div></div>
            <div className="how-step"><span>3</span><div><strong>Verify &amp; recover</strong><small>Submit proof of ownership.</small></div></div>
          </div>

          <div className="safety-panel"><span>🛡</span><div><strong>Safe handover</strong><p>Meet at an official campus help desk and verify ownership before handing over valuable items.</p></div></div>
        </aside>
      </section>
    </main>
  );
}
