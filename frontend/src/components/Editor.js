import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import CodeMirror from '@uiw/react-codemirror';
import {
  EditorView,
  Decoration,
  WidgetType,
} from "@codemirror/view";

import {
  StateEffect,
  StateField,
} from "@codemirror/state";

import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { sql } from '@codemirror/lang-sql';
import { go } from '@codemirror/lang-go';
import { rust } from '@codemirror/lang-rust';

import { dracula } from '@uiw/codemirror-theme-dracula';

import ACTIONS from '../constants/Actions';

class RemoteCursorWidget extends WidgetType {

  constructor(username, color) {
    super();

    this.username = username;
    this.color = color;
  }

  toDOM() {

    const container = document.createElement("span");

    container.className = "remote-cursor-container";

    const cursor = document.createElement("span");

    cursor.className = "remote-cursor";

    cursor.style.backgroundColor = this.color;

    const label = document.createElement("span");

    label.className = "remote-cursor-label";
    label.textContent = this.username;
    label.style.backgroundColor = this.color;

    container.appendChild(cursor);
    container.appendChild(label);

    return container;
  }

  ignoreEvent() {
    return true;
  }
}

const updateRemoteCursor = StateEffect.define();

const remoteCursorField = StateField.define({

  create() {
    return Decoration.none;
  },

  update(decorations, transaction) {

    decorations = decorations.map(
      transaction.changes
    );

    for (const effect of transaction.effects) {

      if (effect.is(updateRemoteCursor)) {

        const {
          position,
          username,
          color,
        } = effect.value;

        decorations = Decoration.set([
          Decoration.widget({
            widget: new RemoteCursorWidget(
              username, 
              color
            ),
            side: 1,
          }).range(position),
        ]);

      }
    }

    return decorations;
  },

  provide: field =>
    EditorView.decorations.from(field),

});

const CURSOR_COLORS = [
  "#00ff88",
  "#a78bfa",
  "#38bdf8",
  "#fb7185",
  "#facc15",
  "#fb923c",
  "#2dd4bf",
  "#e879f9",
];

