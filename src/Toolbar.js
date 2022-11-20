import "./Toolbar.css"

function Form(props) {

    function handleAction(evt) {
        evt.preventDefault();
        props.onAction();
    }

    return (
        <header className="toolbar">
            <button className="toolbar-action" 
            onClick={handleAction}
            aria-label="Close" >✕</button>
            <h1>{props.title}</h1>
        </header>
    );
}

export default Form;