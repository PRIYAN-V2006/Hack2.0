import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyActivity } from "../../services/lostFoundService";

export default function MyActivity({user}){
 const navigate=useNavigate(); const [items,setItems]=useState([]);
 useEffect(()=>{getMyActivity(user?.username||"student").then(setItems)},[user]);
 return <main className="lf-page">
  <div className="lf-breadcrumb"><button onClick={()=>navigate("/dashboard")}>Dashboard</button><span>/</span><button onClick={()=>navigate("/lost-found")}>Lost &amp; Found</button><span>/</span><strong>My Activity</strong></div>
  <div className="inner-page-head"><div><span className="eyebrow">YOUR ACTIVITY</span><h1>My Lost &amp; Found activity</h1><p>Track reports you created and the status of each case.</p></div><button className="primary-button" onClick={()=>navigate("/lost-found/report")}>＋ New Report</button></div>
  <div className="activity-summary"><div><span>Total reports</span><strong>{items.length}</strong></div><div><span>Open</span><strong>{items.filter(i=>i.status!=="recovered").length}</strong></div><div><span>Recovered</span><strong>{items.filter(i=>i.status==="recovered").length}</strong></div></div>
  <div className="activity-table"><div className="activity-table-head"><span>ITEM</span><span>STATUS</span><span>LOCATION</span><span>DATE</span><span></span></div>
   {items.map(item=><button className="activity-row" key={item.id} onClick={()=>navigate(`/lost-found/item/${item.id}`)}><div className="activity-item"><div className="table-thumb">{item.image?<img src={item.image} alt=""/>:<span>⌕</span>}</div><div><strong>{item.itemName}</strong><small>{item.category}</small></div></div><span className={`status-pill ${item.status}`}>{item.status}</span><span>{item.location}</span><span>{item.dateLost||"—"}</span><b>›</b></button>)}
  </div>
  {!items.length&&<div className="empty-state"><h3>No reports yet</h3><p>Create your first Lost &amp; Found report.</p><button className="primary-button" onClick={()=>navigate("/lost-found/report")}>Report an Item</button></div>}
 </main>
}
