// ** React Imports
import { useEffect, useState, forwardRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import TableBody from '@mui/material/TableBody'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import axios from 'axios'
import DatePicker from 'react-datepicker'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Custom Component Imports
import Repeater from 'src/@core/components/repeater'
import CustomTextField from 'src/@core/components/mui/text-field'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: { sm: '250px', xs: '170px' } }} />
})

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const RepeatingContent = styled(Grid)(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-2.375rem',
    position: 'absolute'
  },
  [theme.breakpoints.down('md')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterWrapper = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(16, 10, 10),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(16)
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(10)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6)
  }
}))

const InvoiceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const EditCard = ({ data }) => {
  // ** States
  const [count, setCount] = useState(1)
  const [selected, setSelected] = useState('')
  const [clients, setClients] = useState(undefined)
  const [selectedClient, setSelectedClient] = useState(null)
  const [dueDate, setDueDate] = useState(data ? new Date(data.invoice.dueDate) : new Date())
  const [issueDate, setIssueDate] = useState(data ? new Date(data.invoice.issuedDate) : new Date())

  // ** Hook
  const theme = useTheme()
  useEffect(() => {
    axios.get('/apps/invoice/clients').then(response => {
      if (response.data && clients === undefined) {
        setClients(response.data)
        setSelected(response.data[0].name)
        setSelectedClient(response.data[0])
      }
    })
  }, [clients])

  // ** Deletes form
  const deleteForm = e => {
    e.preventDefault()

    // @ts-ignore
    e.target.closest('.repeater-wrapper').remove()
  }

  // ** Handle Invoice To Change
  const handleInvoiceChange = e => {
    setSelected(e.target.value)
    if (clients !== undefined) {
      setSelectedClient(clients.filter(i => i.name === e.target.value)[0])
    }
  }
  if (data) {
    return (
      <Card>
        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                  <svg width={170} height={45} viewBox='0 0 170 45' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      fill='#F9F9F9'
                      d='M22.3043 22.099V36.5605C22.3043 37.5191 23.0814 38.2962 24.04 38.2962C24.9942 38.2962 25.7688 37.5247 25.7724 36.5705L25.7956 30.4619L25.8216 23.6159C25.8241 22.9704 25.9326 22.3298 26.1427 21.7194C26.5692 20.486 27.4222 19.3203 28.3248 18.7375C28.9595 18.3309 29.0587 18.3038 30.1398 18.3038C31.1912 18.3038 31.3201 18.3309 31.8557 18.6968C33.1847 19.5779 34.1865 21.3806 34.4047 23.2511C34.4642 23.7661 34.5039 27.0734 34.5039 31.2074V36.5506C34.5039 37.5147 35.2854 38.2962 36.2495 38.2962C37.2122 38.2962 37.9912 37.5133 37.9864 36.5506L37.9555 30.3264C37.9158 22.6411 37.9059 22.3294 37.6976 21.2993C37.2314 18.995 36.2594 16.9348 34.9502 15.4845C33.7104 14.1155 32.3814 13.492 30.6853 13.492C29.029 13.492 27.6503 14.1155 26.351 15.4709C26.1421 15.6875 25.7758 15.5396 25.7758 15.2387V10.9845V7.63737C25.7758 6.67877 24.9987 5.90166 24.04 5.90166C23.0814 5.90166 22.3043 6.67877 22.3043 7.63737V22.099Z'
                    />
                    <path
                      d='M128.51 11.3369L128.485 15.8368C128.483 16.1664 128.078 16.3232 127.855 16.0809C126.219 14.2782 124.532 13.492 122.311 13.492C119.553 13.492 117.411 14.9017 115.566 17.9107C114.525 19.6186 113.84 21.5432 113.543 23.6577C113.374 24.8776 113.404 27.4258 113.602 28.7405C114.178 32.5222 116.052 35.7616 118.661 37.483C119.91 38.3098 120.644 38.5673 122.093 38.6622C124.86 38.852 127.062 37.7812 128.956 35.3143C130.781 32.9559 131.644 30.5975 131.902 27.3173C131.951 26.5854 132.001 21.6788 132.001 15.9589V7.63739C132.001 6.67879 131.224 5.90168 130.265 5.90168C129.306 5.90168 128.527 6.67776 128.523 7.63738L128.51 11.3369ZM124.552 18.6291C126.238 19.4288 127.647 21.3942 128.192 23.7255C128.5 25.0267 128.539 26.9107 128.282 28.1848C127.796 30.6788 126.199 32.9152 124.364 33.7014C123.372 34.1216 121.854 34.0809 120.833 33.6201C119.871 33.1863 119.325 32.7119 118.591 31.6954C117.431 30.0824 116.915 28.3881 116.905 26.1652C116.895 24.0779 117.252 22.6682 118.214 21.096C118.998 19.8083 120.079 18.846 121.24 18.4258C121.993 18.1411 123.759 18.2631 124.552 18.6291Z'
                      fill='#F9F9F9'
                    />
                    <path
                      d='M7.33762 13.6954C4.03482 14.6849 1.40647 17.8972 0.404715 22.1668C0.0377377 23.7255 -0.0416089 24.6337 0.017901 26.6668C0.0674926 28.7677 0.315451 30.2587 0.841121 31.6954C2.14042 35.2059 4.67951 37.849 7.36737 38.4996C10.3726 39.2044 13.0902 38.2556 15.183 35.7617C17.1468 33.4168 18.2081 30.5026 18.4858 26.6668L18.509 26.339C18.5327 26.0042 18.4607 25.6696 18.3014 25.3741C17.6171 24.1052 15.776 24.1595 15.1452 25.4558C15.0271 25.6984 14.9648 25.9666 14.9648 26.2365V26.3957C14.9549 28.9846 13.5564 31.9936 11.7909 33.2135C10.6007 34.0403 8.88488 34.2436 7.55582 33.7014C6.31603 33.1999 4.95722 31.8038 4.25302 30.2993C3.20168 28.0629 3.17193 24.6065 4.18359 22.1668C4.60016 21.1502 5.75069 19.6186 6.49456 19.09C7.78394 18.1547 9.56924 17.9785 11.0669 18.6427C11.5442 18.8547 12.0485 19.2198 12.5641 19.1369C12.8348 19.0934 13.1415 18.8748 13.4642 18.2854C13.6515 17.9432 13.7712 17.5647 13.8235 17.1781C14.0734 15.3285 13.1767 14.6675 13.1597 14.6442C13.0605 14.4951 11.6422 13.8852 10.9876 13.6954C10.1147 13.4379 8.19059 13.4514 7.33762 13.6954Z'
                      fill='#F9F9F9'
                    />
                    <path
                      d='M48.8954 13.6953C45.9397 14.5764 43.5296 17.6261 42.6766 21.5568C42.5179 22.2887 42.4981 23.2104 42.4683 30.3399L42.4373 36.5606C42.4325 37.5178 43.2071 38.2962 44.1643 38.2962C45.1284 38.2962 45.91 37.5147 45.91 36.5506V30.977C45.91 23.2646 45.9298 22.7767 46.3761 21.5568C46.6538 20.7706 47.4671 19.5779 48.0424 19.117C48.6276 18.6562 49.6095 18.236 50.1252 18.236C50.415 18.236 50.697 18.1423 50.9291 17.9689L51.4573 17.5742C52.83 16.5486 52.5979 14.4244 51.0414 13.7082C50.733 13.5663 50.3951 13.4967 50.0558 13.5056C49.7682 13.5056 49.2425 13.6005 48.8954 13.6953Z'
                      fill='#F9F9F9'
                    />
                    <path
                      d='M60.0435 13.5733C59.9344 13.6005 59.6071 13.6953 59.3096 13.7767C59.022 13.858 58.3971 14.1426 57.9309 14.4002C55.253 15.864 53.0908 19.3068 52.3866 23.2104C52.1287 24.6336 52.1486 27.5884 52.4362 29.12C53.2793 33.7556 55.9374 37.3068 59.3989 38.4589C60.232 38.73 62.7413 38.6893 63.6637 38.3911C64.5762 38.0929 66.054 37.1577 66.8773 36.3444C68.0873 35.1652 69.3172 33.1321 69.9222 31.3158C70.5272 29.4995 70.6561 28.5508 70.6561 26.0974C70.6561 24.1863 70.6165 23.6983 70.428 22.8038C69.5155 18.4529 66.9963 15.0508 63.7728 13.8173C63.2372 13.614 60.4899 13.4242 60.0435 13.5733ZM62.8604 18.4393C63.8522 18.7646 64.6159 19.3881 65.4986 20.608C66.7384 22.2887 67.2343 23.861 67.2343 26.1517C67.2343 29.6486 65.5185 32.7661 63.0389 33.7556C62.3843 34.0131 60.7874 34.0538 60.0733 33.8369C58.0004 33.1863 56.225 30.6788 55.7787 27.7646C55.3522 25.0267 55.8878 22.6276 57.3656 20.608C58.6153 18.9002 59.6865 18.2631 61.3825 18.2495C61.8487 18.2495 62.5132 18.3309 62.8604 18.4393Z'
                      fill='#F9F9F9'
                    />
                    <path
                      d='M79.9099 13.6953C77.4303 14.5221 75.0598 17.4634 74.2267 20.7706C73.8101 22.3836 73.7804 23.1155 73.7804 30.8685V36.5605C73.7804 37.5191 74.5575 38.2962 75.5161 38.2962C76.4747 38.2962 77.2518 37.5191 77.2518 36.5605V30.977C77.2518 26.1517 77.2915 23.4273 77.3609 22.9529C77.6188 21.2857 78.6403 19.5237 79.8305 18.7375C80.4455 18.3309 80.5347 18.3038 81.6158 18.3038C82.7069 18.3038 82.7961 18.3309 83.4111 18.7375C84.1549 19.239 85.0278 20.3234 85.4146 21.2179C85.9601 22.5056 85.9799 22.7902 85.9799 30.8685V36.5506C85.9799 37.5147 86.7615 38.2962 87.7255 38.2962C88.6831 38.2962 89.4584 37.5181 89.4548 36.5606L89.4315 30.2722C89.4017 22.2616 89.3918 22.2345 89.1637 21.2857C88.2512 17.5447 85.9303 14.5493 83.302 13.7089C82.4986 13.4514 80.6835 13.4514 79.9099 13.6953Z'
                      fill='#F9F9F9'
                    />
                    <path
                      d='M99.8754 13.6954C97.9215 14.2918 96.652 15.2541 95.1742 17.2466C93.5079 19.483 92.6549 22.1803 92.5557 25.4875C92.4665 28.361 92.8334 30.4619 93.7856 32.6306C94.708 34.7451 96.5726 36.9002 98.2885 37.8625C100.49 39.096 103.793 38.9469 105.846 37.5372C108.068 35.9921 109.853 33.105 110.607 29.8249C110.855 28.7677 111.073 27.0463 111.073 26.2195V26.0821C111.073 25.9126 111.048 25.744 110.999 25.5818C110.536 24.0609 108.435 23.9275 107.784 25.3776L107.682 25.6053C107.596 25.7964 107.544 26.001 107.528 26.2099L107.483 26.8023C107.255 29.9875 105.648 32.7797 103.535 33.6607C102.077 34.2842 100.56 34.108 99.1911 33.1728C98.5365 32.7391 98.0901 32.2647 98.1893 32.1427C98.2092 32.1156 100.927 29.7029 104.23 26.7752C107.532 23.8475 110.27 21.4077 110.31 21.3535C110.478 21.1502 109.427 18.8053 108.604 17.5312C107.622 16.0267 105.836 14.5357 104.23 13.8987C103.258 13.5056 100.838 13.3972 99.8754 13.6954ZM103.178 18.4529C103.952 18.724 105.559 19.8761 105.41 20.0523C105.311 20.1743 96.2949 28.1306 96.2553 28.1306C96.1362 28.1306 95.9974 27.0192 95.9974 26.0975C95.9974 23.468 96.8999 21.1231 98.4968 19.5915C99.1217 18.9951 99.9945 18.48 100.659 18.3309C101.274 18.1818 102.613 18.2496 103.178 18.4529Z'
                      fill='#F9F9F9'
                    />
                    <path
                      d='M142.594 13.6276C141.661 13.858 140.332 14.5492 139.489 15.2405C138.864 15.7691 137.645 17.1923 137.178 17.9513C135.105 21.3128 134.471 25.8128 135.482 30.0959C136.375 33.9047 138.755 37.0357 141.671 38.242C142.485 38.5809 142.713 38.608 144.25 38.6215C146.085 38.6351 146.492 38.5402 147.92 37.7134C150.697 36.114 152.958 32.2917 153.415 28.3881C153.563 27.1411 153.544 24.6471 153.385 23.5628C153.028 21.2315 152.284 19.3068 151.054 17.5312C149.775 15.6742 148.684 14.7254 146.978 13.9664C146.234 13.6276 145.956 13.5869 144.597 13.5462C143.754 13.5327 142.852 13.5598 142.594 13.6276ZM146.234 18.6426C147.523 19.3203 148.773 20.8113 149.398 22.4378C150.37 24.9453 150.271 28.0357 149.16 30.367C147.91 32.9965 145.926 34.2842 143.625 33.9589C142.247 33.7556 141.275 33.1321 140.253 31.7631C139.231 30.3941 138.706 28.9574 138.537 27.0191C138.438 25.9483 138.438 25.5959 138.577 24.6742C139.053 21.5432 140.838 19.0086 143.06 18.3715C143.278 18.3038 143.953 18.2631 144.548 18.2902C145.391 18.3173 145.778 18.3986 146.234 18.6426Z'
                      fill='#F9F9F9'
                    />
                    <path
                      d='M9.67351 19.9417C8.70471 19.8941 7.89293 20.1841 7.12812 20.8535C6.06697 21.7802 5.29512 23.2155 4.96974 24.8671C4.6739 26.3688 4.79024 27.8003 5.3121 29.1055C5.4928 29.5588 5.62836 29.8255 5.88134 30.2264C6.79758 31.6753 8.08984 32.3951 9.51638 32.2535C9.88892 32.2161 10.4401 32.0579 10.7763 31.8906C11.0342 31.761 11.5557 31.4282 11.5838 31.3754C11.6048 31.3358 11.6753 30.1583 11.6905 29.6315C11.7802 26.379 11.1738 23.1216 9.96976 20.415C9.85634 20.1595 9.75339 19.9519 9.741 19.9473C9.72803 19.9458 9.69796 19.9411 9.67351 19.9417ZM10.2742 24.8348C10.6743 25.2074 10.7797 25.9419 10.5148 26.5005C10.2422 27.0753 9.72045 27.241 9.3315 26.8788C8.79861 26.3822 8.81879 25.3249 9.37383 24.8217C9.64019 24.5817 10.0087 24.5869 10.2742 24.8348Z'
                      fill='#F9F9F9'
                    />
                  </svg>
                  <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px' }}>
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                <div>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>Office 149, 450 South Brand Brooklyn</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>San Diego County, CA 91905, USA</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xl={6} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h4' sx={{ mr: 2, width: '105px' }}>
                    Invoice
                  </Typography>
                  <CustomTextField
                    fullWidth
                    value={data.invoice.id}
                    sx={{ width: { sm: '250px', xs: '170px' } }}
                    InputProps={{
                      disabled: true,
                      startAdornment: <InputAdornment position='start'>#</InputAdornment>
                    }}
                  />
                </Box>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Date Issued:</Typography>
                  <DatePicker
                    id='issue-date'
                    selected={issueDate}
                    showDisabledMonthNavigation
                    customInput={<CustomInput />}
                    onChange={date => setIssueDate(date)}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Date Due:</Typography>
                  <DatePicker
                    selected={dueDate}
                    showDisabledMonthNavigation
                    customInput={<CustomInput />}
                    onChange={date => setDueDate(date)}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='h6' sx={{ mb: 6 }}>
                Invoice To:
              </Typography>
              <CustomTextField
                select
                sx={{
                  mb: 4,
                  width: '200px',
                  '& .MuiFilledInput-input.MuiSelect-select': {
                    minWidth: '11rem !important'
                  }
                }}
                SelectProps={{ value: selected, onChange: e => handleInvoiceChange(e) }}
              >
                {clients !== undefined ? (
                  clients.map(client => (
                    <MenuItem key={client.name} value={client.name}>
                      {client.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value=''>No clients</MenuItem>
                )}
              </CustomTextField>
              {selectedClient !== null ? (
                <>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.company}</Typography>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.address}</Typography>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.contact}</Typography>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.companyEmail}</Typography>
                </>
              ) : null}
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                <Typography variant='h6' sx={{ mb: 6 }}>
                  Bill To:
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(0.75)} !important` } }}>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Total Due:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            {data.paymentDetails.totalDue}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Bank name:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data.paymentDetails.bankName}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Country:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data.paymentDetails.country}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>IBAN:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data.paymentDetails.iban}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>SWIFT code:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data.paymentDetails.swiftCode}</Typography>
                        </MUITableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <RepeaterWrapper>
          <Repeater count={count}>
            {i => {
              const Tag = i === 0 ? Box : Collapse

              return (
                <Tag key={i} className='repeater-wrapper' {...(i !== 0 ? { in: true } : {})}>
                  <Grid container>
                    <RepeatingContent item xs={12}>
                      <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                        <Grid item lg={6} md={5} xs={12} sx={{ px: 4, my: { lg: 0, xs: 2 } }}>
                          <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                            Item
                          </Typography>
                          <CustomTextField select fullWidth defaultValue='App Design'>
                            <MenuItem value='App Design'>App Design</MenuItem>
                            <MenuItem value='App Customization'>App Customization</MenuItem>
                            <MenuItem value='ABC Template'>ABC Template</MenuItem>
                            <MenuItem value='App Development'>App Development</MenuItem>
                          </CustomTextField>
                          <CustomTextField
                            rows={2}
                            fullWidth
                            multiline
                            sx={{ mt: 3.5 }}
                            defaultValue='Customization & Bug Fixes'
                          />
                        </Grid>
                        <Grid item lg={2} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 2 } }}>
                          <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                            Cost
                          </Typography>
                          <CustomTextField
                            type='number'
                            placeholder='24'
                            defaultValue='24'
                            InputProps={{ inputProps: { min: 0 } }}
                          />
                          <Typography sx={{ mt: 3.5, mr: 2, color: 'text.secondary' }}>Discount:</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <Typography sx={{ mr: 2, color: 'text.secondary' }}>0%</Typography>
                            <Tooltip title='Tax 1' placement='top'>
                              <Typography sx={{ mr: 2, color: 'text.secondary' }}>0%</Typography>
                            </Tooltip>
                            <Tooltip title='Tax 2' placement='top'>
                              <Typography sx={{ color: 'text.secondary' }}>0%</Typography>
                            </Tooltip>
                          </Box>
                        </Grid>
                        <Grid item lg={2} md={2} xs={12} sx={{ px: 4, my: { lg: 0, xs: 2 } }}>
                          <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                            Hours
                          </Typography>
                          <CustomTextField
                            type='number'
                            placeholder='1'
                            defaultValue='1'
                            InputProps={{ inputProps: { min: 0 } }}
                          />
                        </Grid>
                        <Grid item lg={2} md={1} xs={12} sx={{ px: 4, my: { lg: 0 }, mt: 2 }}>
                          <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                            Price
                          </Typography>
                          <Typography sx={{ color: 'text.secondary' }}>$24.00</Typography>
                        </Grid>
                      </Grid>
                      <InvoiceAction>
                        <IconButton size='small' onClick={deleteForm}>
                          <Icon icon='tabler:x' fontSize='1.25rem' />
                        </IconButton>
                      </InvoiceAction>
                    </RepeatingContent>
                  </Grid>
                </Tag>
              )
            }}
          </Repeater>

          <Grid container sx={{ mt: 4 }}>
            <Grid item xs={12} sx={{ px: 0 }}>
              <Button variant='contained' onClick={() => setCount(count + 1)}>
                Add Item
              </Button>
            </Grid>
          </Grid>
        </RepeaterWrapper>

        <Divider />

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={7} lg={6} sx={{ order: { sm: 1, xs: 2 } }}>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant='body2' sx={{ mr: 2, fontWeight: 500, lineHeight: 'normal' }}>
                  Salesperson:
                </Typography>
                <CustomTextField fullWidth defaultValue='Tommy Shelby' />
              </Box>
              <CustomTextField fullWidth defaultValue='Thanks for your business' />
            </Grid>
            <Grid
              item
              xs={12}
              sm={5}
              lg={6}
              sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 }, display: 'flex', justifyContent: 'flex-end' }}
            >
              <Box sx={{ minWidth: 150, '& > *': { width: '100%' } }}>
                <CalcWrapper>
                  <Typography sx={{ color: 'text.secondary' }}>Subtotal:</Typography>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$1800</Typography>
                </CalcWrapper>
                <CalcWrapper>
                  <Typography sx={{ color: 'text.secondary' }}>Discount:</Typography>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$28</Typography>
                </CalcWrapper>
                <CalcWrapper sx={{ mb: '0 !important' }}>
                  <Typography sx={{ color: 'text.secondary' }}>Tax:</Typography>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>21%</Typography>
                </CalcWrapper>
                <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
                <CalcWrapper>
                  <Typography sx={{ color: 'text.secondary' }}>Total:</Typography>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$1690</Typography>
                </CalcWrapper>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ px: [6, 10] }}>
          <InputLabel
            htmlFor='invoice-note'
            sx={{ mb: 2, fontWeight: 500, fontSize: theme.typography.body2.fontSize, lineHeight: 'normal' }}
          >
            Note:
          </InputLabel>
          <CustomTextField
            rows={2}
            fullWidth
            multiline
            id='invoice-note'
            defaultValue='It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
          />
        </CardContent>
      </Card>
    )
  } else {
    return null
  }
}

export default EditCard
