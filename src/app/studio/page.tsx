'use client';

import React from 'react';
import EntityList from '@/components/entity-list';
import GenericModifyModal from '@/components/generic-modify-modal';
import StudioCard from '@/components/studio/studioCard';
import { Studio } from '@/types/studio';
import { message, Modal } from 'antd';
import { useTranslation } from '@/utils/i18n';
import useApiClient from '@/utils/request';
import useGroups from '@/hooks/useGroups';

const StudioPage: React.FC = () => {
  const { t } = useTranslation();
  const { del } = useApiClient();
  const { groups, loading } = useGroups();

  const beforeDelete = (studio: Studio, deleteCallback: () => void) => {
    if (studio.online) {
      Modal.confirm({
        title: t('studio.offDeleteConfirm'),
        okText: t('studio.offAndDel'),
        onOk: async () => {
          await deleteBot(studio);
          deleteCallback();
        },
      });
    } else {
      Modal.confirm({
        title: t('studio.deleteConfirm'),
        onOk: async () => {
          await deleteBot(studio);
          deleteCallback();
        },
      });
    }
  };

  const deleteBot = async (studio: Studio) => {
    try {
      await del(`/bot_mgmt/bot/${studio.id}/`);
      message.success(t('common.delSuccess'));
    } catch (error) {
      message.error(t('common.delFailed'));
    }
  };

  const initStudioForm = (form: any, groups: any) => {
    if (groups.length > 0) {
      form.setFieldsValue({ team: [groups[0].id] });
    }
  };

  return (
    <EntityList<Studio>
      endpoint="/bot_mgmt/bot/"
      CardComponent={StudioCard}
      ModifyModalComponent={(props) => (
        <GenericModifyModal
          {...props}
          formType="studio"
          initForm={initStudioForm}
          groups={groups}
          loading={loading}
        />
      )}
      itemType="studios"
      itemTypeSingle="studio"
      beforeDelete={beforeDelete}
    />
  );
};

export default StudioPage;