import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createXeroxOrder, getStudentXeroxOrders } from "../services/xeroxService";

const priceTable = { bw: 1, color: 5 };

function Stepper({ value, onChange, min = 1, max = 100 }) {
  return (
    <div className="xerox-stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <strong>{value}</strong>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

export default function XeroxShop({ user }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(1);
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState("bw");
  const [sides, setSides] = useState("single");
  const [paper, setPaper] = useState("A4");
  const [pickup, setPickup] = useState("30 minutes");
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const studentId = user?.username || user?.registerNo || "STUDENT";

  useEffect(() => {
    setOrders(getStudentXeroxOrders(studentId));
  }, [studentId, order]);

  const total = useMemo(() => {
    const sideMultiplier = sides === "double" ? 0.8 : 1;
    const paperMultiplier = paper === "A3" ? 1.5 : paper === "A5" ? 0.85 : 1;
    return Math.max(10, Math.ceil(pages * copies * priceTable[printType] * sideMultiplier * paperMultiplier));
  }, [pages, copies, printType, sides, paper]);

  const selectFile = (selected) => {
    const chosen = selected?.[0];
    setError("");
    if (!chosen) return;
    if (chosen.size > 20 * 1024 * 1024) {
      setError("File is larger than 20 MB. Please choose a smaller document.");
      return;
    }
    setFile(chosen);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please upload the document before placing the order.");
      return;
    }
    try {
      const created = await createXeroxOrder({ file, user, pages, copies, printType, paper, sides, pickup, total });
      setOrder(created);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("The document could not be saved in this browser. Please try again.");
    }
  };

  if (order) {
    return (
      <div className="xerox-page">
        <div className="page-breadcrumb">Dashboard / Campus Services / Xerox Shop</div>
        <div className="xerox-header">
          <div><span className="eyebrow">CAMPUS SERVICE</span><h1>Xerox Shop</h1><p>Your document has been securely submitted to the campus Xerox counter.</p></div>
          <Link className="xerox-owner-link" to="/xerox-owner">Shop owner portal ↗</Link>
        </div>

        <section className="xerox-confirmation-card">
          <div className="xerox-confirmation-icon">✓</div>
          <span className="eyebrow">ORDER SUBMITTED</span>
          <h2>Keep this pickup code safe</h2>
          <p>Tell this exact code to the Xerox shop owner when you arrive. The owner will release the printed document only after the code matches.</p>
          <div className="xerox-code-box"><span>YOUR PICKUP CODE</span><strong>{order.pickupCode}</strong><small>Valid for this order only</small></div>
          <div className="xerox-order-grid">
            <div><span>Order ID</span><strong>{order.id}</strong></div>
            <div><span>Document</span><strong>{order.fileName}</strong></div>
            <div><span>Pages × Copies</span><strong>{order.pages} × {order.copies}</strong></div>
            <div><span>Print</span><strong>{order.printType === "bw" ? "Black & White" : "Colour"} · {order.sides === "single" ? "Front only" : "Front & Back"}</strong></div>
            <div><span>Pickup</span><strong>{order.pickup}</strong></div>
            <div><span>Estimated amount</span><strong>₹{order.total}</strong></div>
          </div>
          <div className="xerox-security-banner"><span>🔐</span><div><strong>Code-based collection</strong><p>Do not share your pickup code with anyone except the Xerox shop owner at the counter.</p></div></div>
          <button className="xerox-primary" onClick={() => setOrder(null)}>Place another document</button>
        </section>
      </div>
    );
  }

  return (
    <div className="xerox-page">
      <div className="page-breadcrumb">Dashboard / Campus Services / Xerox Shop</div>
      <div className="xerox-header">
        <div><span className="eyebrow">CAMPUS SERVICE</span><h1>Xerox Shop</h1><p>Upload your document, specify the print requirements and collect it securely with a pickup code.</p></div>
        <div className="xerox-header-actions"><span className="xerox-status"><i /> Shop Open <small>•</small> 8:00 AM – 8:00 PM</span><Link className="xerox-owner-link" to="/xerox-owner">Owner portal</Link></div>
      </div>

      {error && <div className="xerox-error"><strong>Couldn’t continue</strong><span>{error}</span></div>}

      <form onSubmit={placeOrder}>
        <div className="xerox-layout">
          <section className="xerox-card xerox-upload-card">
            <div className="xerox-card-heading"><div className="xerox-card-icon">↑</div><div><h2>1. Upload document</h2><p>The shop owner will receive this document with your order.</p></div></div>
            <label className={`xerox-dropzone ${file ? "has-file" : ""}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); selectFile(e.dataTransfer.files); }}>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png" onChange={(e) => selectFile(e.target.files)} />
              <div className="xerox-file-icon">▣</div>
              <strong>{file ? file.name : "Choose your document"}</strong>
              <span>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Ready to upload` : "PDF, DOC, DOCX, PPT, PPTX, JPG or PNG · Max 20 MB"}</span>
              {!file && <em>Browse files</em>}
              {file && <em>Change document</em>}
            </label>
            <div className="xerox-note"><span>i</span>The actual document is stored in this browser for the frontend demo so the shop-owner screen can open/download it. Backend cloud storage will replace this later.</div>
          </section>

          <section className="xerox-card">
            <div className="xerox-card-heading"><div className="xerox-card-icon">⚙</div><div><h2>2. Print requirements</h2><p>Tell the shop exactly how you want your document printed.</p></div></div>
            <div className="xerox-form-grid">
              <label><span>Number of pages *</span><Stepper value={pages} onChange={setPages} /></label>
              <label><span>Number of copies *</span><Stepper value={copies} onChange={setCopies} /></label>
              <label><span>Print colour *</span><select value={printType} onChange={(e) => setPrintType(e.target.value)}><option value="bw">Black &amp; White — ₹1/page</option><option value="color">Colour — ₹5/page</option></select></label>
              <label><span>Paper size *</span><select value={paper} onChange={(e) => setPaper(e.target.value)}><option value="A4">A4</option><option value="A3">A3</option><option value="A5">A5</option></select></label>
              <label><span>Printing side *</span><select value={sides} onChange={(e) => setSides(e.target.value)}><option value="single">Front only / Single-sided</option><option value="double">Front &amp; Back / Double-sided</option></select></label>
              <label><span>Expected pickup *</span><select value={pickup} onChange={(e) => setPickup(e.target.value)}><option>30 minutes</option><option>1 hour</option><option>2 hours</option><option>End of day</option></select></label>
            </div>
          </section>
        </div>

        <section className="xerox-card xerox-checkout">
          <div><span className="eyebrow">3. CONFIRM ORDER</span><h2>Review before sending to the shop</h2><p>{pages} page{pages !== 1 ? "s" : ""} × {copies} cop{copies !== 1 ? "ies" : "y"} · {printType === "bw" ? "Black & White" : "Colour"} · {paper} · {sides === "single" ? "Front only" : "Front & Back"}</p></div>
          <div className="xerox-price"><span>Estimated total</span><strong>₹{total}</strong></div>
          <button className="xerox-primary" type="submit" disabled={!file}>Send to Xerox Shop →</button>
        </section>
      </form>

      <section className="xerox-process-card">
        <div><span>01</span><strong>Upload</strong><p>Select your document.</p></div>
        <b>→</b><div><span>02</span><strong>Specify</strong><p>Pages, copies &amp; print side.</p></div>
        <b>→</b><div><span>03</span><strong>Get code</strong><p>A unique pickup code is generated.</p></div>
        <b>→</b><div><span>04</span><strong>Collect</strong><p>Tell the code to the owner.</p></div>
      </section>

      {orders.length > 0 && <section className="xerox-history-card"><div className="xerox-section-title"><div><span className="eyebrow">YOUR ORDERS</span><h2>Recent Xerox requests</h2></div><span>{orders.length} order{orders.length !== 1 ? "s" : ""}</span></div><div className="xerox-history-list">{orders.slice(0, 5).map(item => <div className="xerox-history-row" key={item.id}><div className="xerox-history-file">▣</div><div className="xerox-history-main"><strong>{item.fileName}</strong><span>{item.id} · {formatDate(item.createdAt)}</span></div><div className="xerox-history-code"><span>Code</span><strong>{item.pickupCode}</strong></div><div className={`xerox-status-badge ${item.status}`}><i />{item.status === "collected" ? "Collected" : item.status === "submitted" ? "Sent to shop" : item.status}</div></div>)}</div></section>}
    </div>
  );
}
