import VideoPath from '../assets/errorBGV.mp4'


export const Failed = () => {
    return (
        <div style={{alignItems: "center"}}>
            <video  className="bg-video" autoPlay muted ><source  src={VideoPath} type="video/mp4" /></video>
            <h1 style={{color: "#ccc", marginTop: "20%", textAlign: "center"}}>Internal Error<br/>Try Again later</h1>
            </div>
    )
}