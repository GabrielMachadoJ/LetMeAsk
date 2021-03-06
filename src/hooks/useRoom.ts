import { useEffect, useState } from "react"
import { db, ref, push, onValue } from '../services/firebase'
import { useAuth } from "./useAuth"

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
    likes: Record<string, {
        authorId: string,
    }>
}>

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likeCount: number,
    likeId: string | undefined,
}

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [question, setQuestion] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomRef = ref(db, `rooms/${roomId}`)    

            const turnOff = onValue(roomRef, room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions  ?? {}

            const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            })
            
            setTitle(databaseRoom.title)
            setQuestion(parsedQuestion)
            
        }, {
            onlyOnce: false, 
        })
        
        return () => {
            turnOff()
        }
    }, [roomId, user?.id])

    return { question, title }

}