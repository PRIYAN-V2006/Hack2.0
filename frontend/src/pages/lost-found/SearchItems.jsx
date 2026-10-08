import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchItems } from "../../services/lostFoundService";

const categories = ["all","Electronics","Documents","Wallet","Keys","Bag","Clothing","Books","Accessories","Other"];

export default function SearchItems() {
  const navigate = useNavigate();
  const [filters,setFilters] = useState({query:"",category:"all",location:"",status:"all"});
  const [items,setItems] = useState([]);
  const update=(k,v)=>setFilters(f=>({...f,[k]:v}));
  useEffect(()=>{searchItems(filters).then(setItems)},[filters]);

  return <main className="lf-page">
    <div className="lf-breadcrumb"><button onClick={()=>navigate("/dashboard")}>Dashboard</button><span>/</span><button onClick={()=>navigate("/lost-found")}>Lost &amp; Found</button><span>/</span><strong>Search</strong></div>
    <div className="inner-page-head"><div><span className="eyebrow">SEARCH REPORTS</span><h1>Search Lost &amp; Found</h1><p>Use any combination of details to narrow down campus reports.</p></div><button className="primary-button" onClick={()=>navigate("/lost-found/report")}>＋ Report Item</button></div>
    <section className="advanced-search">
      <div className="search-input-large"><span>⌕</span><input value={filters.query} onChange={e=>update("query",e.target.value)} placeholder="Search item name, description, brand..."/></div>
      <div className="advanced-row">
        <label>Category<select value={filters.category} onChange={e=>update("category",e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
        <label>Location<input value={filters.location} onChange={e=>update("location",e.target.value)} placeholder="e.g. Library, AB1"/></label>
        <label>Status<select value={filters.status} onChange={e=>update("status",e.target.value)}><option value="all">All status</option><option value="lost">Lost</option><option value="found">Found</option><option value="recovered">Recovered</option></select></label>
        <button className="secondary-button search-reset" onClick={()=>setFilters({query:"",category:"all",location:"",status:"all"})}>Reset</button>
      </div>
    </section>
    <div className="results-head"><strong>{items.length} reports found</strong><span>Newest reports first</span></div>
    <div className="lf-list search-list">
      {items.map(item=><article className="lf-list-card" key={item.id} onClick={()=>navigate(`/lost-found/item/${item.id}`)}>
        <div className="lf-item-thumb">{item.image?<img src={item.image} alt={item.itemName}/>:<MiniSearchIcon/>}</div>
        <div className="lf-item-main"><div className="lf-item-top"><span className={`status-pill ${item.status}`}>{item.status}</span><span>{item.category}</span></div><h3>{item.itemName}</h3><p>{item.description||"No description provided."}</p><div className="lf-item-meta"><span>⌖ {item.location}</span><span>•</span><span>{item.dateLost||"Recently"}</span></div></div><span className="list-chevron">›</span>
      </article>)}
    </div>
    {!items.length&&<div className="empty-state"><h3>No reports found</h3><p>Try broadening your search.</p></div>}
  </main>;
}
function MiniSearchIcon(){return <span className="mini-icon">⌕</span>}
