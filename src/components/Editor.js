import {React, useRef, useState} from 'react';
import CodeMirror from '@uiw/react-codemirror';

import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { markdown } from '@codemirror/lang-markdown';
import { json } from '@codemirror/lang-json';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { sql } from '@codemirror/lang-sql';

import { dracula } from '@uiw/codemirror-theme-dracula';
import { keymap } from '@codemirror/view';

import {
  closeBrackets,
  closeBracketsKeymap
} from '@codemirror/autocomplete';


  const Editor = () => {

    const editorRef = useRef(null);

    const languageExtensions = {
    javascript: javascript(),
    html: html(),
    css: css(),
    python: python(),
    java: java(),
    cpp: cpp(),
    markdown: markdown(),
    json: json(),
    rust: rust(),
    go: go(),
    sql: sql()
  };
  const [language, setLanguage] = useState("javascript");
  return (
    <CodeMirror
      value="// Start coding..."
      height="100%"
      theme={dracula}
      extensions={[
      languageExtensions[language],
      closeBrackets(),
      keymap.of(closeBracketsKeymap)
      ]}
    
    />
  );
};

export default Editor;