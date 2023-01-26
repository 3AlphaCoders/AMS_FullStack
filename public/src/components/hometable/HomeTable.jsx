import './hometable.scss'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const HomeTable = () => {

    const rows = [
        {
            id:1143155,
            title:'Leave for issuing marksheet',
            name:'Akshay Dixit',
            date:'06/12/2022',
            status:'Approved'
        },
        {
            id:1143156,
            title:'Leave for issuing cc',
            name:'Saurabh',
            date:'08/12/2022',
            status:'Pending'
        },
        {
            id:1143157,
            title:'Leave for issuing tc',
            name:'Tushar',
            date:'08/12/2022',
            status:'Reject'
        },
        {
            id:1143158,
            title:'Leave for issuing cc',
            name:'Saurabh',
            date:'08/12/2022',
            status:'Pending'
        },
        
    ]
    
  return (
    <TableContainer component={Paper} className="homeTable">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell className='tableHead'>TITLE</TableCell>
            <TableCell className='tableHead'>NAME</TableCell>
            <TableCell className='tableHead'>DATE</TableCell>
            <TableCell className='tableHead'>STATUS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}>
              <TableCell>
                {row.id}
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default HomeTable