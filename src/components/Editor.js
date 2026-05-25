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

const Editor = ({ socketRef, roomId }) => {

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

    return () => {

      socketRef.current.off(
        ACTIONS.CODE_CHANGE,
        handleCodeChange
      );

    };

  }, [socketRef.current]);

  return (
    <CodeMirror
      value={code}
      height="100vh"
      theme={dracula}
      extensions={[javascript()]}

      onChange={(value, viewUpdate) => {

        editorRef.current = viewUpdate.view;

        handleChange(value);

      }}
    />
  );
};

export default Editor;