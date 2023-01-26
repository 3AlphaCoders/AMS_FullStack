import './widget.scss'
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
// import ArticleIcon from '@mui/icons-material/Article';
// import DraftsIcon from '@mui/icons-material/Drafts';

const Widget = (props) => {

    // switch(type){
    //     case "user":
    //         data={
    //             title:"USERS",
    //             isMoney:false,
    //             link:"See all users",
    //             icon:(
    //                 <PersonOutlineIcon className='wIcon' style={{color:'crimson', backgroundColor:'rgba(255,0,0,0.2'}} />
    //             )
    //         };
    //         break;

    //     case "students":
    //         data={
    //             title:"ACCESSIBILITY",
    //             isMoney:false,
    //             link:"See all students",
    //             icon:(
    //                 <AccessibilityNewIcon className='wIcon' style={{color:'green', backgroundColor:'rgba(0,128,0,0.2'}} />
    //             )
    //         };
    //         break;
            
    //     case "courses":
    //         data={
    //             title:"COURSES",
    //             isMoney:false,
    //             link:"See all courses",
    //             icon:(
    //                 <ArticleIcon className='wIcon' style={{color:'purple', backgroundColor:'rgba(255,0,0,0.2'}} />
    //                 )
    //         };
    //         break;
            
    //     case "drafts":
    //         data={
    //             title:"DRAFTS",
    //             isMoney:false,
    //             link:"See all drafts",
    //             icon:(
    //                 <DraftsIcon className='wIcon' style={{color:'crimson', backgroundColor:'rgba(255,0,0,0.2'}} />
    //             )
    //         };
    //         break;
    //     default:
    //         break;
    // }
    
  return (
    <div className='widget'>
        <div className='wLeft'>
            <span className='wTitle'>{props.type}</span>
            <span className='wCounter'>
                {props.data}
            </span>
            {/* <span className='wLink'>{props.data}</span> */}
        </div>
        {/* <div className='wRight'>
            <div className='wPercent positive'>
                <KeyboardArrowUpIcon />
                {diff}%
            </div>
        </div> */}
    </div>
  )
}

export default Widget