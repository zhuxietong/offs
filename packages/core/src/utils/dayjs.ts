/**
 * @description $DESC$
 * @author 朱撷潼
 * @date: 2024/5/14
 * @copyright
 */

import dayjs from 'dayjs';

/** 时间显示方法，处理今天，明天，时间为今年时把年隐藏 */

export interface DayjsType {
  // eslint-disable-next-line no-unused-vars
  prettyTime: (time: string, type: 'cn' | 'en') => string;
  prettyDay: (time: string, type: 'cn' | 'en') => string;
  format: (time: string, format: string) => string;
}

const Dayjs: DayjsType = {
  prettyTime: (time: string, type: 'cn' | 'en' = 'cn') => {
    if (!time) {
      return '';
    }
    if (time.length < 11) {
      time = time + '000';
    }
    const dayFormat = type === 'cn' ? 'YYYY年MM月DD日' : 'YYYY-MM-DD';
    const thisYearDayFormat = type === 'cn' ? 'MM月DD日' : 'MM-DD';

    const d = /^\d+$/.test(`${time}`) ? dayjs(parseInt(`${time}`)) : dayjs(time);
    const today = dayjs().format(dayFormat);
    const yesterday = dayjs().subtract(1, 'day').format(dayFormat);
    if (today === d.format(dayFormat)) {
      return '今天 ' + d.format('HH:mm');
    }
    if (yesterday === d.format(dayFormat)) {
      return '昨天 ' + d.format('HH:mm');
    }
    const thisYear = dayjs().year();
    if (thisYear === d.year()) {
      return d.format(`${thisYearDayFormat} HH:mm`);
    }
    return d.format(`${dayFormat} HH:mm`);
  },
  prettyDay: (time: string, type: 'cn' | 'en' = 'cn') => {
    if (!time) {
      return '';
    }
    if (time.length < 11) {
      time = time + '000';
    }
    const dayFormat = type === 'cn' ? 'YYYY年MM月DD日' : 'YYYY-MM-DD';
    const thisYearDayFormat = type === 'cn' ? 'MM月DD日' : 'MM-DD';

    const d = /^\d+$/.test(`${time}`) ? dayjs(parseInt(`${time}`)) : dayjs(time);
    const today = dayjs().format(dayFormat);
    const yesterday = dayjs().subtract(1, 'day').format(dayFormat);
    if (today === d.format(dayFormat)) {
      return '今天 ';
    }
    if (yesterday === d.format(dayFormat)) {
      return '昨天 ';
    }
    const thisYear = dayjs().year();
    if (thisYear === d.year()) {
      return d.format(`${thisYearDayFormat}`);
    }
    return d.format(`${dayFormat}`);
  },
  format: (time: any, format: string) => {
    if (!time) {
      return '';
    }
    let t = `${time}`;
    if (t.length < 11) {
      t = t + '000';
    }
    const d = /^\d+$/.test(`${t}`) ? dayjs(parseInt(`${t}`)) : dayjs(t);
    return d.format(`${format || 'YYYY-MM-DD HH:mm'}`);
  },
};

export { Dayjs }