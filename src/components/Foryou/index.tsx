import { useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlbum, useAlbumSong } from '../../api/album.ts'
import {
    BadLike,
    CountDemo,
    CurrentSongList,
    FirstPlay,
    IsPlayingDemo,
    IsPlayingDemoTwo,
    Link,
} from '../../store/store.ts'
import eventBus from '../../utils/eventBus.ts'
import { ButtonIcon } from '../ButtonIcon'
import { SvgIcon } from '../SvgIcon'
import { Info } from './Info'
import { Left } from './Left'
import { svgList } from './svg.tsx'
import './index.less'

export function Foryou() {
    const [randomLetter, setRandomLetter] = useState<any>()
    const { data } = useAlbum(randomLetter)
    const { data: albumSong } = useAlbumSong(data?.albums?.items?.[0].id)
    const [, setFirstPlay] = useAtom(FirstPlay)
    const [, setCount] = useAtom(CountDemo)
    const navigate = useNavigate()
    const [, setBadLikeDemo] = useAtom(BadLike)
    const [, setIsPlaying] = useAtom(IsPlayingDemo)
    const [isPlayingTwo, setIsPlayingTwo] = useAtom(IsPlayingDemoTwo)
    const [linkDemo, setLinkDemo] = useAtom(Link)
    const [countL, setCountL] = useState(0)
    const [, setCurrentSong] = useAtom<{ items: Array<any> }>(CurrentSongList)
    const randomGradient = useMemo(() =>
        `linear-gradient(to left top,
   rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}),
   rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}))`, [])
    function nextSong() {
        setFirstPlay(false)
        setLinkDemo(true)
        setIsPlayingTwo(true)
        setBadLikeDemo(true)
        setCurrentSong({
            ...albumSong,
            imgPic: data?.albums?.items[0].images[0].url,
        })
        if (countL < albumSong?.items.length - 1) {
            // @ts-ignore
            eventBus.emit('play-track', albumSong?.items[countL + 1].uri)
            setCountL(countL + 1)
            setCount(countL + 1)
        }
        else {
            // @ts-ignore
            eventBus.emit('play-track', albumSong?.items[countL].uri)
            setCount(countL)
        }
    }

    const getRandomAlbumFirstTrack = async (play?: boolean) => {
        if (albumSong) {
            if (play === true) {
                if (!linkDemo) {
                    setFirstPlay(false)
                    setCurrentSong({
                        ...albumSong,
                        imgPic: data?.albums?.items[0].images[0].url,
                    })
                    setCount(0)
                    // @ts-ignore
                    eventBus.emit('play-track', albumSong?.items[0].uri)
                    setLinkDemo(true)
                }
                else {
                    // @ts-ignore
                    eventBus.emit('play-track')
                }
                setIsPlaying(true)
            }
            else {
                // @ts-ignore
                eventBus.emit('play-stop')
                setIsPlaying(false)
            }
        }
        else {
            const searchLetters = 'abcdefghijklmnopqrstuvwxyz'
            const randomLetterDemo = searchLetters[Math.floor(Math.random() * searchLetters.length)]
            setRandomLetter(randomLetterDemo)
        }
    }
    useEffect(() => {
        getRandomAlbumFirstTrack().then()
    }, [])
    return (
        <div className="for-you-row">
            <Left></Left>
            <div
                className="fm"
                style={{
                    background: randomGradient,
                    position: 'relative',
                }}
            >
                <img src="undefined?param=512y512" loading="lazy" style={{ display: 'none' }} alt="" />
                <img
                    src={data?.albums?.items[0].images[0].url}
                    loading="lazy"
                    className="cover"
                    alt=""
                    onClick={() => {
                        navigate(`/playsList?id=${data?.albums?.items[0].id}&type=albums`)
                    }}
                />
                <div className="right-part">
                    <Info randomAlbum={data}></Info>
                    <div className="controls" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                        <div className="buttons">
                            <ButtonIcon
                                classname="button-icon"
                                title="不喜欢"
                                sty={{ width: '40px', height: '40px' }}
                                onClick={nextSong}
                            >
                                <SvgIcon>
                                    {svgList.badLike}
                                </SvgIcon>
                            </ButtonIcon>
                            <ButtonIcon
                                classname="button-icon play"
                                title="播放"
                                sty={{ width: '40px', height: '40px' }}
                                onClick={() => {
                                    setIsPlayingTwo(!isPlayingTwo)
                                    if (!isPlayingTwo) {
                                        setBadLikeDemo(true)
                                        getRandomAlbumFirstTrack(true)
                                    }
                                    else {
                                        getRandomAlbumFirstTrack(false)
                                    }
                                }}
                            >
                                <SvgIcon sty={{ display: isPlayingTwo ? 'none' : '' }}>
                                    {svgList.bigButton}
                                </SvgIcon>
                                <SvgIcon sty={{ display: isPlayingTwo ? '' : 'none' }}>
                                    {svgList.bigButtonStop}
                                </SvgIcon>
                            </ButtonIcon>

                            <ButtonIcon
                                classname="button-icon "
                                title="下一首"
                                sty={{ width: '40px', height: '40px' }}
                                onClick={nextSong}
                            >
                                <SvgIcon>
                                    {svgList.next}
                                </SvgIcon>
                            </ButtonIcon>
                        </div>
                        <div className="card-name">
                            <SvgIcon>
                                {svgList.logo}
                            </SvgIcon>
                            私人FM
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
