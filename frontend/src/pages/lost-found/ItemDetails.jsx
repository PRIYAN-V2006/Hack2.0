import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemById, submitClaim, markRecovered } from "../../services/lostFoundService";

export default function ItemDetails({user}){
 const {id}=useParams(); const navigate=useNavigate(); const [item,setItem]=useState(null); const [proof,setProof]=useState(""); const [message,setMessage]=useState("");
 const load=()=>getItemById(id).then(setItem); useEffect(()=>{load()},[id]);
 if(!item)return <main className="lf-page"><button className="text-button" onClick={()=>navigate("/lost-found/search")}>← Back to search</button><div className="empty-state"><h2>Item not found</h2><p>This report may have been removed.</p></div></main>;
 const claim=async()=>{if(!proof.trim()){setMessage("Please provide identifying information.");return}await submitClaim(item.id,{claimantName:user?.name||"Student",claimantContact:user?.username||"",proof});setProof("");setMessage("Claim submitted. The reporter can now verify your details.");load()};
 const recovered=async()=>{await markRecovered(item.id);setMessage("Item marked as recovered.");load()};
 return <main className="lf-page">
  <div className="lf-breadcrumb"><button onClick={()=>navigate("/dashboard")}>Dashboard</button><span>/</span><button onClick={()=>navigate("/lost-found")}>Lost &amp; Found</button><span>/</span><strong>Item Details</strong></div>
  <section className="detail-card">
   <div className="detail-photo">{item.image?<img src={item.image} alt={item.itemName}/>:<span>⌕</span>}</div>
   <div className="detail-body"><div className="item-topline"><span className={`status-pill ${item.status}`}>{item.status}</span><span>{item.category}</span></div><h1>{item.itemName}</h1><p className="details-description">{item.description||"No description provided."}</p>
    <div className="detail-facts"><div><span>Location</span><strong>{item.location||"Not specified"}</strong></div><div><span>Date</span><strong>{item.dateLost||"Not specified"}</strong></div><div><span>Time</span><strong>{item.timeLost||"Not specified"}</strong></div><div><span>Reported by</span><strong>{item.reporterName||"Student"}</strong></div></div>
    {item.contact&&<div className="contact-box"><span>Reporter contact</span><strong>{item.contact}</strong></div>}
    {item.status!=="recovered"&&<div className="claim-box"><div><span className="eyebrow">OWNERSHIP CLAIM</span><h3>Is this your item?</h3><p>Tell the reporter something only the owner would know.</p></div><textarea rows="4" value={proof} onChange={e=>setProof(e.target.value)} placeholder="Example: unique scratch, serial number, contents inside..."/><button className="primary-button" onClick={claim}>Submit Ownership Claim</button></div>}
    {user?.username===item.reportedBy&&item.status!=="recovered"&&<button className="secondary-button" onClick={recovered}>✓ Mark as Recovered</button>}
    {message&&<div className="success-box">{message}</div>}
   </div>
  </section>
 </main>
}
