'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, BarChart3, Check, ChevronDown, Code2, Download, Filter, GitCompare, Search, Timer, Trophy, Users, X } from 'lucide-react'

type Candidate = { userId: number; completed: number; failed: number; history: string[]; score: number; ranking: number; speed: number }

type SortKey = 'score' | 'speed' | 'result'

const candidates: Candidate[] = [
  { userId: 10482, completed: 5, failed: 0, history: ['Array transformation', 'Async data pipeline', 'Memoization utility', 'Tree traversal', 'Rate limiter'], score: 94, ranking: 1, speed: 87 },
  { userId: 10467, completed: 4, failed: 1, history: ['Array transformation', 'Async data pipeline', 'Memoization utility', 'Tree traversal'], score: 88, ranking: 2, speed: 72 },
  { userId: 10491, completed: 4, failed: 1, history: ['Array transformation', 'Async data pipeline', 'Memoization utility', 'Rate limiter'], score: 84, ranking: 3, speed: 91 },
  { userId: 10455, completed: 3, failed: 2, history: ['Array transformation', 'Async data pipeline', 'Memoization utility'], score: 76, ranking: 4, speed: 65 },
  { userId: 10438, completed: 2, failed: 3, history: ['Array transformation', 'Async data pipeline'], score: 61, ranking: 5, speed: 48 },
]

function initials(userId: number) { return String(userId).slice(-2) }

export default function AdminPage() {
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [ascending, setAscending] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<number[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  const sortedCandidates = useMemo(() => candidates.filter((candidate) => String(candidate.userId).includes(query)).sort((a, b) => {
    const values = sortKey === 'speed' ? [a.speed, b.speed] : sortKey === 'result' ? [a.completed - a.failed, b.completed - b.failed] : [a.score, b.score]
    return (values[1] - values[0]) * (ascending ? -1 : 1)
  }), [query, sortKey, ascending])

  const toggleSelected = (userId: number) => { setCompareOpen(false); setSelected((current) => current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId].slice(-2)) }
  const comparedCandidates = candidates.filter((candidate) => selected.includes(candidate.userId))

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <div className="brand"><div className="brand-mark"><Code2 /></div><div><strong>codebench</strong><span>admin console</span></div></div>
      <div className="admin-profile"><div className="admin-avatar">AD</div><div><strong>Alex Davis</strong><span>Workspace admin</span></div><ChevronDown /></div>
      <nav className="admin-nav" aria-label="Admin navigation"><a className="active" href="/admin"><BarChart3 /> Overview</a><a href="#candidates"><Users /> Candidates <span>24</span></a><a href="#exercises"><Code2 /> Exercises</a></nav>
      <div className="admin-sidebar-footer"><span>ASSESSMENT WINDOW</span><strong>Frontend · Oct 2026</strong><small>Last synced 2 min ago</small></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="admin-kicker">WORKSPACE / OVERVIEW</p><h1>Candidate results</h1></div><button className="export-button"><Download /> Export report</button></header>
      <div className="admin-content">
        <div className="admin-stat-grid"><div className="admin-stat"><span><Users /> Candidates</span><strong>24</strong><small className="positive">+6 this week</small></div><div className="admin-stat"><span><Check /> Completion rate</span><strong>78%</strong><small className="positive">+4.2% vs. last round</small></div><div className="admin-stat"><span><Trophy /> Average score</span><strong>76.4</strong><small>Top score 94</small></div><div className="admin-stat"><span><Timer /> Avg. speed</span><strong>68%</strong><small>Across 5 exercises</small></div></div>
        <div className="admin-toolbar"><div className="admin-search"><Search /><input aria-label="Search candidates" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by candidate ID" /></div><button className="filter-button"><Filter /> All candidates <ChevronDown /></button><div className="toolbar-spacer" />{selected.length > 0 && <span className="compare-count">{selected.length} selected</span>}<button className="compare-button" disabled={selected.length !== 2} onClick={() => setCompareOpen(true)}><GitCompare /> Compare</button></div>
        {compareOpen && comparedCandidates.length === 2 && <div className="comparison-card"><div><p className="admin-kicker">SIDE-BY-SIDE REVIEW</p><h2>Candidate comparison</h2></div><button className="close-compare" onClick={() => setCompareOpen(false)} aria-label="Close comparison"><X /></button><div className="comparison-grid">{comparedCandidates.map((candidate) => <div className="comparison-column" key={candidate.userId}><div className="candidate-name"><div className="candidate-avatar">{initials(candidate.userId)}</div><strong>#{candidate.userId}</strong></div><div><span>Score</span><strong>{candidate.score}</strong></div><div><span>Result</span><strong>{candidate.completed} passed / {candidate.failed} failed</strong></div><div><span>Speed</span><strong>{candidate.speed}% efficiency</strong></div><div><span>Exercises completed</span><strong>{candidate.completed} / 5</strong></div></div>)}</div></div>}
        <div className="candidate-card" id="candidates"><div className="card-heading"><div><h2>All candidates</h2><p>Ranked performance across the current assessment</p></div><span className="updated-label">Updated just now</span></div><div className="table-wrap"><table><thead><tr><th>Candidate</th><th><button onClick={() => { setSortKey('result'); setAscending(sortKey === 'result' ? !ascending : false) }}>RESULT <ArrowDown /></button></th><th><button onClick={() => { setSortKey('score'); setAscending(sortKey === 'score' ? !ascending : false) }}>SCORE <ArrowDown /></button></th><th><button onClick={() => { setSortKey('speed'); setAscending(sortKey === 'speed' ? !ascending : false) }}>SPEED <ArrowDown /></button></th><th>EXERCISE HISTORY</th><th /></tr></thead><tbody>{sortedCandidates.map((candidate) => <tr key={candidate.userId} className={selected.includes(candidate.userId) ? 'selected-row' : ''}><td><div className="candidate-name"><div className="candidate-avatar">{initials(candidate.userId)}</div><div><strong>Candidate #{candidate.userId}</strong><span>Frontend assessment</span></div></div></td><td><strong className="result-count">{candidate.completed} <span>passed</span></strong><small className="failed-count">{candidate.failed} failed</small></td><td><div className="score-cell"><strong>{candidate.score}</strong><div className="mini-track"><i style={{ width: `${candidate.score}%` }} /></div></div></td><td><strong className="speed-value">{candidate.speed}%</strong><small className="speed-label">efficiency</small></td><td><div className="history-chips">{candidate.history.slice(0, 3).map((exercise) => <span key={exercise}>{exercise}</span>)}{candidate.history.length > 3 && <span>+{candidate.history.length - 3}</span>}</div></td><td><button className={`select-button ${selected.includes(candidate.userId) ? 'is-selected' : ''}`} onClick={() => toggleSelected(candidate.userId)} aria-label={`${selected.includes(candidate.userId) ? 'Remove' : 'Select'} candidate ${candidate.userId}`}>{selected.includes(candidate.userId) ? <Check /> : <GitCompare />}</button></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing {sortedCandidates.length} of 24 candidates</span><span>Use the headers to sort <ArrowUp /></span></div></div>
      </div>
    </section>
  </main>
}
