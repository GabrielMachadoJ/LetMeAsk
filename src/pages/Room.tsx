import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { db, ref, push, onValue } from '../services/firebase'

import '../styles/room.scss'

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string,
    }
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}>

type Question = {
    id: string,
    author: {
        name: string,
        avatar: string,
    }
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth()
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('')
    const [question, setQuestion] = useState<Question[]>([])
    const [title, setTitle] = useState('')

    const roomId = params.id;

    useEffect(() => {
        return onValue(ref(db, `rooms/${roomId}`), (room) => {
            const value = room.val()
            const firebaseQuestions: FirebaseQuestions = value.questions  ?? {}

            const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            })
            
            setTitle(value.title)
            setQuestion(parsedQuestion)
        }, {
            onlyOnce: false,
        })
    }, [roomId])

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault()

        if (newQuestion.trim() === '') {
            return
        }

        if(!user) {
          throw new Error('You must be logged in')  
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        }

        const roomRef = ref(db, `rooms/${roomId}/questions`)
        push(roomRef, question)

        setNewQuestion('')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId as string}/>
                </div>
            </header>

            <main className='content'>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    { question.length > 0 && <span>{question.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder='O que você quer perguntar?' 
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />  
                    <div className='form-footer'>
                        { user ? (
                            <div className='user-info'>
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        <Button type='submit' disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(question)}
            </main>
        </div>
    );
}