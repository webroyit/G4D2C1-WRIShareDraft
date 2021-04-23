import React, { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super"}],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"]
]

function TextEditor() {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();

    useEffect(() => {
        // Connect to websocket from the server
        const s = io("http://localhost:3001");
        setSocket(s);

        return () => {
            // Disconnect the wesocket from the server
            s.disconnect();
        }
    }, [])

    useEffect(() => {
        // quill and socket are undefined at the start
        if (socket == null || quill == null) return;
        
        const handler = (delta, oldDelta, source) => {
            // Prevent tracking of changes from the server
            if (source !== 'user') return;

            // Send the changes to the server
            // delta is the changes made in the document
            socket.emit("send-changes", delta);
        }
        
        quill.on("text-change", handler)

        // Remove the event listeners when it is not being used
        return () => {
            quill.off("text-change", handler);
        }
    }, [socket, quill])

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;

        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
        setQuill(q);
    }, [])

    return <div className="container" ref={wrapperRef}></div>;
}

export default TextEditor;
