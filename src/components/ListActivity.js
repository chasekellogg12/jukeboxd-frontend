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
        <div className='flex flex-col items-center space-y-2 list-of-recent-activity text-h-grey'> 
            {passedData.length == 0 ? 
                <div className='flex items-center justify-center w-2/3'>
                    Nothing here yet!
                </div>
            :
            <>
                {passedData.slice().reverse().map(recentActivity => ( // for every user in the list of users, put its name in its own div
                    <div className='flex items-center justify-between w-2/3 p-2 border rounded-md group border-dark-purple hover:border-c-grey' key={recentActivity}>
                        <div className='text-xs italic text-dark-purple activity-date'>{formatDistanceToNow(new Date(recentActivity.timeCreated), { addSuffix: true })}</div>
                        <div className='flex p-1 space-x-1 text-white truncate rounded-md text-nowrap group-hover:whitespace-nowrap group-hover:overflow-visible group-hover:truncate-0 bg-c-grey'>
                            <div className='text-h-grey'>{recentActivity.userWhoActed}</div>
                            <div className='activity-text'>{recentActivity.activityString}</div>
                            {recentActivity.activityString[recentActivity.activityString.length-2] == 'f' ? 
                                <div>{recentActivity.thingActedUpon}</div> :
                                <button onClick={() => handleProfileNavigate(`/profile/${recentActivity.thingActedUpon.slice(1)}`)}className='text-hov-blue hover:text-dark-purple'>{recentActivity.thingActedUpon}</button>
                            }
            
                        </div>
                        
                    </div>
                ))}
            </>
            }
        </div>
    )
}
export default ListActivity;