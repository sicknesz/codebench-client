'use client'

import Editor, { useMonaco } from '@monaco-editor/react'
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Code2,
  FileCode2,
  GripVertical,
  Lightbulb,
  Play,
  RotateCcw,
  Settings2,
  FlaskConical,
  Terminal,
  Timer,
  // X,
  Zap,
} from 'lucide-react'
import { useState, useEffect, act } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  // DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


type Difficuty = "Easy" | "Medium" | "Hard" | "Expert";

export type Exercise = {
  id: string;
  title: string;
  difficulty: Difficuty;
  time: string;
  active?: boolean;
  description?: {
    p: string;
    h1: string;
    h2: string;
  };
  task?: string;
  requirement: string[];
  hint?: React.ReactNode;
  sourceCode?: string;
  testCode?: string;
  score?: number;
}


const starterTestCode = `
import { describe, it } from "bun:test";

test('returns ranked active users', () => {
  expect(transformUsers(users)).toStrictEqual([
    { name: 'Avery', score: 92, active: true, rank: 1 },
    { name: 'Jordan', score: 87, active: true, rank: 2 },
  ])
})
`

const starterCode = `
function transformUsers(users) {
  // Return only active users,
  // sorted by their score (highest first).
  // Add a "rank" property to each user.

  return users
}

const users = [
  { name: "Avery", score: 92, active: true },
  { name: "Sam", score: 68, active: false },
  { name: "Jordan", score: 87, active: true },
]
`

const exercises: Exercise[] = [
  {
    id: '01',
    title: 'Array transformation',
    description: {
      p: "Create a function that filters, sorts, and enriches a list of users.",
      h1: "Transform and rank active users",
      h2: "Task"
    },
    difficulty: 'Easy',
    time: '15 min',
    active: true,
    sourceCode: starterCode,
    testCode: starterTestCode,
    task: "Implement\n<code>transformUsers</code>\nso it returns only active users, ordered by their score from highest to lowest. Each returned user should include a\n<code>rank</code>\nproperty starting at 1.",
    requirement: ['Do not mutate the original <code>users</code> array.', 'Preserve all properties from each user object.', 'Return a new array when no users are active.'],
    hint: (<div className="tip">
      <Lightbulb />
      <div>
        <strong>Think about it</strong>
        <p>Which array methods can you chain to keep this readable?</p>
      </div>
    </div>)
  },
  { id: '02', title: 'Async data pipeline', difficulty: 'Medium', time: '25 min', requirement: [] },
  { id: '03', title: 'Memoization utility', difficulty: 'Medium', time: '20 min', requirement: [] },
  { id: '04', title: 'Tree traversal', difficulty: 'Hard', time: '35 min', requirement: [] },
  { id: '05', title: 'Rate limiter', difficulty: 'Hard', time: '40 min', requirement: [] },
]

type LanguagesOption = {
  id: number, text: "javascript" | "typescript",
  checked: boolean,
  badge: "js-badge" | "ts-badge",
  short: "JS" | "TS"
};

type PaneHeaderProps = {
  icon: React.ReactNode;
  label: string;
  meta?: string;
  action?: React.ReactNode;
  paneId?: string;
  onDragStart?: (paneId: string) => void
};


const handleProfileSettingClicked = () => { };

const capitalize = (string: string) => string.slice(0, 1).toUpperCase() + string.slice(1)

const renderLanguageSelected = (option: LanguagesOption) => {
  return (
    <>
      <span className={option.badge}>{option.short}</span> {capitalize(option.text)}
    </>
  )
}

const renderCandidate = (candidate: Candidate) => {
  return (
    <div className="profile">
      <div className="avatar">{candidate.avatar}<span className="online-dot" /></div>
      <div className="profile-copy"><strong>{candidate.firstName} {candidate.lastName}</strong>
        <span>Candidate · #{candidate.id}</span>
      </div>
      <Button className="icon-button" aria-label="Profile settings" onClick={handleProfileSettingClicked}><Settings2 /></Button>
    </div>
  );
}

function PaneHeader({ icon, label, meta, action, paneId, onDragStart }: PaneHeaderProps) {
  return (
    <div className="pane-header" draggable={Boolean(paneId)} onDragStart={() => paneId && onDragStart?.(paneId)} title="Drag to move panel">
      <div className="pane-label"><span className="pane-icon">{icon}</span><span>{label}</span>{meta && <span className="pane-meta">{meta}</span>}</div>
      {action}
    </div>
  )
}

type Candidate = {
  avatar: string,
  firstName: string,
  lastName: string,
  id: number,
}

const defaultCandidate: Candidate = {
  avatar: "SR",
  firstName: "Sylvain",
  lastName: "Rocca-serra",
  id: 1,
}


export default function Page() {
  const [candidate, setCandidate] = useState<Candidate>(defaultCandidate);
  const [activeExercise, setActiveExercise] = useState<Exercise>(exercises[0])
  const [code, setCode] = useState(starterCode)
  const [testCode, setTestCode] = useState(starterTestCode)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<'idle' | 'passed' | 'failed'>('idle')
  const [remainingSeconds, setRemainingSeconds] = useState(1 * 60 * 42 + 18)
  const [language, setLanguage] = useState<LanguagesOption>({ id: 0, text: "javascript", checked: true, badge: "js-badge", short: "JS" });
  const [focusedPane, setFocusedPane] = useState<string | null>(null)
  const [resultView, setResultView] = useState<'preview' | 'console'>('preview')
  const [draggedPane, setDraggedPane] = useState<string | null>(null)
  const [paneOrder, setPaneOrder] = useState(['directions', 'result', 'editor', 'tests'])

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      console.log('here is the monaco instance:', monaco);
    }
  }, [monaco]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const runTests = () => {
    setIsRunning(true)
    setResult('idle')
    window.setTimeout(() => { setIsRunning(false); setResult('passed') }, 850)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remaining = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
  }

  const movePane = (targetPane: string) => {

    if (!draggedPane || draggedPane === targetPane) return

    setPaneOrder((current) => {
      const next = [...current]
      const from = next.indexOf(draggedPane)
      const to = next.indexOf(targetPane)
      next.splice(from, 1)
      next.splice(to, 0, draggedPane)
      return next
    })
    setDraggedPane(null)
  }

  /*   const handleLanguageSelect = (event: React.SyntheticEvent) => {
      console.log(`[handleLanguageSelect]: got event`, event);
    } */

  const handleRunTest = (/* event: React.SyntheticEvent */) => {

    const finalCode = `${code}\n${testCode}`;
    alert(finalCode);
  }

  const handleResetClicked = () => {
    alert("TODO: implement reset")
  };


  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Code2 /></div><div><strong>codebench</strong><span>assessment studio</span></div></div>
        {renderCandidate(candidate)}
        <div className="exercise-heading">
          <span>EXERCISES</span>
          <span className="count">05</span>
        </div>
        <nav className="exercise-list" aria-label="Exercises">
          {exercises.map((exercise) =>
            <button key={exercise.id} onClick={() => setActiveExercise(exercise)}
              className={`exercise-item ${activeExercise.id === exercise.id ? 'selected' : ''}`}>
              <span className="exercise-number">{exercise.id}</span>
              <span className="exercise-info">
                <strong>{exercise.title}</strong>
                <span>
                  <i className={`difficulty ${exercise.difficulty.toLowerCase()}`} />{exercise.difficulty}
                  <em>·</em>
                  {exercise.time}
                </span>
              </span>
              {activeExercise.id === exercise.id && <ChevronRight className="selected-arrow" />}
            </button>
          )}
        </nav>
        <div className="sidebar-footer"><div className="progress-label"><span>SESSION PROGRESS</span><strong>1 / 5</strong></div><div className="progress-track"><div className="progress-value" /></div><div className="session-meta"><span><Timer /> 01:42:18 remaining</span><button aria-label="Help"><CircleHelp /></button></div></div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Exercises</span>
            <ChevronRight />
            <strong>{activeExercise.title}</strong>
            <span className="status-pill"><span />
              In progress
            </span>
          </div>
          <div className="top-actions">
            <div className={`countdown ${remainingSeconds < 300 ? 'countdown-warning' : ''}`}
              role="timer"
              aria-label={`${formatTime(remainingSeconds)} remaining`}>
              <Timer />
              <span>{formatTime(remainingSeconds)}</span>
              <small>remaining</small>
            </div>
            <button className="reset-button" onClick={handleResetClicked}>
              <RotateCcw /> Reset
            </button>
            <Button className="run-button" onClick={runTests} disabled={isRunning}>
              <Play /> {isRunning ? 'Running…' : 'Run tests'}<kbd>⌘ ↵</kbd>
            </Button>
          </div>
        </header>
        <div className="workspace-grid">
          <section
            style={{ order: paneOrder.indexOf('directions') }}
            className="pane directions-pane"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => movePane('directions')}>
            <PaneHeader paneId="directions"
              onDragStart={setDraggedPane}
              icon={<FileCode2 />}
              label="Directions"
              meta="README.md"
              action={<button className="more-button" aria-label="Directions options">•••</button>}
            />
            <div className="pane-scroll">
              <div className="eyebrow">{activeExercise.title}</div>
              <h1>{activeExercise.description?.h1}</h1>
              <p className="intro">{activeExercise.description?.p}</p>
              <div className="section-block">
                <h2>{activeExercise.description?.h2}</h2>
                <p dangerouslySetInnerHTML={{ __html: activeExercise.task as string }}>

                </p>
              </div>
              <div className="section-block">
                <h2>Requirements</h2>
                <ul>
                  {activeExercise.requirement.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              {activeExercise.hint}
            </div>
            <div className="resize-corner" />
          </section>
          <section className="pane result-pane" style={{ order: paneOrder.indexOf('result') }} onDragOver={(event) => event.preventDefault()} onDrop={() => movePane('result')}>
            <PaneHeader paneId="result" onDragStart={setDraggedPane} icon={<Zap />} label="Result" meta={resultView === 'preview' ? 'Live preview' : 'stdout / stderr'} action={<span className="live-dot"><i /> Live</span>} /><div className="result-tabs" role="tablist" aria-label="Result views"><button role="tab" aria-selected={resultView === 'preview'} className={resultView === 'preview' ? 'active' : ''} onClick={() => setResultView('preview')}><Zap /> Preview</button><button role="tab" aria-selected={resultView === 'console'} className={resultView === 'console' ? 'active' : ''} onClick={() => setResultView('console')}><Terminal /> Console</button></div>{resultView === 'preview' ? <div className="result-content"><div className="result-placeholder"><div className={`result-icon ${result}`}><Check /></div><h2>{result === 'passed' ? 'All tests passed' : 'Your result will appear here'}</h2><p>{result === 'passed' ? 'Nice work — the solution meets every requirement.' : 'Run your solution to see the output and test feedback.'}</p></div>{result === 'passed' && <div className="result-summary"><div><span>STATUS</span><strong className="success-text">Passed</strong></div><div><span>TESTS</span><strong>6 / 6</strong></div><div><span>RUNTIME</span><strong>42 ms</strong></div></div>}</div> : <div className="console-view" role="log" aria-live="polite"><div className="console-line"><span className="console-prompt">›</span><span>transformUsers(users)</span></div>{result === 'passed' ? <><div className="console-line console-output"><span className="console-prompt">→</span><span>[{`{ name: 'Avery', score: 92, active: true, rank: 1 }`}, {`{ name: 'Jordan', score: 87, active: true, rank: 2 }`}]</span></div><div className="console-line console-success"><span className="console-prompt">✓</span><span>6 tests passed in 42 ms</span></div></> : <div className="console-muted">Run tests to stream output here…</div>}</div>}<div className="resize-corner" /></section>
          <section
            style={{ order: paneOrder.indexOf('editor') }}
            className="pane editor-pane"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => movePane('editor')}
            onFocus={() => setFocusedPane('editor')}>
            <PaneHeader paneId="editor" onDragStart={setDraggedPane} icon={<Terminal />} label="Code editor" meta="solution.js"
              action={
                <div className="editor-actions">
                  <span className="language-label">
                    {renderLanguageSelected(language)}
                    <ChevronDown />
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="more-button" render={<Button variant="outline" />}>
                      •••
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuCheckboxItem
                        checked={language.id === 0}
                        onCheckedChange={(checked: boolean) =>
                          setLanguage({ id: 0, text: "javascript", checked, badge: "js-badge", short: "JS" })
                        }>Javascript</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={language.id === 1}
                        onCheckedChange={(checked: boolean) =>
                          setLanguage({ id: 1, text: "typescript", checked, badge: "ts-badge", short: "TS" })
                        }>Typescript</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }
            />
            <div className="editor-wrap">
              <Editor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value ?? '')}
                options={{
                  minimap: {
                    enabled: false
                  },
                  fontSize: 13,
                  lineHeight: 21,
                  padding: { top: 18 },
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  renderLineHighlight: 'line',
                  overviewRulerBorder: false,
                  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"
                }}
              />
            </div>
            <div className="editor-status">
              <span>Ln 7, Col 10</span><span>Spaces: 2</span>
              <span>UTF-8</span><span>JavaScript</span>
            </div>
            <div className="resize-corner" />
          </section>
          <section style={{ order: paneOrder.indexOf('tests') }} className="pane tests-pane" onDragOver={(event) => event.preventDefault()} onDrop={() => movePane('tests')} onClick={() => setFocusedPane('tests')}>
            <PaneHeader paneId="tests" onDragStart={setDraggedPane} icon={<FlaskConical />} label="Test results" meta="6 cases"
              action={<Button className="run-button" onClick={handleRunTest}><Play /> {isRunning ? 'Running…' : 'Run tests'}</Button>}
            />
            <Editor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={testCode}
              onChange={(value) => setTestCode(value ?? '')}
              options={{
                minimap: {
                  enabled: false
                },
                fontSize: 13,
                lineHeight: 21,
                padding: { top: 18 },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                renderLineHighlight: 'line',
                overviewRulerBorder: false,
                fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"
              }}
            />
            <div className="resize-corner" /></section>
        </div>
        <footer className="workspace-footer">
          <span>
            <GripVertical /> Drag panel edges to resize
          </span>
          <span>Autosaved just now
            <span className="save-dot" />
          </span>
        </footer>
      </section >
    </main >
  )
}
