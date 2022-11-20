import React from 'react';
import './Library.css'
import Toolbar from './Toolbar'

function Library(props) {

    function handleClick(evt, chapter){
        evt.preventDefault();
        props.onOpen(chapter)
    }

    return (
        <div>
            <Toolbar title="Files" onAction={props.onClose} />
            <ul className='cbz-list'>
                {props.chapters.map((chapter) => (
                    <li className="cbz-list-item" key={chapter.name}>
                        <button className="cbz-link"
                            onClick={(event) => handleClick(event, chapter)}
                        >{chapter.name}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Library;