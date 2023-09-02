import { FaHeart, FaHeartBroken } from 'react-icons/fa';

const TickIcon = ({ size, color, title, progress }) => {
    return (
        <>
            {
                progress >= 100 
                ? 
                <FaHeart className="icon heart-beats" size={size} color={color} title={title} /> 
                :
                <FaHeartBroken className="icon" size={size} color={color} title={title} /> 
            }
        </>
    );
}

export default TickIcon;