import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'


import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';
import { db, ref, onValue } from '../services/firebase'


import '../styles/auth.scss'

export function Home() {
    const history = useNavigate()
    const { user, signInWithGoogle} = useAuth()
    const [roomCode, setRoomCode] = useState('')

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }
        history('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if (roomCode.trim() === '') {
            return
        }

        const roomRef = ref(db, `rooms/${roomCode}`)

        onValue(roomRef, (snapshot) => {
            const data = snapshot.exists();
            if (!data) {
                alert('Room does not exist.')
                return
            }

            if (snapshot.val().endedAt) {
                alert('Room already closed')
                return
            }
            history(`/rooms/${roomCode}`)
          })

    }

    return (
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className='separator'> ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom} action="">
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}