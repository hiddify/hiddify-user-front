import React, { useEffect, useMemo, useState } from 'react';
import { Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import useAPI from '../../../hooks/useAPI';
import { Text } from '../../../designSystem/Text';
import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';
import ConfigModal from './components/ConfigModal';
import TableHeader from './components/TableHeader';

interface ConfigRow {
  name?: string;
  domain?: string;
  link?: string;
  protocol?: string;
  transport?: string;
  security?: string;
  type?: string;
  category?: 'subscription' | 'config' | string;
}

interface DataType {
  key: string;
  name: string;
  tags: (string | undefined)[];
  actionData: { link?: string; domain?: string; title?: string };
}

function isSubscription(item: ConfigRow): boolean {
  if (item.category === 'subscription') return true;
  if (item.category === 'config') return false;
  // Older API without category: full-sub rows use domain ALL / Wireguard / SSH.
  const d = (item.domain || '').toUpperCase();
  return d === 'ALL' || d === 'WIREGUARD' || d === 'SSH';
}

function rowSearchBlob(item: ConfigRow): string {
  return `${item?.name} ${item?.domain} ${item.protocol} ${item.transport} ${item.security} ${item.type}`;
}

const AllConfigs: React.FC = () => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [config, setConfig] = useState<{ link: string; domain: string; title: string } | undefined>();
  const [configs, setConfigs] = useState<ConfigRow[]>([]);
  const [search, setSearch] = useState<string | undefined>();

  const { t } = useTranslation();

  const getConfigs = useAPI('all-configs/', 'get', { reactQueryOptions: { enabled: true } });
  // react-query v3: isLoading = first fetch with no data; isFetching covers that + refetch.
  const loading = Boolean(getConfigs.isLoading || getConfigs.isFetching);
  const hasLoaded = Boolean(getConfigs.isFetched || getConfigs.isSuccess || getConfigs.isError || getConfigs.data);

  useEffect(() => {
    setConfigs(Array.isArray(getConfigs.data) ? getConfigs.data : []);
  }, [getConfigs.data]);

  useEffect(() => {
    const raw: ConfigRow[] = Array.isArray(getConfigs.data) ? getConfigs.data : [];
    if (search) {
      const regex = new RegExp(search, 'i');
      setConfigs(raw.filter((item) => regex.test(rowSearchBlob(item))));
    } else {
      setConfigs(raw);
    }
  }, [search, getConfigs.data]);

  const subscriptions = useMemo(() => configs.filter(isSubscription), [configs]);
  const individuals = useMemo(() => configs.filter((item) => !isSubscription(item)), [configs]);

  const GetLinkBtn = styled(Button)<ButtonProps>(() => ({
    color: 'white',
    backgroundColor: '#455FE9',
    border: '1px solid #455FE9',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'blue',
    },
  }));

  const columns: ColumnsType<DataType> = [
    {
      title: (
        <Text fontSize="lg" fontWeight="black">
          {t('Name')}
        </Text>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Text fontSize="sm" fontWeight="regular" className="text-[#6C757D] whitespace-nowrap">
          {name}
        </Text>
      ),
    },
    {
      title: (
        <Text fontSize="lg" fontWeight="black">
          {t('Tags')}
        </Text>
      ),
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: (string | undefined)[]) => (
        <div className="flex items-center justify-start gap-1">
          {tags.map((item, i) =>
            item ? (
              <div key={`${item}-${i}`} className="border border-solid border-blue-500 px-2 py-1 rounded-md w-fit h-fit">
                <Text fontSize="sm" fontWeight="regular" lineClamp="1" className="whitespace-nowrap">
                  {item}
                </Text>
              </div>
            ) : null,
          )}
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'actionData',
      key: 'actionData',
      render: (actionData) => (
        <div className="flex items-center justify-center gap-5">
          <GetLinkBtn
            style={{ textTransform: 'none', fontFamily: 'var(--ui-font)' }}
            onClick={() => {
              setConfig({ link: actionData?.link || '', domain: actionData?.domain || '', title: actionData.title || '' });
              setShowConfigModal(true);
            }}
          >
            <Text fontSize="sm" fontWeight="regular" className="text-white whitespace-nowrap">
              {t('Get Link')}
            </Text>
          </GetLinkBtn>
        </div>
      ),
    },
  ];

  const toRows = (list: ConfigRow[], keyPrefix: string): DataType[] =>
    list.map((item, index) => ({
      key: `${keyPrefix}-${index}`,
      name: item.name || '',
      actionData: {
        link: item?.link,
        domain: item?.domain,
        title: item?.name,
      },
      tags: [item.domain, item.security, item.transport, item.protocol, item.type],
    }));

  const openRow = (record: DataType) => {
    setConfig({
      link: record.actionData?.link || '',
      domain: record.actionData?.domain || '',
      title: record.actionData?.title || '',
    });
    setShowConfigModal(true);
  };

  const renderSection = (title: string, list: ConfigRow[], keyPrefix: string) => {
    if (!list.length) return null;
    return (
      <div className="mb-8">
        <Text fontSize="lg" fontWeight="medium" className="mb-3 block text-[#343A40]">
          {title} {`(${list.length})`}
        </Text>
        <Table
          pagination={false}
          scroll={{ x: true }}
          columns={columns}
          onRow={(record) => ({
            onClick: () => openRow(record),
          })}
          dataSource={toRows(list, keyPrefix)}
        />
      </div>
    );
  };

  return (
    <div className="h-full px-5 md:p-0 flex flex-col">
      <TableHeader search={search} setSearch={setSearch} configsCount={configs.length} loading={loading && !configs.length} />
      <section className="overflow-auto min-h-[12rem]">
        <Spin
          spinning={loading}
          tip={
            <Text fontSize="sm" fontWeight="regular" className="text-[#6C757D]">
              {t('Loading configurations')}
            </Text>
          }
        >
          <div className={loading && !configs.length ? 'min-h-[12rem]' : undefined}>
            {!loading || configs.length ? (
              <>
                {renderSection(t('Subscription Links'), subscriptions, 'sub')}
                {renderSection(t('Individual Configs'), individuals, 'cfg')}
              </>
            ) : null}
            {hasLoaded && !loading && !configs.length ? (
              <Text fontSize="sm" fontWeight="regular" className="text-[#6C757D]">
                {t('No configurations')}
              </Text>
            ) : null}
          </div>
        </Spin>
      </section>
      <ConfigModal
        closeModal={() => setShowConfigModal(false)}
        open={showConfigModal}
        domain={config?.domain ? config?.domain : ''}
        link={config?.link ? config?.link : ''}
        title={config?.title ? config.title : ''}
      />
    </div>
  );
};

export default AllConfigs;
