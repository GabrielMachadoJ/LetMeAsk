import { useNavigate, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { db, ref, update, remove } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useNavigate()
    const params = useParams<RoomParams>();
    const roomId = params.id;
    
    const { title, question } = useRoom(roomId!)

    function handleEndRoom() {
        const roomRef = ref(db, `rooms/${roomId}`)
        update(roomRef, {
            endedAt: new Date()
        })

        history('/')
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            const questionRef = await remove(ref(db, `rooms/${roomId}/questions/${questionId}`))
        }
    }
    
    return (
        
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId as string}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main className='content'>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    { question.length > 0 && <span>{question.length} pergunta(s)</span>}
                </div>
                <div className="question-list">
                    {question.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })} 
                </div>                
            </main>
        </div>
    );
}