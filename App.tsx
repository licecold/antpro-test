import React, { useState, useRef } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import ProCard from "@ant-design/pro-card";
import { Button, Form } from "antd";
import { ProFormField } from "@ant-design/pro-form";

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = new Array(5).fill(1).map((_, index) => {
  return {
    id: (Date.now() + index).toString(),
    title: `活动名称${index}`,
    decs: "这个活动真好玩",
    state: "open",
    created_at: "2020-05-26T09:42:56Z"
  };
});

export default () => {
  const [form] = Form.useForm();
  const editTableRef = useRef();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id)
  );
  const [dataSource, setDataSource] = useState<DataSourceType[]>(
    () => defaultData
  );

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "活动名称",
      dataIndex: "title",
      width: "30%",
      formItemProps: {
        validateFirst: "parallel",
        trigger: "onChange",
        // validateTrigger: ["onBlur"],
        rules: [
          {
            validator(rule, value, callback) {
              const [id, field] = rule.field.split(".");
              // setTimeout(() => {
              //     .then(() => {
              //       console.log("123321");
              //     })
              //     .catch((e) => {
              //       console.log("123");
              //       console.log(e);
              //     });
              // });
              if (!value) {
                callback("空");
              }
              if (
                dataSource
                  .filter((v) => v.id !== id)
                  .map((v) => v[field])
                  .includes(value)
              ) {
                callback("重复");
              }
              callback();
            }
            // validateTrigger: "onBlur"
          }
        ]
      }
    },
    {
      title: "状态",
      key: "state",
      dataIndex: "state",
      valueType: "select",
      valueEnum: {
        all: { text: "全部", status: "Default" },
        open: {
          text: "未解决",
          status: "Error"
        },
        closed: {
          text: "已解决",
          status: "Success"
        }
      }
    },
    {
      title: "描述",
      dataIndex: "decs"
    },
    {
      title: "操作",
      valueType: "option",
      width: 250,
      render: () => {
        return null;
      }
    }
  ];

  return (
    <>
      <EditableProTable<DataSourceType>
        editableFormRef={editTableRef}
        headerTitle="可编辑表格"
        columns={columns}
        rowKey="id"
        scroll={{
          x: 960
        }}
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={{
          newRecordType: "dataSource",
          record: () => ({
            id: Date.now()
          })
        }}
        toolBarRender={() => {
          return [
            <Button
              type="primary"
              key="save"
              onClick={() => {
                // dataSource 就是当前数据，可以调用 api 将其保存
                console.log(dataSource);
              }}
            >
              保存数据
            </Button>
          ];
        }}
        editable={{
          form: form,
          type: "multiple",
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList, c, d) => {
            const id = record.id;
            const ov = dataSource.find((v) => v.id === record.id);
            const field = Object.keys(ov).find(
              (key) => ov[key] !== record[key]
            );
            setDataSource(recordList);
            console.log(form.validateFields([id]));
            form.validateFields([field]);
          },
          onChange: setEditableRowKeys
        }}
      />
      <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: "100%"
            }
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
    </>
  );
};
