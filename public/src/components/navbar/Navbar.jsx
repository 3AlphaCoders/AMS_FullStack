import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import './navbar.scss'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const {user} = useContext(AuthContext);

  return (
    <div className='navbar'>
        <div className='navWrapper'>
            <div className='navSearch'>
                <input type="text" placeholder='Search..' />
                <SearchOutlinedIcon className='navIcon' />
            </div>
            <div className='navItems'>
                <div className='nItem'>
                    <LanguageOutlinedIcon className='navIcon' />
                    English 
                </div>
                <div className='nItem'>
                    <DarkModeOutlinedIcon className='navIcon' /> 
                </div>
                <div className='nItem'>
                    <FullscreenExitOutlinedIcon className='navIcon' /> 
                </div>
                <div className='nItem'>
                    <NotificationsNoneOutlinedIcon className='navIcon' /> 
                    <div className='counter'>2</div>
                </div>
                <div className='nItem'>
                    <ChatBubbleOutlineOutlinedIcon className='navIcon' /> 
                </div>
                <div className='nItem'>
                    <ListOutlinedIcon className='navIcon' /> 
                </div>
                <div className='nItem'>
                    <Link to='/myprofile' style={{textDecoration:'none', color:'black', display:'flex', alignItems:'center'}}>
                        <img src="https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg" alt="" className="nAvatar" />
                        {user.role}
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar