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
import {sql} from '@codemirror/lang-sql';
import { go } from '@codemirror/lang-go';
import { rust } from '@codemirror/lang-rust';

import { dracula } from '@uiw/codemirror-theme-dracula';

import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {

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

    if (!socketRef.current) return;

    socketRef.current.emit(
      ACTIONS.CODE_CHANGE,
      {
        roomId,
        code: value,
      }
    );
  };

  useEffect(() => {

    if (!socketRef.current) return;

    const handleCodeChange = ({ code }) => {

      if (code !== null) {

        setCode(code);

      }

    };

    socketRef.current.on(
      ACTIONS.CODE_CHANGE,
      handleCodeChange
    );

    socketRef.current.on(
      ACTIONS.SYNC_CODE,
      ({ code }) => {
        setCode(code);
      }
    );

    return () => {

      socketRef.current.off(
        ACTIONS.CODE_CHANGE,
        handleCodeChange
      );

      socketRef.current.off(ACTIONS.SYNC_CODE);
    };
    

  }, [socketRef.current]);

  return (
    <>
      <select
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value)
        }
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