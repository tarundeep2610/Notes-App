import ReactMde from "react-mde"
import 'react-mde/lib/styles/css/react-mde-all.css';
import Showdown from "showdown"
import { useState } from "react"

// react-mde dependency was not getting installed beacause my version of react does not support react-mde thus to 
// solve this problem i did this - react-mde does not support react 18 yet. To to use react-mde in
// react 18 use below command.
// npm i react-mde --legacy-peer-deps
// To use react-mde with its properties and its css styling import following:
// import ReactMde from "react-mde";
// import 'react-mde/lib/styles/css/react-mde-all.css';

export default function Editor({ tempNoteText, setTempNoteText }) {
    const [selectedTab, setSelectedTab] = useState("write")

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    })  

    return (
        <section className="pane editor">
            <ReactMde
                value={tempNoteText}
                onChange={setTempNoteText}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                }
                minEditorHeight={80}
                heightUnits="vh"
            />
        </section>
    )
}
