import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../../services/lostFoundService";

const categories=["Electronics","Documents","Wallet","Keys","Bag","Clothing","Books","Accessories","Other"];

export default function ReportItem({user}) {
  const navigate=useNavigate();
  const [form,setForm]=useState({itemName:"",category:"Electronics",status:"lost",location:"",dateLost:"",timeLost:"",description:"",contact:"",brand:"",colour:""});
  const [image,setImage]=useState("");
  const [error,setError]=useState("");
  const update=(k,v)=>setForm(f=>({...f,[k]:v}));
  const handleImage=e=>{const file=e.target.files?.[0];if(!file)return;const r=new FileReader();r.onload=()=>setImage(String(r.result));r.readAsDataURL(file)};
  const submit=async e=>{
    e.preventDefault();setError("");
    if(!form.itemName.trim()||!form.location.trim()){setError("Item name and location are required.");return}
    const created=await createItem({...form,image,reportedBy:user?.username||"student",reporterName:user?.name||"Student"});
    navigate(`/lost-found/item/${created.id}`);
  };
  return <main className="lf-page">
    <div className="lf-breadcrumb"><button onClick={()=>navigate("/dashboard")}>Dashboard</button><span>/</span><button onClick={()=>navigate("/lost-found")}>Lost &amp; Found</button><span>/</span><strong>Report Item</strong></div>
    <div className="inner-page-head"><div><span className="eyebrow">CREATE REPORT</span><h1>Report a lost or found item</h1><p>Give the campus community enough detail to identify and return the item safely.</p></div></div>
    <form className="professional-form" onSubmit={submit}>
      <div className="report-type-toggle"><button type="button" className={form.status==="lost"?"selected lost-choice":""} onClick={()=>update("status","lost")}><span>!</span><div><strong>I lost an item</strong><small>Tell the campus what you're looking for.</small></div></button><button type="button" className={form.status==="found"?"selected found-choice":""} onClick={()=>update("status","found")}><span>✓</span><div><strong>I found an item</strong><small>Help the owner locate their item.</small></div></button></div>
      <div className="form-section"><div className="form-section-title"><span>01</span><div><h3>Item information</h3><p>Basic details about the item.</p></div></div>
        <div className="form-grid"><label>Item name *<input value={form.itemName} onChange={e=>update("itemName",e.target.value)} placeholder="e.g. Black Apple AirPods case"/></label><label>Category<select value={form.category} onChange={e=>update("category",e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Brand<input value={form.brand} onChange={e=>update("brand",e.target.value)} placeholder="e.g. Apple, Nike"/></label><label>Colour / identifying mark<input value={form.colour} onChange={e=>update("colour",e.target.value)} placeholder="e.g. Black with a sticker"/></label></div>
      </div>
      <div className="form-section"><div className="form-section-title"><span>02</span><div><h3>When &amp; where</h3><p>Help people narrow down the location.</p></div></div>
        <div className="form-grid"><label>Location *<input value={form.location} onChange={e=>update("location",e.target.value)} placeholder="e.g. Library 2nd floor"/></label><label>Date<input type="date" value={form.dateLost} onChange={e=>update("dateLost",e.target.value)}/></label><label>Approx. time<input type="time" value={form.timeLost} onChange={e=>update("timeLost",e.target.value)}/></label><label>Contact<input value={form.contact} onChange={e=>update("contact",e.target.value)} placeholder="Email or phone"/></label></div>
      </div>
      <div className="form-section"><div className="form-section-title"><span>03</span><div><h3>Description &amp; photo</h3><p>More detail increases the chance of a match.</p></div></div>
        <div className="form-grid"><label className="full">Description<textarea rows="5" value={form.description} onChange={e=>update("description",e.target.value)} placeholder="Mention size, colour, serial number, stickers or any unique detail..."/></label><label className="full upload-box"><span className="upload-icon">↑</span><strong>Upload an item photo</strong><small>PNG, JPG or WEBP • optional</small><input type="file" accept="image/*" onChange={handleImage}/>{image&&<img src={image} alt="Preview"/>}</label></div>
      </div>
      {error&&<div className="error-box">{error}</div>}
      <div className="form-bottom"><span>By submitting, you confirm the information is accurate.</span><div><button type="button" className="secondary-button" onClick={()=>navigate("/lost-found")}>Cancel</button><button type="submit" className="primary-button">Submit Report →</button></div></div>
    </form>
  </main>
}
