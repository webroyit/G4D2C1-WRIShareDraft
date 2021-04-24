import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const SAVE_INTERVAL_MS = 3000;
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
    const {id: documentId} = useParams();
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

    //  Track the changes on text editor
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
        
        quill.on("text-change", handler);

        // Remove the event listeners when it is not being used
        return () => {
            quill.off("text-change", handler);
        }
    }, [socket, quill])

    //  Get the changes on text editor
    useEffect(() => {
        // quill and socket are undefined at the start
        if (socket == null || quill == null) return;
        
        const handler = (delta) => {
            quill.updateContents(delta);
        }
        
        socket.on("receive-changes", handler);

        // Remove the event listeners when it is not being used
        return () => {
            quill.off("receive-changes", handler);
        }
    }, [socket, quill])

    useEffect(() => {
        if(socket == null || quill == null) return;

        // Listen for an event once and then clean up
        socket.once("load-document", document => {
            // Load the data on text editor
            quill.setContents(document);

            // Enable the text editor when it is finish loading
            quill.enable();
        })

        socket.emit("get-document", documentId);
    }, [socket, quill, documentId])

    useEffect(() => {
        if(socket == null || quill == null) return;

        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents());
        }, SAVE_INTERVAL_MS);

        // Clear the interval
        return () => {
            clearInterval(interval);
        }
    }, [socket, quill])

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;

        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
        q.disable();
        q.setText('Loading...');

        setQuill(q);
    }, [])

    return <div className="container" ref={wrapperRef}></div>;
}

export default TextEditor;
