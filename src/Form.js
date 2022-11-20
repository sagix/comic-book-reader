import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';
import './Form.css'
import bookIcon from './svg/book.svg';
import libraryIcon from './svg/library_books.svg';

function Form(props) {

    const [drag, setDrag] = useState(false)
    const [libraryFlag, setLibraryFlag] = useState(false)

    useEffect(() => {
        setLibraryFlag(window.showDirectoryPicker !== undefined && window.isSecureContext)
    }, []);

    function onFiles(files) {
        const regex = /(\d+)(?!.*\d)/
        // Closure to capture the file information.
        function handleFile(f) {
            return JSZip.loadAsync(f)
                .then((zip) => {
                    let result = []
                    zip.forEach(function (relativePath, file) {
                        result.push(file)
                    });
                    return result;
                }, (e) => console.error(e))
                .then((files) => {
                    const match = f.name.match(regex);
                    let compare;
                    if (match.length === 2) {
                        compare = parseInt(match[1]);
                    } else {
                        compare = f.name
                    }
                    return {
                        name: f.name,
                        compare: compare,
                        files: files
                    }
                }
                );
        }
        Promise.all(files.filter((f) => {
            if( f.mimetype === 'application/zip' ) {
                return true;
            } else {
                const regex = /.*(.zip|.cbz)$/
                return f.name.match(regex);
            }
        }).map(handleFile))
            .then((result) => {
                result.sort((a, b) => {
                    if (isNaN(a) && isNaN(b)) {
                        return a.compare - b.compare;
                    } else {
                        return a.compare.localeCompare(b.compare);
                    }
                });
                return result;
            })
            .then((result) => props.onLoad(result));
    }

    function handleChange(evt) {
        onFiles([...evt.target.files])
    };

    function drop(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        onFiles([...evt.dataTransfer.files]);
    }

    function dragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'link';
        setDrag(true)
    }

    function dragLeave(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'none';
        setDrag(false)
    }

    async function handleLibrary(evt) {
        evt.preventDefault();
        const dirHandle = await window.showDirectoryPicker();
        const promises = [];
        for await (const fileHandle of dirHandle.values()) {
            if (fileHandle.kind !== 'file') {
                continue;
            }
            promises.push(fileHandle.getFile());
        }
        Promise.all(promises).then(onFiles);
    }


    return (
        <div>
            <header>
                <h1>Comic book <strong>Reader</strong></h1>
            </header>
            <div className='form-container'>
                <form className={'form-files ' + (drag ? "drag" : "")}
                    onDrop={drop}
                    onDragOver={dragOver}
                    onDragLeave={dragLeave}>
                    <input type="file" id="files" name="files"
                        onChange={handleChange}
                        multiple="multiple" />
                    <label className='button-image' htmlFor="files" >
                        <img src={bookIcon} alt=""/>
                        <span>Open *.cbz files</span>
                    </label>
                </form>
                <form className={'form-library' + (libraryFlag ? "" : " disabled")}>
                    <button
                        className='button-image'
                        disabled={(libraryFlag ? "" : "disabled")}
                        onClick={handleLibrary}
                    >
                        <img src={libraryIcon} alt=""/>
                        <span>Open library</span>
                        <span className='disabled-message'>Not supported</span>
                    </button>
                </form>
            </div>
        </div>
    );
}


export default Form;