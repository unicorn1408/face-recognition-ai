import { useState } from 'react'
import Navigation from '../components/Navigation/Navigation'
import Logo from '../components/Logo/Logo'
import Rank from '../components/Rank/Rank'
import ImageForm from '../components/ImageForm/ImageForm'
import FaceRecognition from '../components/FaceRecognition/FaceRecognition'
import { useUser, useUserDispatch } from '../AuthContext';

import { toast } from 'react-toastify';
import apiService from '../api'

const Home = () => {
    const [input, setInput] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [box, setBox] = useState({})

    const user = useUser()
    const dispatch = useUserDispatch()


    // handles input change
    const onInputChange = (e) => {
        setInput(e.target.value)
    }

    // stores face coordinates to state
    const detectFace = (newBox) => {
        setBox({
            ...box, ...newBox
        })
    }

    const calculateDetectedLocation = (res) => {
        const face = res.outputs[0].data.regions[0].region_info.bounding_box
        const img = document.getElementById('imagedetection')
        const width = Number(img.width)
        const height = Number(img.height)

        return {
            leftCol: face.left_col * width,
            topRow: face.top_row * height,
            rightCol: width - (face.right_col * width),
            bottomRow: height - (face.bottom_row * height)
        }
    }

    // handles Submit
    // sends request to server
    const onSubmit = async () => {
        if (!input) return toast.error('please, provide URL for detection')
        setImageUrl(input)


        // request to get face coordinates
        const data = await apiService.clarifai(imageUrl)

        if (data.error) {
            return toast.error(data.error)
        }


        if (data.status?.code === 10000) {
            //request to update user rank(entries)
            if (user.id) {
                const entries = await apiService.updateEntries(user.id)
                dispatch({
                    type: 'signin',
                    data: {
                        ...user,
                        entries: entries
                    }
                })
            } else {
                const entries = localStorage.getItem('entries') || 0
                localStorage.setItem('entries', +entries + 1)
            }

            detectFace(calculateDetectedLocation(data))
        } else {
            toast.error(data.status.description)
        }
    }

    return <div>
        <Navigation />
        <Logo />
        <Rank />
        <ImageForm
            onInputChange={onInputChange}
            onSubmit={onSubmit} />
        <FaceRecognition
            box={box}
            imageUrl={imageUrl} />
    </div>
}

export default Home