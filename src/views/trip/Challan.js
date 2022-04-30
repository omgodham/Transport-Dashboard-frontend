import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
const useStyles = makeStyles((theme) => ({
    challanModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: ' translate(-50%,-50%)',
        maxWidth: '750px',
        overflow: 'scroll',
        maxHeight: '90vh'
    },
    customerDetails: {
        fontSize: '14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        padding: '5px 10px'
    },
    internalGrids: {
        border: '1px solid black'
    },
    table: {
        width: '100% !important',
        backgroundColor: 'transparent !important'
    }
}));
function Challan() {
    const classes = useStyles();
    const componentRef = useRef();

    const rows = [
        createData('Frozen yoghurt', 84313990, 'COSAC123CS', '20,000 Nos', '2,717', 'Nos', 54000),
        createData('Ice cream sandwich', 84313990, 'COSAC123CS', '10,000 Nos', '2,717', 'Nos', 54000),
        createData('Eclair', 84313990, 'COSAC123CS', '80,000 Nos', '2,717', 'Nos', 50000),
        createData('', '', '', '', '', '', 154000),
        createData('CGST', '', '', '', '', '', 15000),
        createData('SGST', '', '', '', '', 0, 13000),
        createData('Total', '', '', '60,000 Nos', '', 0, 202021)
    ];

    const taxRows = [
        createDataForTax('8343212', 168238, '9%', 150000, '9%', 15141, 30282),
        createDataForTax('Total', 168238, '', 150000, '', 15141, 30282)
    ];

    function createData(description, hsn, custPartNo, quantity, rate, per, amount) {
        return { description, hsn, custPartNo, quantity, rate, per, amount };
    }

    function createDataForTax(hsn, taxableValue, Crate, Camount, Srate, Samount, totalAmount) {
        return { hsn, taxableValue, Crate, Camount, Srate, Samount, totalAmount };
    }

    return (
        <>
            {' '}
            <Box className={classes.challanModal}>
                <Grid container xs={12} style={{ border: '1px solid black', background: 'white', width: 'fit-content' }} ref={componentRef}>
                    {/* Tax Invoice */}
                    <Grid xs={12} item style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Tax Invoice
                    </Grid>
                    {/* Trip Details */}
                    {/* <Grid xs={12} item> */}
                    <Grid xs={6} item>
                        <Grid item pb={2} className={classes.internalGrids}>
                            <Box className={classes.customerDetails}>
                                <Typography style={{ fontWeight: 'bold' }}>Customer Name</Typography>
                                <Typography>S-164, MIDCD BHOSARI</Typography>
                                <Typography>GSTIN/UIN: 27A3FGGG452W</Typography>
                                <Typography>State Name: Maharashtra, Code 27</Typography>
                                <Typography>CIN:U34201PN990</Typography>
                                <Typography>E-mail:mega@gmail.com</Typography>
                            </Box>
                        </Grid>
                        {/* Shipped to details */}
                        <Grid item pb={2} className={classes.internalGrids}>
                            <Box className={classes.customerDetails}>
                                <Typography style={{ fontWeight: 'bold' }}>Shipped To</Typography>
                                <Typography>Sandhar Technologies</Typography>
                                <Typography>GSTIN/UIN: 27A3FGG2222</Typography>
                                <Typography>State Name: Maharashtra, Code 27</Typography>
                            </Box>
                        </Grid>
                        {/* Billed to details */}
                        <Grid item pb={2} className={classes.internalGrids}>
                            <Box className={classes.customerDetails}>
                                <Typography style={{ fontWeight: 'bold' }}>Billed To</Typography>
                                <Typography>Sandhar Technologies</Typography>
                                <Typography>GSTIN/UIN: 27A3FGG2222</Typography>
                                <Typography>State Name: Maharashtra, Code 27</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid xs={6} item>
                        <Box display="flex" className={classes.internalGrids}>
                            <Box display="flex" flexDirection="column" flex="1">
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Invoice No</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>4144</Typography>
                                </Box>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Vendor Code</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>10622</Typography>
                                </Box>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Delivery Note</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>10622</Typography>
                                </Box>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Buyer's Order No</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>9262000107</Typography>
                                </Box>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Dispatch Doc No</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>-</Typography>
                                </Box>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Dispatched through</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>-</Typography>
                                </Box>
                            </Box>
                            <Box display="flex" flexDirection="column" flex="1" style={{ borderLeft: '1px solid black' }}>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Dated</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>21-Mar-22</Typography>
                                </Box>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Mode/Terms of Payment</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>30 days</Typography>
                                </Box>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Other References</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>-</Typography>
                                </Box>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Dated</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>14-Mar-22</Typography>
                                </Box>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Delivery Note Date</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>-</Typography>
                                </Box>
                                <Box style={{ borderBottom: '1px solid black', paddingLeft: '10px' }}>
                                    <Typography>Destination</Typography>
                                    <Typography style={{ fontWeight: 'bold' }}>-</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    {/* </Grid> */}
                    <Grid xs={12} item style={{ borderTop: '1px solid black' }}>
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ borderRight: '1px solid black' }}>Sr NO</TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }}>Description of Goods</TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                            HSN/SAC
                                        </TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                            Cust Part No.
                                        </TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                            Quantity
                                        </TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                            Rate
                                        </TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                            per
                                        </TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                            Amount
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center" style={{ borderRight: '1px solid black' }}>
                                                {index + 1}
                                            </TableCell>
                                            <TableCell
                                                style={{ borderRight: '1px solid black', fontWeight: 'bold' }}
                                                align={
                                                    row.description === 'CGST' || row.description === 'SGST' || row.description === 'Total'
                                                        ? 'right'
                                                        : 'left'
                                                }
                                            >
                                                {row.description}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                                {row.hsn}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                                {row.custPartNo}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                                {row.quantity}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                                {row.rate}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                                {row.per}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black', fontWeight: 'bold' }} align="right">
                                                {row.amount}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid xs={12} item style={{ textAlign: 'left', paddingLeft: '10px' }}>
                        <Typography>Amount in words: </Typography>
                        <Typography style={{ fontWeight: 'bold' }}>Twenty thousands and three hundred and thirty three</Typography>
                    </Grid>
                    <Grid xs={12} item style={{ borderTop: '1px solid black' }}>
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ borderRight: '1px solid black' }} rowSpan={2}>
                                            HSN/SAC
                                        </TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} rowSpan={2}>
                                            Taxable Value
                                        </TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center" colSpan={2}>
                                            Central Tax
                                        </TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center" colSpan={2}>
                                            State Tax
                                        </TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center" rowSpan={2}>
                                            Total Tax Amount
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ borderRight: '1px solid black' }}>Rate</TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }}>Amount</TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                            Rate
                                        </TableCell>
                                        <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                            Amount
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {taxRows.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center" style={{ borderRight: '1px solid black' }}>
                                                {row.hsn}
                                            </TableCell>
                                            <TableCell
                                                style={{ borderRight: '1px solid black', fontWeight: 'bold' }}
                                                align={
                                                    row.description === 'CGST' || row.description === 'SGST' || row.description === 'Total'
                                                        ? 'right'
                                                        : 'left'
                                                }
                                            >
                                                {row.taxableValue}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                                {row.hsn}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                                {row.Crate}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                                {row.Srate}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black' }} align="center">
                                                {row.Samount}
                                            </TableCell>
                                            <TableCell style={{ borderRight: '1px solid black', fontWeight: 'bold' }} align="right">
                                                {row.totalAmount}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid xs={12} item style={{ textAlign: 'left', paddingLeft: '10px' }}>
                        <Typography>Tax amount in words: </Typography>
                        <Typography style={{ fontWeight: 'bold' }}>Twenty thousands and three hundred and thirty three</Typography>
                    </Grid>
                </Grid>
                <Grid xs={12} item align="center" style={{ padding: '20px', backgroundColor: '#fff' }}>
                    <ReactToPrint trigger={() => <Button variant="contained">Print</Button>} content={() => componentRef.current} />
                </Grid>
            </Box>
        </>
    );
}

export default Challan;
