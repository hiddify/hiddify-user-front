import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Text } from '../../../designSystem/Text';
import useAPI from '../../../hooks/useAPI';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Button, ButtonProps, styled } from '@mui/material';
import ConfigModal from './components/ConfigModal';
import { useEffect, useState } from 'react';
import TableHeader from './components/TableHeader';
import { useTranslation } from 'react-i18next';
  
const AllConfigs = () => {
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [config, setConfig] = useState<{link: string; domain: string} | undefined>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [configs, setConfigs] = useState<any>([])
    const [search, setSearch] = useState<string | undefined>()

    const { t, i18n: { language } } = useTranslation();

    const getConfigs = useAPI(
        'all-configs/',
        'GET',
        { reactQueryOptions: { enabled: true } }
      );


    useEffect(() => {
        if (getConfigs.data && getConfigs.data?.length){
            setConfigs(getConfigs.data)
        }else {
            setConfigs([])
        }
        
    }, [getConfigs.data])

    function isPatternMatch(str, pattern) {
        const regex = new RegExp(pattern, 'i'); // 'i' flag for case-insensitive matching
        return regex.test(str);
    }

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newConfigs: any = []
        if (search && getConfigs.data && getConfigs.data?.length){
            for(const item of getConfigs.data) {
                if(isPatternMatch(`${item?.name} ${item?.domain} ${item.protocol} ${item.transport} ${item.security} ${item.type}`, search)){
                    newConfigs.push(item)
                }
            }

            setConfigs(newConfigs)
        }else {
            if(getConfigs.data && getConfigs.data.length){
                setConfigs(getConfigs.data)
            }else{
                setConfigs([])
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])
    const GetLinkBtn = styled(Button)<ButtonProps>(() => ({
        color: 'white',
        backgroundColor: '#455FE9',
        border: '1px solid #455FE9',
        borderRadius: '8px',
        "&:hover": {
            backgroundColor: 'blue'
        }
    }));
    
      
  return (
    <div className='w-full h-full px-5'>
        <TableHeader search={search} setSearch={setSearch} configsCount={configs.length} />
        <div className='w-full h-[calc(100vh-290px)] sm:h-[calc(100vh-230px)] md:h-[calc(100vh-230px)] overflow-auto'>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="sticky table">
                    {getConfigs.data ? 
                    <>
                        <TableHead>
                            <TableRow>
                                <TableCell align={language === "fa" ? 'right' : 'left'}>
                                    <Text fontSize='base' fontWeight='medium' className='whitespace-nowrap' lineClamp='1'>{t('Name')}</Text>
                                </TableCell>
                                <TableCell align={language === "fa" ? 'right' : 'left'}>
                                    <Text fontSize='base' fontWeight='medium' className='whitespace-nowrap' lineClamp='1'>{t('Domain')}</Text>
                                </TableCell>
                                <TableCell align={language === "fa" ? 'right' : 'left'}>
                                    <Text fontSize='base' fontWeight='medium' className='whitespace-nowrap' lineClamp='1'>{t('Tags')}</Text>
                                </TableCell>
                                <TableCell align={language === "fa" ? 'right' : 'left'}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ maxHeight: "50%"}}>
                            {configs?.map((row) => (
                                <TableRow
                                    key={row.name}
                                    onClick={() => {setConfig({link: row?.link || '', domain: row?.domain || ''}); setShowConfigModal(true)}}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align={language === "fa" ? 'right' : 'left'}>
                                        <Text fontSize='sm' fontWeight='regular' className='whitespace-nowrap' lineClamp='1'>{row?.name}</Text>
                                    </TableCell>
                                    <TableCell align={language === "fa" ? 'right' : 'left'}>
                                        <Text fontSize='sm' fontWeight='regular' lineClamp='1' className='whitespace-nowrap text-[#6C757D]'>{row?.domain}</Text>
                                    </TableCell>
                                    <TableCell align={language === "fa" ? 'right' : 'left'}>
                                        <div className='flex items-center gap-2'>
                                            {(row?.protocol &&  row?.protocol != '') && 
                                                <div className='border border-solid border-blue-500 px-2 py-1 rounded-md w-fit h-fit'>
                                                    <Text fontSize='sm' fontWeight='regular' lineClamp='1' className='whitespace-nowrap'>
                                                        {row.protocol}
                                                    </Text>
                                                </div>
                                            }
                                            {(row?.transport &&  row?.transport != '') && 
                                                <div className='border border-solid border-blue-500 px-2 py-1 rounded-md w-fit h-fit'>
                                                    <Text fontSize='sm' fontWeight='regular' lineClamp='1' className='whitespace-nowrap'>
                                                        {row.transport}
                                                    </Text>
                                                </div>
                                            }
                                            {(row?.security &&  row?.security != '') && 
                                                <div className='border border-solid border-blue-500 px-2 py-1 rounded-md w-fit h-fit'>
                                                    <Text fontSize='sm' fontWeight='regular' lineClamp='1' className='whitespace-nowrap'>
                                                        {row.security}
                                                    </Text>
                                                </div>
                                            }
                                            {(row?.type &&  row?.type != '') && 
                                                <div className='border border-solid border-blue-500 px-2 py-1 rounded-md w-fit h-fit'>
                                                    <Text fontSize='sm' fontWeight='regular' lineClamp='1' className='whitespace-nowrap'>
                                                        {row.type}
                                                    </Text>
                                                </div>
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell align={language === "fa" ? 'right' : 'left'}>
                                        <div className='flex items-center justify-center gap-5'>
                                            <GetLinkBtn style={{ textTransform: 'none'}} onClick={() => {setConfig({link: row?.link || '', domain: row?.domain || ''}); setShowConfigModal(true)}}>
                                                <Text fontSize='sm' fontWeight='regular' className='text-white whitespace-nowrap'>{t('Get Link')}</Text>
                                            </GetLinkBtn>
                                        </div>  
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </>
                    :
                    <Box className='flex items-center justify-center p-20 w-full h-full'>
                        <CircularProgress />
                    </Box>
                    }
                </Table>
            </TableContainer>
        </div>
        <ConfigModal 
            closeModal={() => setShowConfigModal(false)} 
            open={showConfigModal} 
            domain={config?.domain ? config?.domain : ''}
            link={config?.link ? config?.link : ''}
        />
    </div>
  );
}

export default AllConfigs;
