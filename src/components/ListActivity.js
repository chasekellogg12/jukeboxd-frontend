import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ListActivity = (props) => {

    const { passedData } = props;

    const navigate = useNavigate();

    const handleProfileNavigate = (location) => {
        navigate(location);
        navigate(0);
    }

    return (
        <div className='flex flex-col items-center list-of-recent-activity text-h-grey'> 
            {passedData.slice().reverse().map(recentActivity => ( // for every user in the list of users, put its name in its own div
                <div className='flex items-center justify-between w-2/3' key={recentActivity}>
                    <div className='flex space-x-1'>
                        <div>{recentActivity.userWhoActed}</div>
                        <div className='activity-text'>{recentActivity.activityString}</div>
                        {recentActivity.activityString[recentActivity.activityString.length-2] == 'f' ? 
                            <div>{recentActivity.thingActedUpon}</div> :
                            <button onClick={() => handleProfileNavigate(`/profile/${recentActivity.thingActedUpon.slice(1)}`)}className='text-white'>{recentActivity.thingActedUpon}</button>
                        }
        
                    </div>
                    <div className='text-xs italic activity-date'>{formatDistanceToNow(new Date(recentActivity.timeCreated), { addSuffix: true })}</div>
                </div>
            ))}
        </div>
    )
}
export default ListActivity;