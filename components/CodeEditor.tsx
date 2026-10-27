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
import PaneHeader from './PaneHeader'

import { Manager } from "socket.io-client";
import type { Socket } from "socket.io-client";

export type LanguagesOption = {
  id: number, text: "javascript" | "typescript",
  checked: boolean,
  badge: "js-badge" | "ts-badge",
  short: "JS" | "TS"
};

const defaultLanguage: LanguagesOption = {
  id: 0,
  text: "javascript",
  checked: true,
  badge: "js-badge",
  short: "JS"
};

const starterCode = `
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

const starterTestCode = `
describe("testing filtering function", () => {
  it('returns ranked active users', (t) => {
    t.assert.deepEqual(transformUsers(users), [
      { name: 'Avery', score: 92, active: true, rank: 1 },
      { name: 'Jordan', score: 87, active: true, rank: 2 },
    ])
  })
})

describe("a failing test", () => {
  it('should fail to return ranked active users', (t) => {
    t.assert.deepEqual(transformUsers(users), [
      { name: 'Avery', score: 99, active: true, rank: 2 },
      { name: 'Jordan', score: 87, active: true, rank: 3 },
    ])
  })
})
`

const capitalize = (string: string) => string.slice(0, 1).toUpperCase() + string.slice(1)

const renderLanguageSelected = (option: LanguagesOption) => {
  return (
    <>
      <span className={option.badge}>{option.short}</span> {capitalize(option.text)}
    </>
  )
}

type CodeEditorProps = {
  language: LanguagesOption,
  paneOrder: string[],
  movePane: (target: string) => void,
  setFocusedPane: (target: string) => void,
  setDraggedPane: () => void,
  setLanguage: (language: LanguagesOption) => void
};

const CodeEditor = ({ paneOrder, movePane, setFocusedPane, setDraggedPane, language, setLanguage }: CodeEditorProps) => {

  const monaco = useMonaco();

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
  }, [monaco]);

  const [line, setLine] = useState(0);
  const [column, setColumn] = useState(0);
  const [code, setCode] = useState(starterCode);

  return (
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
          language={language.text}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? '')}
          options={{
            minimap: {
              enabled: true
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
  )
}

export default CodeEditor;