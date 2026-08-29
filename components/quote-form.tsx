"use client";

import { FormEvent, useRef, useState } from "react";
import { services } from "@/content/services";

type FormState = { kind: "idle" | "sending" | "success" | "error"; message?: string; fieldErrors?: Record<string, string> };

export function QuoteForm() {
  const [state, setState] = useState<FormState>({ kind: "idle" });
  const startedAtRef = useRef<HTMLInputElement>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setState({ kind: "sending" });
    try {
      const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      const payload = await response.json() as { ok: boolean; message: string; fieldErrors?: Record<string, string> };
      if (!response.ok || !payload.ok) {
        setState({ kind: "error", message: payload.message, fieldErrors: payload.fieldErrors });
        return;
      }
      form.reset();
      setState({ kind: "success", message: payload.message });
    } catch {
      setState({ kind: "error", message: "We could not send your enquiry just now. Please call, WhatsApp or email us instead." });
    }
  };

  const errorFor = (name: string) => state.fieldErrors?.[name];
  return (
    <form className="quote-form" action="/api/enquiry" method="post" onSubmit={submit} onFocus={() => { if (startedAtRef.current && !startedAtRef.current.value) startedAtRef.current.value = String(Date.now()); }} noValidate={false}>
      <input type="hidden" name="redirect" value="/thank-you/" />
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
      <div className="form-grid">
        <Field label="Your name" name="name" error={errorFor("name")}><input id="name" name="name" type="text" autoComplete="name" maxLength={80} required /></Field>
        <Field label="Email address" name="email" error={errorFor("email")}><input id="email" name="email" type="email" autoComplete="email" maxLength={160} required /></Field>
        <Field label="Telephone" name="phone" error={errorFor("phone")}><input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} required /></Field>
        <Field label="York postcode" name="postcode" error={errorFor("postcode")}><input id="postcode" name="postcode" type="text" autoComplete="postal-code" maxLength={12} required /></Field>
        <Field label="Service" name="service" error={errorFor("service")}><select id="service" name="service" defaultValue="" required><option value="" disabled>Select a service</option>{services.map((service) => <option value={service.slug} key={service.slug}>{service.shortName}</option>)}</select></Field>
        <Field label="Property type" name="propertyType" error={errorFor("propertyType")}><select id="propertyType" name="propertyType" defaultValue="" required><option value="" disabled>Select property type</option><option>House</option><option>Flat</option><option>Holiday let</option><option>Office</option><option>Commercial space</option><option>Other</option></select></Field>
        <Field label="Frequency" name="frequency" error={errorFor("frequency")}><select id="frequency" name="frequency" defaultValue="" required><option value="" disabled>Select frequency</option><option>One-off</option><option>Weekly</option><option>Fortnightly</option><option>Other regular schedule</option><option>Not sure yet</option></select></Field>
        <Field label="Preferred date" name="preferredDate" error={errorFor("preferredDate")}><input id="preferredDate" name="preferredDate" type="date" /></Field>
        <Field label="Anything we should know?" name="message" error={errorFor("message")} wide><textarea id="message" name="message" rows={6} maxLength={2000} placeholder="Property size, priority rooms, current condition, access or timing details…" required /></Field>
      </div>
      <label className="privacy-check"><input name="privacyAccepted" type="checkbox" value="yes" required /><span>I have read the <a href="/privacy/">privacy notice</a> and agree to Sunshine Cleaning using these details to respond to my enquiry.</span></label>
      <div className="form-submit"><button className="button" type="submit" disabled={state.kind === "sending"}>{state.kind === "sending" ? "Sending…" : "Send my enquiry"}</button><p>Prefer to talk? Call <a href="tel:+447426292238">+44 7426 292238</a>.</p></div>
      {state.kind !== "idle" && state.kind !== "sending" ? <div className={`form-status ${state.kind}`} role={state.kind === "error" ? "alert" : "status"} tabIndex={-1}>{state.message}</div> : null}
    </form>
  );
}

function Field({ label, name, error, wide = false, children }: { label: string; name: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  return <div className={`form-field${wide ? " wide" : ""}`}><label htmlFor={name}>{label}</label>{children}{error ? <span className="field-error" id={`${name}-error`} role="alert">{error}</span> : null}</div>;
}
