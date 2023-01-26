import './notfound.scss'
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='notFound'>
    
        <div className='nfContainer'>
            <ContentCutIcon sx={{ fontSize: 50 }} />

            <h1>404</h1>
            <h3>Page Not Found</h3>
            <p>This page is not found or not available.</p>
            <Link to='/'>Return to Dashboard</Link>
        </div>
    </div>
  )
}

export default NotFound