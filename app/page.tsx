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
  CircleX,
} from 'lucide-react'
import { useState, useEffect } from 'react'

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
import { TestResult } from "@/components/Alert"

import { Manager } from "socket.io-client";
import type { Socket } from "socket.io-client";
// import { monaco as CodingMonaco } from "@codingame/monaco-editor-react";
// import CodingEditor from "@codingame/monaco-editor-react";

type WebSocket = Socket<any, any>

type Difficuty = "Easy" | "Medium" | "Hard" | "Expert";

export type LanguagesOption = {
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

type Candidate = {
  avatar: string,
  firstName: string,
  lastName: string,
  id: number,
}

type Status = "RUNNING" | "PASSED" | "FAILED" | "SKIPPED";

type Test = { name: string, status: Status, durationMs?: number };
type Counts = { pass: number, fail: number, durationMs: number, success: boolean };

export type Exercise = {
  id: string;
  title: string;
  difficulty: Difficuty;
  time: string;
  active?: boolean;
  description?: {
    p: string;
    h1: string;
  };
  task?: string;
  requirement: string[];
  hint?: React.ReactNode;
  sourceCode?: string;
  testCode?: string;
  score?: number;
  solution: string;
  testFiles?: string[];
}


const starterCode = `
type User = { name: string, score: number, active: boolean, rank?: number };

const users: User[] = [
  { name: "Avery", score: 92, active: true },
  { name: "Sam", score: 68, active: true },
  { name: "Jordan", score: 87, active: true },
]

/*
  Install : https://github.com/xtermjs/xterm.js/ to get a terminal working on the page
*/

function transformUsers(users: User[]) {
  const newUsers = [...users]
    .filter((u: any) => u.active)
    .sort((a: any, b: any) => b.score - a.score)
    .map((u: any, i: number) => ({ ...u, rank: i + 1 }));

  return newUsers;
}
`

const starterTestCode = `
import { describe, it } from "node:test";

type User = { name: string, score: number, active: boolean, rank?: number };

function transformUsers(users: User[]) {
  const newUsers = [...users]
    .filter((u: any) => u.active)
    .sort((a: any, b: any) => b.score - a.score)
    .map((u: any, i: number) => ({ ...u, rank: i + 1 }));

  return newUsers
}

describe("testing filtering function", () => {
  it('returns 3 ranked active users', (t) => {
    const users: User[] = [
      { name: "Avery", score: 92, active: true },
      { name: "Sam", score: 68, active: true },
      { name: "Jordan", score: 87, active: true },
    ]
    t.assert.deepEqual(transformUsers(users), [
      { name: 'Avery', score: 92, active: true, rank: 1 },
      { name: 'Jordan', score: 87, active: true, rank: 2 },
      { name: "Sam", score: 68, active: true, rank: 3 },
    ])
  })
  it('returns 2 ranked active users', (t) => {
    const users: User[] = [
      { name: "Avery", score: 92, active: true },
      { name: "Sam", score: 68, active: false },
      { name: "Jordan", score: 87, active: true },
    ]
    t.assert.deepEqual(transformUsers(users), [
      { name: 'Avery', score: 92, active: true, rank: 1 },
      { name: 'Jordan', score: 87, active: true, rank: 2 },
    ])
  })
  it.expectFailure('should fail to return ranked active users', (t) => {
    const users: User[] = [
      { name: "Avery", score: 92, active: true },
      { name: "Sam", score: 68, active: false },
      { name: "Jordan", score: 87, active: true },
    ]
    t.assert.deepEqual(transformUsers(users), [
      { name: 'Avery', score: 99, active: true, rank: 2 },
      { name: 'Jordan', score: 87, active: true, rank: 3 },
    ])
  })
  it('should fail to return ranked active users', (t) => {
    const users: User[] = [
      { name: "Avery", score: 92, active: true },
      { name: "Sam", score: 68, active: false },
      { name: "Jordan", score: 87, active: true },
    ]
    t.assert.deepEqual(transformUsers(users), [
      { name: 'Avery', score: 99, active: true, rank: 2 },
      { name: 'Jordan', score: 87, active: true, rank: 3 },
    ])
  })    
})
`


const exercises: Exercise[] = [
  {
    id: '01',
    title: 'Array transformation',
    description: {
      p: "Create a function that filters, sorts, and enriches a list of users.",
      h1: "Transform and rank active users",
    },
    difficulty: 'Easy',
    time: '15 min',
    active: true,
    sourceCode: starterCode,
    testCode: starterTestCode,
    task: "Implement\n<code>transformUsers</code>\nso it returns only active users, ordered by their score from highest to lowest. Each returned user should include a\n<code>rank</code>\nproperty starting at 1.",
    requirement: ['Do not mutate the original <code>users</code> array.', 'Preserve all properties from each user object.', 'Return a new array when no users are active.'],
    hint: (
      <div className="tip">
        <Lightbulb />
        <div>
          <strong>Think about it</strong>
          <p>Which array methods can you chain to keep this readable?</p>
        </div>
      </div>
    ),
    solution: `[
     { name: 'Avery', score: 92, active: true, rank: 1 },
     { name: 'Jordan', score: 87, active: true, rank: 2 },
    ]`,
    testFiles: [
      '__tests__/exercise.test.ts'
    ]
  },
  {
    id: '02',
    title: 'Async data pipeline (cipher/decipher and compression/decompression)',
    description: {
      p: "",
      h1: "",
    },
    difficulty: 'Hard',
    time: '5 min',
    requirement: [],
    solution: ""
  },
  {
    id: '03',
    title: 'Tree traversal',
    difficulty: 'Hard',
    time: '15 min',
    requirement: [],
    solution: ""
  },
  {
    id: '04',
    title: 'Rate limiter',
    difficulty: 'Hard',
    time: '20 min',
    requirement: [],
    solution: ""
  },
  {
    id: '05',
    title: 'Writing a LRU Cache',
    difficulty: 'Expert',
    time: '40 min',
    requirement: [],
    solution: ""
  },
]

const handleProfileSettingClicked = () => { };

const capitalize = (string: string) => string.slice(0, 1).toUpperCase() + string.slice(1)

const renderLanguageSelected = (option: LanguagesOption) => {
  return (
    <>
      <span className={option.badge}>{option.short}</span> {capitalize(option.text)}
    </>
  )
}

const renderCandidate = (candidate: Candidate, clientId: string | null) => {
  return (
    <div className="profile">
      <div className="avatar">{candidate.avatar}<span className="online-dot" /></div>
      <div className="profile-copy"><strong>{candidate.firstName} {candidate.lastName}</strong>
        <span>Candidate · #{candidate.id}</span><hr />
        {clientId && (<span>{clientId}</span>)}
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


const defaultCandidate: Candidate = {
  avatar: "SR",
  firstName: "Sylvain",
  lastName: "Rocca-serra",
  id: 1,
}

const defaultLanguage: LanguagesOption = {
  id: 0,
  text: "javascript",
  checked: true,
  badge: "js-badge",
  short: "JS"
};

const getOutputFilename = (filename: string, extension: string) => {
  return `${filename}.${extension.toLocaleLowerCase()}`;
}


export default function Page() {

  const [line, setLine] = useState(0);
  const [column, setColumn] = useState(0);
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [clientId, setClientId] = useState<string | null>(null)
  const [focusedPane, setFocusedPane] = useState<string | null>(null);
  const [draggedPane, setDraggedPane] = useState<string | null>(null);
  const [tests, setTests] = useState<Test[]>([{ name: "test", status: "PASSED", durationMs: 654 }, { name: "test2", status: "FAILED", durationMs: 654 }]);
  const [summary, setSummary] = useState<Counts>();
  const [candidate, setCandidate] = useState<Candidate>(defaultCandidate);
  const [activeExercise, setActiveExercise] = useState<Exercise>(exercises[0]);
  const [code, setCode] = useState(starterCode);
  const [testCode, setTestCode] = useState(starterTestCode);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<'idle' | 'passed' | 'failed'>('idle');
  const [remainingSeconds, setRemainingSeconds] = useState(1 * 60 * 42 + 18);
  const [language, setLanguage] = useState<LanguagesOption>(defaultLanguage);

  const [resultView, setResultView] = useState<'preview' | 'console'>('preview');
  const [paneOrder, setPaneOrder] = useState(['directions', 'result', 'editor', 'tests']);

  const monaco = useMonaco();
  const hostname = process.env.HOSTNAME || "localhost:3001";
  const authToken = process.env.AUTH_TOKEN || "secret";

  // const [editor, setEditor] = useState<EditorApp | null>(null)

  // editorApp = await runTsWrapper();

  // TODO : make typesafe


  useEffect(() => {
    if (monaco) {
      console.log('here is the monaco instance:', monaco);

      const { editor } = monaco;
      if (editor) {
        const [codeEditor, ...editors] = editor.getEditors();

        codeEditor.onDidChangeCursorPosition((e) => {
          const { lineNumber, column } = e.position;
          setLine(lineNumber);
          setColumn(column);
        });
      }
    }

    // CodingMonaco.editor.setTheme("dark");

  }, [monaco]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {

    const websocketOptions = {
      forceNew: true,
      transports: ["websocket"],
      reconnectionDelayMax: 10000,
    }

    const manager = new Manager("ws://" + hostname, websocketOptions);

    const socket = manager.socket("/", {
      auth: {
        token: "secret"
      }
    });

    // client-side
    socket.on("connect", () => {

      setSocket(socket);
      setClientId(socket.id as string);

      const engine = socket.io.engine;
      console.log("[socket.io]", engine.transport.name);

      engine.once("upgrade", () => {
        console.log("[socket.io]", engine.transport.name);
      });

    });


    socket.on("runner:result", (result) => {
      console.log("result ", result);
      setTests(result.result);
    });

    socket.on("runner:test:summary", (msg) => {
      const { data: { pass, fail }, duration_ms, success } = msg.event;
      setSummary({ pass, fail, durationMs: duration_ms, success });
      console.log("event ", msg.event, tests);
    });


    return () => {
      socket.disconnect();
    }
  }, [])


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

    setIsRunning(true)

    if (!socket) {
      // TODO : proper error handling / display
      alert("Websocket offline cannot run code");
      return;
    }

    debugger

    socket.emit("runner:request", { code, testCode, clientId: socket.id });
    setIsRunning(false);
  }

  const handleResetClicked = () => {
    alert("TODO: implement reset")
  };


  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Code2 />
          </div>
          <div>
            <strong>codebench</strong>
            <span>assessment studio</span>
          </div>
        </div>
        {renderCandidate(candidate, clientId)}
        <div className="exercise-heading">
          <span>EXERCISES</span>
          <span className="count">{exercises.length}</span>
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
            <Button className="run-button" onClick={handleRunTest} disabled={isRunning}>
              <Play /> {isRunning ? 'Running…' : 'Run tests'}<kbd>⌘ ↵</kbd>
            </Button>
          </div>
        </header>
        <div className="workspace-grid">
          <section
            style={{ order: paneOrder.indexOf('directions') }}
            className="pane directions-pane"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => movePane('directions')}
          >
            <PaneHeader
              paneId="directions"
              onDragStart={setDraggedPane}
              icon={<FileCode2 />}
              label="Directions"
              meta="TODO.md"
              action={<button className="more-button" aria-label="Directions options">•••</button>}
            />
            <div className="pane-scroll">
              <div className="eyebrow">{activeExercise.title}</div>
              <h1>{activeExercise.description?.h1}</h1>
              <p className="intro">{activeExercise.description?.p}</p>
              <div className="section-block">
                <h2>Task</h2>
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
          <section
            className="pane result-pane"
            style={{ order: paneOrder.indexOf('result') }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => movePane('result')}>
            <PaneHeader
              paneId="result"
              onDragStart={setDraggedPane}
              icon={resultView === 'preview' ? <FlaskConical /> : <Terminal />}
              label={resultView === 'preview' ? "Result" : "Terminal"}
              meta={resultView === 'preview' ? 'Test Result' : 'stdout / stderr'}
              action={
                <span className="live-dot"><i /> Live</span>
              }
            />
            <div className="result-tabs" role="tablist" aria-label="Result views">
              <button
                role="tab"
                aria-selected={resultView === 'preview'}
                className={resultView === 'preview' ? 'active' : ''}
                onClick={() => setResultView('preview')}
              >
                Test Result
              </button>
              <button
                role="tab"
                aria-selected={resultView === 'console'}
                className={resultView === 'console' ? 'active' : ''}
                onClick={() => setResultView('console')}
              >
                Console
              </button>
            </div>
            {resultView === "preview" ? <div className="result-content">
              {tests.map((test, i) => {
                const isSuccess = test.status === "PASSED";
                return (
                  <TestResult
                    key={test.name + i}
                    variant={isSuccess ? "default" : "destructive"}
                    type={isSuccess ? "success" : "failure"}
                    title={test.name}
                    description={`Durée : ${test.durationMs} ms`}
                  />
                );
              })}
            </div> : (<></>)}
            <div className="resize-corner" />
          </section>

          <section
            style={{ order: paneOrder.indexOf('editor') }}
            className="pane editor-pane"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => movePane('editor')}
            onFocus={() => setFocusedPane('editor')}>
            <PaneHeader
              paneId="editor"
              onDragStart={setDraggedPane}
              icon={<Terminal />}
              label="Code editor"
              meta={`solution.${language.short.toLocaleLowerCase()}`}
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
                    <DropdownMenuContent className="dropdown">
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
                language={language.text}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value ?? '')}
                options={{
                  minimap: {
                    enabled: false
                  },
                  fontSize: 16,
                  lineHeight: 21,
                  padding: { top: 18 },
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  renderLineHighlight: 'line',
                  overviewRulerBorder: false,
                  fontFamily: "'JetBrains Mono', 'SFMono-Regular', 'Lucinda console', Consolas, monospace"
                }}
              />
            </div>
            <div className="editor-status">
              <span>Ln {line}, Col {column}</span><span>Spaces: 2</span>
              <span>UTF-8</span><span>{language.text}</span>
            </div>
            <div className="resize-corner" />
          </section>
          <section style={{ order: paneOrder.indexOf('tests') }} className="pane tests-pane" onDragOver={(event) => event.preventDefault()} onDrop={() => movePane('tests')} onClick={() => setFocusedPane('tests')}>
            <PaneHeader
              paneId="tests"
              onDragStart={setDraggedPane}
              icon={<FlaskConical />}
              label="Test results"
              meta="6 cases"
              action={<Button className="run-button" onClick={handleRunTest}><Play /> {isRunning ? 'Running…' : 'Run tests'}</Button>}
            />
            <Editor
              height="100%"
              language={language.text}
              theme="vs-dark"
              value={testCode}
              onChange={(value) => setTestCode(value ?? '')}
              options={{
                minimap: {
                  enabled: false
                },
                letterSpacing: 0,
                fontWeight: "bold",
                fontSize: 16,
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
          {/*           <span>Autosaved just now
            <span className="save-dot" />
          </span> */}
        </footer>
      </section >
    </main >
  )
}
