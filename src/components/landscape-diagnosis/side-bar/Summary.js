import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';




export default function SummaryTable(props) {
  return (
    <TableContainer component={Paper}>
      {props.summaryData=='carbon'?
      <Table sx={{ minWidth: '100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell  width="50%">Soil organic category (g/kg)</TableCell>
            <TableCell width="50%" >Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
         


            <TableRow
              
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >

              <TableCell align="left"> &lt; 10</TableCell>
              <TableCell align="left"> Very low</TableCell>
            </TableRow>
            <TableRow
              
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            
              <TableCell align="left">10-20</TableCell>
              <TableCell align="left"> Low</TableCell>
            </TableRow>
            <TableRow
              
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >  
              <TableCell align="left">20-50 </TableCell>
              <TableCell align="left"> Moderate</TableCell>
               

              
            </TableRow>
            <TableRow
              
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            
            <TableCell align="left">&gt; 50 </TableCell>
              <TableCell align="left"> High</TableCell>

              
            </TableRow>
            
        </TableBody>
      </Table>
      :''}
          

{props.summaryData=='erosion'?
      <Table sx={{ minWidth: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width="50%">Soil loss rate (t/ha/yr)</TableCell>
            <TableCell width="50%">Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
           <TableRow
           
           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
         >

           <TableCell align="left">  &lt; 2</TableCell>
           <TableCell align="left"> Very Low</TableCell>
         </TableRow>
         <TableRow
           
           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
         >
         
           <TableCell align="left">2-10</TableCell>
           <TableCell align="left">Low</TableCell>
         </TableRow>
         <TableRow
           
           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
         >  
           <TableCell align="left">10-20 </TableCell>
           <TableCell align="left"> Moderate</TableCell>
            

           
         </TableRow>
         <TableRow
           
           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
         >
         
         <TableCell align="left">20-50 </TableCell>
           <TableCell align="left"> Severe</TableCell>

           
         </TableRow>
         <TableRow
           
           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
         >
          <TableCell align="left">&gt; 50 </TableCell>
           <TableCell align="left"> Very Severe</TableCell>

           
         </TableRow>
         
     </TableBody>
      </Table>
          :''}

{props.summaryData=='moisture'?
      <Table sx={{ minWidth: '100%' }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell  width="50%">Soil organic category (g/kg)</TableCell>
          <TableCell width="50%" >Category</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
       


          <TableRow
            
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
          
            <TableCell align="left">0-29</TableCell>
            <TableCell align="left"> Deficit</TableCell>
          </TableRow>
          <TableRow
            
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
          
            <TableCell align="left">30-59</TableCell>
            <TableCell align="left"> Limiting</TableCell>
          </TableRow>
          <TableRow
            
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
          
            <TableCell align="left">60-100 </TableCell>
            <TableCell align="left"> Adequate</TableCell>

            
          </TableRow>
          <TableRow
            
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
          
            <TableCell align="left">&gt;100 </TableCell>
            <TableCell align="left"> Surplus</TableCell>

            
          </TableRow>
          
      </TableBody>
    </Table>
          :''}

{props.summaryData=='productivity'?
      <Table sx={{ minWidth: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width="50%">Land productivity</TableCell>
            <TableCell width="50%">Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

       <TableRow
         
         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
       >
       
         <TableCell align="left">&lt; 0.2 </TableCell>
         <TableCell align="left"> Very low</TableCell>
       </TableRow>
       <TableRow
         
         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
       >
       
         <TableCell align="left">0.2 - 0.4</TableCell>
         <TableCell align="left"> Low</TableCell>
       </TableRow>
       <TableRow
         
         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
       >
       
         <TableCell align="left">0.4 - 0.6 </TableCell>
         <TableCell align="left"> Moderate Low</TableCell>

         
       </TableRow>
       <TableRow
         
         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
       >
       
         <TableCell align="left">0.6 - 0.8  </TableCell>
         <TableCell align="left"> Moderately High</TableCell>

         
       </TableRow>
       <TableRow
         
         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
       >
       
         <TableCell align="left">0.8-1 </TableCell>
         <TableCell align="left"> High</TableCell>

         
       </TableRow>
       
   </TableBody>
      </Table>
          :''}

    </TableContainer>
  );
}