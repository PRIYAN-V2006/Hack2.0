import React from "react";
export default function ShuttleTracking(){
 return <main className="dashboard-main">
  <div className="lf-breadcrumb"><button onClick={()=>history.back()}>← Dashboard</button><span>/</span><strong>Shuttle Tracking</strong></div>
  <div className="inner-page-head"><div><span className="eyebrow">CAMPUS SERVICE</span><h1>Shuttle Tracking</h1><p>Track campus shuttle routes and estimated arrivals.</p></div></div>
  <div className="tracking-card"><div className="tracking-map"><div className="map-line"/><div className="map-stop stop-one">Main Gate</div><div className="map-stop stop-two">AB1</div><div className="map-stop stop-three">Library</div><div className="map-bus">🚌</div></div><div className="tracking-info"><span className="status-pill found">● On Route</span><h2>Blue Shuttle</h2><p>Next stop: Library</p><strong>Estimated arrival: 6 min</strong></div></div>
 </main>
}
