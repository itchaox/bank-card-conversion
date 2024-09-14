/*
 * @Version    : v1.00
 * @Author     : Wang Chao
 * @Date       : 2024-08-18 09:52
 * @LastAuthor : Wang Chao
 * @LastTime   : 2024-09-14 11:15
 * @desc       :
 */
// FIXME 银行卡号解析

import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';
import { searchCardBin } from 'bankcard';

const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['api.exchangerate-api.com']);

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        source: '选择待解析的字段',
        p1: '请选择文本类型字段',
        bankName: '银行名字',
        cardType: '卡种',
      },
      'en-US': {
        source: 'Select the field to convert',
        p1: 'Please select a text field.',
        bankName: 'Bank Name',
        cardType: 'Card Type',
      },
      'ja-JP': {
        source: '変換するフィールドを選択',
        p1: 'テキストタイプのフィールドを選択',
        bankName: '銀行名',
        cardType: 'カード種別',
      },
    },
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'source',
      label: t('source'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
        placeholder: t('p1'),
      },
      validator: {
        required: true,
      },
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light:
          'https://lf3-static.bytednsdoc.com/obj/eden-cn/abjayvoz/ljhwZthlaukjlkulzlp/2024H2/yinhangka.png?x-resource-account=public',
      },
      properties: [
        {
          key: 'bankName',
          primary: true,
          isGroupByKey: true,
          type: FieldType.Text,
          title: t('bankName'),
        },
        {
          key: 'cardType',
          type: FieldType.Text,
          title: t('cardType'),
        },
      ],
    },
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { source: { type: string; text: string }[] }) => {
    const { source } = formItemParams;

    // 数字类型 source 直接为值
    //  文本类型 source 为 [{ type: 'text , text '8'}]
    const sourceValue = Array.isArray(source) && source.length > 0 && source[0].text.split(' ').join('');
    const res = await searchCardBin(sourceValue as string);

    try {
      return {
        code: FieldCode.Success,
        data: {
          bankName: res.bankName,
          cardType: res.cardTypeName,
        },
      };
    } catch (e) {
      return {
        code: FieldCode.Error,
      };
    }
  },
});
export default basekit;
