import React, { useEffect, useMemo, useState } from "react";
import { getDocument, getXeroxOrders, verifyPickupCode, updateXeroxOrderStatus } from "../services/xeroxService";

function formatDate(value) { return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); }

export default function XeroxOwner() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");

  const refresh = () => setOrders(getXeroxOrders());
  useEffect(() => { refresh(); }, []);

  const pending = useMemo(() => orders.filter(o => o.status !== "collected"), [orders]);
  const collected = useMemo(() => orders.filter(o => o.status === "collected"), [orders]);

  const openDocument = async (order) => {
    try {
      const file = await getDocument(order.id);
      if (!file) { setMessage({ type: "error", text: "The document is not available in this browser. Backend storage will solve this in the next phase." }); return; }
      const url = URL.createObjectURL(file);
      setDocumentUrl(url);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch { setMessage({ type: "error", text: "Unable to open the uploaded document." }); }
  };

  const selectOrder = (order) => { setSelected(order); setCode(""); setMessage(null); setDocumentUrl(""); };

  const verify = () => {
    if (!selected) return;
    const result = verifyPickupCode(selected.id, code);
    if (result.ok) {
      setSelected(result.order);
      setMessage({ type: "success", text: "Code matched. Release the printed document to the student." });
      refresh();
    } else setMessage({ type: "error", text: result.message });
  };

  const markPrinting = () => {
    if (!selected) return;
    const updated = updateXeroxOrderStatus(selected.id, "printing");
    setSelected(updated); refresh();
    setMessage({ type: "success", text: "Order marked as printing." });
  };

  return (
    <div className="xerox-owner-page">
      <div className="owner-header"><div><span className="eyebrow">XEROX SHOP • OWNER CONSOLE</span><h1>Print Order Desk</h1><p>Receive student documents, prepare the print and verify the pickup code before handing it over.</p></div><div className="owner-live"><i /> Live frontend demo</div></div>

      <div className="owner-stats"><div><span>Pending orders</span><strong>{pending.length}</strong><small>Waiting for action</small></div><div><span>Collected</span><strong>{collected.length}</strong><small>Successfully handed over</small></div><div><span>Total orders</span><strong>{orders.length}</strong><small>Stored in this browser</small></div></div>

      {message && <div className={`owner-message ${message.type}`}><strong>{message.type === "success" ? "Success" : "Action needed"}</strong><span>{message.text}</span></div>}

      <div className="owner-layout">
        <section className="owner-orders-card"><div className="owner-card-head"><div><span className="eyebrow">INCOMING REQUESTS</span><h2>Student print orders</h2></div><button className="owner-refresh" onClick={refresh}>↻ Refresh</button></div>
          {orders.length === 0 ? <div className="owner-empty"><div>▣</div><strong>No print orders yet</strong><p>When a student submits a Xerox request, it will appear here.</p></div> : <div className="owner-order-list">{orders.map(order => <button className={`owner-order-row ${selected?.id === order.id ? "selected" : ""}`} key={order.id} onClick={() => selectOrder(order)}><div className="owner-doc-icon">PDF</div><div className="owner-order-main"><strong>{order.fileName}</strong><span>{order.studentName} · {order.studentId}</span><small>{formatDate(order.createdAt)}</small></div><div className="owner-order-meta"><strong>₹{order.total}</strong><span>{order.pages}p × {order.copies}</span></div><span className={`owner-badge ${order.status}`}>{order.status === "submitted" ? "New" : order.status === "printing" ? "Printing" : "Collected"}</span></button>)}</div>}
        </section>

        <section className="owner-detail-card">
          {!selected ? <div className="owner-empty owner-detail-empty"><div>⌁</div><strong>Select an order</strong><p>Order details, the uploaded document and secure pickup verification will appear here.</p></div> : <>
            <div className="owner-detail-head"><div><span className="eyebrow">ORDER {selected.id}</span><h2>{selected.fileName}</h2><p>Submitted {formatDate(selected.createdAt)}</p></div><span className={`owner-badge large ${selected.status}`}>{selected.status === "submitted" ? "New request" : selected.status === "printing" ? "Printing" : "Collected"}</span></div>
            <div className="owner-student"><div className="owner-avatar">{(selected.studentName || "S")[0]}</div><div><span>STUDENT</span><strong>{selected.studentName}</strong><small>{selected.studentId}</small></div></div>
            <div className="owner-spec-grid"><div><span>Pages</span><strong>{selected.pages}</strong></div><div><span>Copies</span><strong>{selected.copies}</strong></div><div><span>Print</span><strong>{selected.printType === "bw" ? "B&W" : "Colour"}</strong></div><div><span>Side</span><strong>{selected.sides === "single" ? "Front" : "Front & Back"}</strong></div><div><span>Paper</span><strong>{selected.paper}</strong></div><div><span>Amount</span><strong>₹{selected.total}</strong></div></div>
            <button className="owner-document-button" onClick={() => openDocument(selected)}>↗ Open uploaded document</button>
            {selected.status !== "collected" && <div className="owner-verification"><span className="eyebrow">SECURE COLLECTION</span><h3>Verify pickup code</h3><p>Ask the student to tell you the 6-character code shown after submitting the order. Do not hand over the print until it matches.</p><div className="owner-code-entry"><input maxLength={6} value={code} onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} placeholder="ENTER CODE" /><button onClick={verify} disabled={code.length !== 6}>Verify code</button></div>{selected.status === "submitted" && <button className="owner-printing-button" onClick={markPrinting}>Mark as printing</button>}</div>}
            {selected.status === "collected" && <div className="owner-collected"><div>✓</div><strong>Verified &amp; collected</strong><p>The code matched. The Xerox can be handed to the student.</p></div>}
          </>}
        </section>
      </div>
    </div>
  );
}
