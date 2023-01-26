import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import './home.scss'
import Widget from '../../components/widget/Widget'
import HomeTable from '../../components/hometable/HomeTable'

const Home = () => {
  return (
    <div className='home'>
        <Sidebar />
        <div className='homeContainer'>
            <Navbar />
            <div className='homeWidget'>
                <Widget type={"user"} />
                <Widget type={"students"}/>
                <Widget type={"courses"} />
                <Widget type={"drafts"} />
            </div>
            <div className='listContainer'>
                <div className='listTitle'>Latest Applications</div>
                <HomeTable />
            </div>
        </div>
        
    </div>
  )
}

export default Home