import React, { useEffect, useState } from 'react';
import { Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import useAPI from '../../../hooks/useAPI';
import { Text } from '../../../designSystem/Text';
import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';
import ConfigModal from './components/ConfigModal';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TableHeader from './components/TableHeader';


interface DataType {
  key: string;
  name: string | undefined;
  domain: string | undefined;
  tags: string[] | undefined;
}



const AllConfigs: React.FC = () => {
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [config, setConfig] = useState<{link: string; domain: string} | undefined>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [configs, setConfigs] = useState<any>([])
    const [search, setSearch] = useState<string | undefined>()

    const { t, i18n: { language } } = useTranslation();

    const getConfigs = useAPI(
        'all-configs/',
        'get',
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

    const columns: ColumnsType<DataType> = [
        {
          title: <Text fontSize='lg' fontWeight='black'>{t('Name')}</Text>,
          dataIndex: 'name',
          key: 'name',
          render: (name) => <Text fontSize='sm' fontWeight='regular' lineClamp='1' className='max-w-[200px] text-[#6C757D]'>{name}</Text>,
        },
        {
          title: <Text fontSize='lg' fontWeight='black'>{t('Domain')}</Text>,
          dataIndex: 'domain',
          key: 'domain',
          render: (domain) => <Text fontSize='sm' fontWeight='regular' lineClamp='1' className='max-w-[200px] text-[#6C757D]'>{domain}</Text>,
        },
        {
          title: <Text fontSize='lg' fontWeight='black'>{t('Tags')}</Text>,
          key: 'tags',
          dataIndex: 'tags',
          render: (tags) => (
            <div className='flex items-center justify-start gap-1'>
                {tags.map(item => (
                item && (
                    <div className='border border-solid border-blue-500 px-2 py-1 rounded-md w-fit h-fit'>
                        <Text fontSize='sm' fontWeight='regular' lineClamp='1' className='whitespace-nowrap'>
                            {item}
                        </Text>
                    </div>
                )
              ))}
            </div>
          ),
        },
        {
          title: '',
          dataIndex: 'actionData',
          key: 'actionData',
          render: (actionData) => (
              <div className='flex items-center justify-center gap-5'>
                  <GetLinkBtn style={{ textTransform: 'none', fontFamily: "Vazirmatn, sans-serif"}} onClick={() => {setConfig({link: actionData?.link || '', domain: actionData?.domain || ''}); setShowConfigModal(true)}}>
                      <Text fontSize='sm' fontWeight='regular' className='text-white whitespace-nowrap'>{t('Get Link')}</Text>
                  </GetLinkBtn>
              </div>  
          ),
        },
      ];


    return( 
        <div className='h-full px-5 md:p-0 flex flex-col'>
            <TableHeader search={search} setSearch={setSearch} configsCount={configs.length} />
            <section className='overflow-auto'>
                <Spin spinning={getConfigs.isLoading || getConfigs.isRefetching}>
                    <Table 
                        pagination={false} 
                        scroll={{ x: true }}
                        columns={columns} 
                        dataSource={configs ? configs.map((item, index) => ({
                            key: index,
                            name: item.name ? item.name : '',
                            domain: item.link ? item.link : '',
                            actionData: {link: item.link, domain: item.domain},
                            tags: [
                                item.security ? item.security : undefined,
                                item.transport ? item.transport : undefined,
                                item.protocol ? item.protocol : undefined,
                                item.type ? item.type : undefined
                            ]
                        })) : []} 
                    />
                </Spin>
            </section>
            <ConfigModal 
                closeModal={() => setShowConfigModal(false)} 
                open={showConfigModal} 
                domain={config?.domain ? config?.domain : ''}
                link={config?.link ? config?.link : ''}
            />
        </div>
    )
};

export default AllConfigs;
