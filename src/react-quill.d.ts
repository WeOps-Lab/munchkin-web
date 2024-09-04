/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-quill' {
    import { Component } from 'react';
  
    interface QuillOptions {
      debug?: 'warn' | 'log' | 'error' | false;
      modules?: Record<string, any>;
      placeholder?: string;
      readOnly?: boolean;
      theme?: string;
      formats?: string[];
    }
  
    interface ReactQuillProps {
      id?: string;
      className?: string;
      value?: string;
      defaultValue?: string;
      readOnly?: boolean;
      theme?: string;
      placeholder?: string;
      bounds?: string | HTMLElement;
      onChange?: (content: string, delta: any, source: string, editor: any) => void;
      onChangeSelection?: (range: any, source: string, editor: any) => void;
      onFocus?: (range: any, source: string, editor: any) => void;
      onBlur?: (previousRange: any, source: string, editor: any) => void;
      modules?: QuillOptions['modules'];
      formats?: string[];
      children?: React.ReactNode;
    }
  
    class ReactQuill extends Component<ReactQuillProps> {}
    export = ReactQuill;
  }  