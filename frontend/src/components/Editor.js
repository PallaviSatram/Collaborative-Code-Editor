import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import CodeMirror from '@uiw/react-codemirror';

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

const Editor = ({ socket, roomId, onCodeChange, onLanguageChange, onRoomNameChange }) => {

  const editorRef = useRef(null);

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

    if (!socket) return;

    const handleCodeChange = ({ code }) => {
      if (code !== null) {
        setCode(code);
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

    socket.on(
      ACTIONS.SYNC_CODE,
      ({ code, language, roomName }) => {
        console.log("SYNC_CODE Room Name:", roomName);
        if (code !== null) {
          setCode(code);
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
          languageExtensions[language]
        ]}

        onChange={(value, viewUpdate) => {

          editorRef.current = viewUpdate.view;

          handleChange(value);

        }}
      />
    </>

  );
};

export default Editor;