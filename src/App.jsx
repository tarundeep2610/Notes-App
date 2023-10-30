import { useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import Editor from "./Editor"
import Split from "react-split"
import './style.css';
import { onSnapshot , addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { notesCollection ,db } from "./firebase"

export default function App() {

    //here in this notes state i used a arrow fn to initialize the state. i did so because whenever there is a state change the component re-renders running the state initialization code again and again making the notes fetch from the local storage that is a bit expensive call so to avoid that i used the arrow fn. we can use a normal or a callback fn all will work fine. and this thing is called as lazy state loading

    const [notes, setNotes] = useState( () => JSON.parse(localStorage.getItem('notes')) || [])
    const [currentNoteId, setCurrentNoteId] = useState("")
    const [tempNoteText, setTempNoteText] = useState("")

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];

    const sortedNotes= notes.sort((a,b)=> b.updatedAt - a.updatedAt);

    useEffect(()=>{
        const unSubscribe= onSnapshot(notesCollection, function(snapshot){
            //Sync up our local notes array with the snapshot data
            const newNotes= snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            
            setNotes(newNotes);
        })

        return unSubscribe;
    },[]);

    useEffect(()=>{
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id);
        }
    } ,[notes]
    );

    useEffect(()=>{
        if(currentNote){
            setTempNoteText(currentNote.body);
        }
    },[currentNote]);

    useEffect(() => {
        const timeoutId= setTimeout( () => {
            if(tempNoteText!=currentNote.body){
                updateNote(tempNoteText);
            }
        },500)

        return () => clearTimeout(timeoutId);
    },[tempNoteText]);
    
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
         const newNoteRef= await addDoc(notesCollection,newNote);
        setCurrentNoteId(newNoteRef.id)
    }
    
    async function updateNote(text) {

        //this code uses firebase for updating notes
        const docRef= doc(db,'notes',currentNoteId);
        await setDoc(docRef, {
            body : text , 
            updatedAt: Date.now()},
            {merge: true}
            );

        //this code rearranges notes and puts the most recently updated one at the top

        // setNotes(oldNotes => {
        //     const newNotes= [];
        //     for(let i=0;i<oldNotes.length;i++){
        //         let oldNote= oldNotes[i];

        //         if(oldNote.id===currentNoteId){
        //             newNotes.unshift({ ...oldNote, body: text })
        //         }
        //         else{
        //             newNotes.push(oldNote)
        //         }
        //     }

        //     return newNotes;
        // })

        //this was the previous code it updates the notes but don't rearranges them after updation

        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     return oldNote.id === currentNoteId
        //         ? { ...oldNote, body: text }
        //         : oldNote
        // }))
    }

    async function deleteNote(noteId){
        const docRef= doc(db,'notes',noteId);
        await deleteDoc(docRef);
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={sortedNotes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                <Editor 
                    tempNoteText={tempNoteText} 
                    setTempNoteText={setTempNoteText} 
                />
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
