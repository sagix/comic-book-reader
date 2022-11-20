import './App.css';
import React, { useState, useEffect } from 'react';
import Form from './Form';
import Library from './Library';
import Reader from './Reader';

function App() {

  const [chapters, setChapters] = useState([]);
  const [chapter, setChapter] = useState(null);
  const [next, setNext] = useState(null);

  useEffect(() => {
    if (chapter === null) {
      setNext(null);
    } else {
      const nextIndex = chapters.indexOf(chapter) + 1;
      if (nextIndex < chapters.length) {
        setNext(chapters[nextIndex]);
      } else {
        setNext(null);
      }
    }
  }, [chapter, chapters]);

  return (
    <div className="App">
      {
        chapters.length === 0 ?
          (<Form onLoad={setChapters} />)
          : chapter === null ?
            (<Library chapters={chapters}
              onOpen={setChapter}
              onClose={() => setChapters([])}
            />)
            : (<Reader
              name={chapter.name}
              next={next}
              files={chapter.files}
              onNext={setChapter}
              onClose={() => setChapter(null)}
            />)
      }

    </div>
  );
}

export default App;
