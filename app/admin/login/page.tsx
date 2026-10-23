'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, Code2, LockKeyhole } from 'lucide-react'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setError('Demo access only — connect this form to your admin auth provider before publishing.') }

  return <main className="auth-shell auth-shell-admin"><section className="auth-card"><div className="auth-brand"><div className="brand-mark"><Code2 /></div><div><strong>codebench</strong><span>admin console</span></div></div><div className="auth-heading"><p className="auth-kicker">RESTRICTED ACCESS</p><h1>Sign in to admin</h1><p>Review candidate performance and manage assessment exercises.</p></div><form className="auth-form" onSubmit={submit}><label>Work email<input required type="email" name="email" placeholder="admin@company.com" autoComplete="username" /></label><label>Password<div className="auth-input-icon"><LockKeyhole /><input required type="password" name="password" placeholder="Your password" autoComplete="current-password" /></div></label>{error && <p className="auth-error" role="alert">{error}</p>}<button className="auth-button" type="submit">Continue to console <ArrowRight /></button></form><p className="auth-footer"><a href="/signup">Candidate signup</a></p></section></main>
}
