import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { format } from 'date-fns';
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
function Challan({ trip, customers }) {
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

    var a = [
        '',
        'one ',
        'two ',
        'three ',
        'four ',
        'five ',
        'six ',
        'seven ',
        'eight ',
        'nine ',
        'ten ',
        'eleven ',
        'twelve ',
        'thirteen ',
        'fourteen ',
        'fifteen ',
        'sixteen ',
        'seventeen ',
        'eighteen ',
        'nineteen '
    ];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    function inWords(num, only, paise) {
        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        var str = '';
        str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str +=
            n[5] != 0
                ? (str != '' ? 'and ' : '') +
                  (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) +
                  (paise ? ' paise ' : '') +
                  (only ? 'only' : '')
                : '';
        return str;
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
                                <Typography style={{ fontWeight: 'bold' }}>
                                    {customers.find((o) => o._id == trip.customer)?.name}
                                </Typography>
                                <Typography>{customers.find((o) => o._id == trip.customer)?.address?.addressLine1}</Typography>
                                <Typography>GSTIN/UIN:{customers.find((o) => o._id == trip.customer)?.gstNo}</Typography>
                                <Typography>State Name:{customers.find((o) => o._id == trip.customer)?.address?.state}</Typography>
                                <Typography>CIN:U34201PN990</Typography>
                                <Typography>E-mail:mega@gmail.com</Typography>
                            </Box>
                        </Grid>
                        {/* Shipped to details */}
                        <Grid item pb={2} className={classes.internalGrids}>
                            <Box className={classes.customerDetails}>
                                <Typography style={{ fontWeight: 'bold' }}>Shipped To</Typography>
                                <Typography>{trip.dropup}</Typography>
                                <Typography>GSTIN/UIN: 27A3FGG2222</Typography>
                                <Typography>State Name: Maharashtra, Code 27</Typography>
                            </Box>
                        </Grid>
                        {/* Billed to details */}
                        <Grid item pb={2} className={classes.internalGrids}>
                            <Box className={classes.customerDetails}>
                                <Typography style={{ fontWeight: 'bold' }}>Billed To</Typography>
                                <Typography>{trip.dropup}</Typography>
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
                                    <Typography style={{ fontWeight: 'bold' }}>{trip.challanNo}</Typography>
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
                                    <Typography style={{ fontWeight: 'bold' }}>{format(new Date(trip.tripDate), 'dd-MMM-yy')}</Typography>
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
                                    <Typography style={{ fontWeight: 'bold' }}>{format(new Date(trip.tripDate), 'dd-MMM-yy')}</Typography>
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
                        <Typography style={{ fontWeight: 'bold' }}>
                            {inWords(
                                trip.totalPayment.toString().split('.')[0],
                                !trip.totalPayment.toString().split('.')[1],
                                !trip.totalPayment.toString().split('.')[1]
                            )}{' '}
                            {trip.totalPayment.toString().split('.')[1]
                                ? ' and ' + inWords(parseInt(trip.totalPayment.toString().split('.')[1]), true, true)
                                : ''}
                        </Typography>
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
                        <Typography style={{ fontWeight: 'bold' }}>
                            {' '}
                            {inWords(
                                trip.totalPayment.toString().split('.')[0],
                                !trip.totalPayment.toString().split('.')[1],
                                !trip.totalPayment.toString().split('.')[1]
                            )}{' '}
                            {trip.totalPayment.toString().split('.')[1]
                                ? ' and ' + inWords(parseInt(trip.totalPayment.toString().split('.')[1]), true, true)
                                : ''}
                        </Typography>
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