const getCursorColor = (socketId) => {

  if (!socketId) {
    return CURSOR_COLORS[0];
  }

  let hash = 0;

  for (let i = 0; i < socketId.length; i++) {
    hash =
      socketId.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  const index =
    Math.abs(hash) % CURSOR_COLORS.length;

  return CURSOR_COLORS[index];
};
const Editor = ({ socket, roomId, onCodeChange, onLanguageChange, onRoomNameChange }) => {


  const editorRef = useRef(null);
  const socketRef = useRef(null);

  const [code, setCode] = useState('');

  const [language, setLanguage] = useState('javascript');
  const languageExtensions = {
    javascript: javascript(),
    python: python(),
    java: java(),
    cpp: cpp(),
    html: html(),
    css: css(),
    sql: sql(),
    go: go(),
    rust: rust(),
  };
  const cursorUpdateListener = useMemo(() =>

    EditorView.updateListener.of((update) => {

      if (!update.selectionSet) {
        return;
      }

      const position =
        update.state.selection.main.head;

      const line =
        update.state.doc.lineAt(position).number;

      const lineStart =
        update.state.doc.lineAt(position).from;

      const column =
        position - lineStart;

      console.log("📍 Cursor Position:", {
        line,
        column,
      });

      const currentSocket = socketRef.current;

      if (!currentSocket) {
        console.log("❌ Socket not available for cursor update");
        return;
      }

      console.log("🚀 Sending CURSOR_MOVE:", {
        roomId,
        line,
        column,
      });

      currentSocket.emit(
        ACTIONS.CURSOR_MOVE,
        {
          roomId,
          line,
          column,
        }
      );

    }),
    [roomId]
  );

  const handleChange = (value) => {

    onCodeChange(value);
    setCode(value);

    if (!socket) return;

    socket.emit(
      ACTIONS.CODE_CHANGE,
      {
        roomId,
        code: value,
      }
    );
  };

  console.log("Editor Rendered");

  useEffect(() => {
    console.log("Editor useEffect executed");


    console.log("Registering listeners");
    socketRef.current = socket;

    if (!socket) return;

    const handleCodeChange = ({ code }) => {
      if (code !== null) {
        setCode(code);

        if (onCodeChange) {
          onCodeChange(code);
        }
      }
    };

    const handleLanguageChange = ({ language }) => {
      console.log("Language event received:", language);
      setLanguage(language);
      if (onLanguageChange) {
        onLanguageChange(language);
      }
    };

    socket.on(
      ACTIONS.CODE_CHANGE,
      handleCodeChange
    );

    socket.on(
      ACTIONS.LANGUAGE_CHANGE,
      handleLanguageChange
    );

    const handleRemoteCursor = ({
      socketId,
      username,
      line,
      column,
    }) => {

      console.log("📍 Remote Cursor:", {
        socketId,
        username,
        line,
        column,
      });

      const view = editorRef.current;

      if (!view) {
        console.log(
          "❌ Editor view not available"
        );
        return;
      }

      const lineInfo = view.state.doc.line(
        Math.min(
          line,
          view.state.doc.lines
        )
      );

      const position = Math.min(
        lineInfo.from + column,
        lineInfo.to
      );
      const color = getCursorColor(socketId);
      view.dispatch({
        effects: updateRemoteCursor.of({
          position,
          username,
          color,
        }),
      });

    };

    socket.on(
      ACTIONS.CURSOR_MOVE,
      handleRemoteCursor
    );

    socket.on(
      ACTIONS.SYNC_CODE,
      ({ code, language, roomName }) => {
        console.log("SYNC_CODE Room Name:", roomName);
        if (code !== null) {
          setCode(code);

          if (onCodeChange) {
            onCodeChange(code);
          }
        }

        if (language) {
          setLanguage(language);

          if (onLanguageChange) {
            onLanguageChange(language);
          }
        }

        if (roomName && onRoomNameChange) {
          onRoomNameChange(roomName);
        }

      }
    );

    return () => {

      socket.off(
        ACTIONS.CODE_CHANGE,
        handleCodeChange
      );

      socket.off(
        ACTIONS.LANGUAGE_CHANGE,
        handleLanguageChange
      );

      socket.off(ACTIONS.SYNC_CODE);

      socket.off(
        ACTIONS.CURSOR_MOVE,
        handleRemoteCursor
      );

    };

  }, [socket, onLanguageChange]);

  return (
    <>
      <select
        value={language}
        onChange={(e) => {

          const selectedLanguage = e.target.value;

          console.log("Sending Room ID:", roomId);
          console.log("Sending Language:", selectedLanguage);

          setLanguage(selectedLanguage);

          if (onLanguageChange) {
            onLanguageChange(selectedLanguage);
          }

          if (!socket) return;

          socket.emit(
            ACTIONS.LANGUAGE_CHANGE,
            {
              roomId,
              language: selectedLanguage,
            }
          );

        }}
        className="language-selector"
      >

        <option value="javascript">
          JavaScript
        </option>

        <option value="python">
          Python
        </option>

        <option value="java">
          Java
        </option>

        <option value="cpp">
          C/C++
        </option>

        <option value="html">
          HTML
        </option>

        <option value="css">
          CSS
        </option>

        <option value="sql">
          SQL
        </option>

        <option value="go">
          Go
        </option>

        <option value="rust">
          Rust
        </option>

      </select>

      <CodeMirror
        value={code}
        height="100vh"
        theme={dracula}
        key={language}
        extensions={[
          languageExtensions[language],
          cursorUpdateListener,
          remoteCursorField,
        ]}

        onCreateEditor={(view) => {
          console.log("✅ Editor view created");
          editorRef.current = view;
        }}

        onChange={(value, viewUpdate) => {

          handleChange(value);

        }}
      />
    </>

  );
};

export default Editor;