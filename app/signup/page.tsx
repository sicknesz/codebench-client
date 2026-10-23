'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, Check, Code2, LockKeyhole, UserRound } from 'lucide-react'

export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true) }

  return <main className="auth-shell">
    <section className="auth-card">
      <div className="auth-brand"><div className="brand-mark"><Code2 /></div><div><strong>codebench</strong><span>candidate assessment</span></div></div>
      {submitted ? <div className="auth-success"><div className="auth-success-icon"><Check /></div><p className="auth-kicker">REGISTRATION COMPLETE</p><h1>You&apos;re ready to code.</h1><p>Your candidate profile is set up. Check your invitation email for the assessment link.</p><a className="auth-button" href="/">Go to assessment <ArrowRight /></a></div> : <>
        <div className="auth-heading"><p className="auth-kicker">CANDIDATE SIGNUP</p><h1>Create your profile</h1><p>Join the assessment workspace and show us how you solve problems.</p></div>
        <form className="auth-form" onSubmit={submit}><label>Full name<input required name="name" placeholder="Jordan Davis" autoComplete="name" /></label><label>Email address<input required type="email" name="email" placeholder="you@example.com" autoComplete="email" /></label><label>Password<div className="auth-input-icon"><LockKeyhole /><input required type="password" name="password" minLength={8} placeholder="At least 8 characters" autoComplete="new-password" /></div></label><label className="auth-check"><input required type="checkbox" /> <span>I agree to the assessment terms and privacy policy.</span></label><button className="auth-button" type="submit">Create candidate profile <ArrowRight /></button></form><p className="auth-footer">Already have an invitation? <a href="/">Open assessment</a></p>
      </>}
    </section>
    <div className="auth-aside"><div className="auth-aside-mark"><UserRound /></div><h2>A focused space for thoughtful code.</h2><p>Complete exercises, run tests, and leave a clear signal of how you approach frontend problems.</p><span>codebench / 2026</span></div>
  </main>
}
