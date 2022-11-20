import { useEffect, useState } from "react";
import './Reader.css'
import Toolbar from './Toolbar'

function Reader(props) {

    const [files, setFiles] = useState([]);

    useEffect(() => {
        async function load() {
            setFiles((prev) => ([]));
            for (const f of props.files) {
                const base64 = await f.async("base64").then((base64) => {
                    return "data:image/jpg;base64," + base64;
                });
                const item = {
                    file: f,
                    base64: base64
                };
                setFiles((prev) => {
                    if (prev.find((i) => i.file.name === item.file.name) !== undefined) {
                        return prev;
                    } else {
                        return [...prev, item];
                    }
                });
            }
        }
        load();
    }, [props.files]);

    function handleNext(evt) {
        evt.preventDefault();
        props.onNext(props.next);
    }

    return (
        <div>
            <Toolbar title={props.name} onAction={props.onClose} />
            <ul>
                {files.map((entry) => (<li key={entry.file.name}><img
                    src={entry.base64}
                    alt={entry.file.name}
                /></li>))}
            </ul>
            {
                props.next === null ?
                    (<span className="reader-end">The End (no more files)</span>)
                    : (<button className="reader-next-button" onClick={handleNext}>Read next: {props.next?.name}</button>)
            }
        </div>
    );
}

export default Reader;