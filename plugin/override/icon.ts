export const IconMap = {
  delete: '&#xe604;',
  addFill: '&#xe606;',
  next: '&#xe608;',
  location: '&#xe607;',
  down_file: '&#xe60a;',
  down_indicator: '&#xe60b;',
  back: '&#xe602;',
  load_error: '&#xe61b;',
  check_box_unselected: '&#xe61c;',
  check_box_selected: '&#xe61d;',
  check_radio_unselected: '&#xe61e;',
  check_radio_dot: '&#xe61f;',
  check_radio_selected: '&#xe620;',
  edit_slider: '&#xe624;',
  edit_mid: '&#xe623;',
  edit_border: '&#xe622;',
  back_border: '&#xe621;',
  avatar: '&#xe625;',
  star: '&#xe627;',
  star_line: '&#xe626;',
  calendar: '&#xe628;',
  search: '&#xe629;',
  home: '&#xe62b;',
  users: '&#xe62a;',
  contact: '&#xe62c;',
  delete_fill: '&#xe62d;',
  camera_fill: '&#xe630;',
  camera: '&#xe631;',
  photo: '&#xe62e;',
  photo_fill: '&#xe62f;',
  show_toggle: '&#xe632;',
  scan_code: '&#xe633;',
  more_round: '&#xe635;',
  more_dot: '&#xe636;',
  mobile: '&#xe638;',
  star_border: '&#xe63a;',
  star_fill: '&#xe639;',
  server_device: '&#xe63f;',
  camera_device: '&#xe640;',
  camera_device_down: '&#xe641;',
  direction_line: '&#xe645;',
  building: '&#xe643;',
  school: '&#xe642;',
  time_fill: '&#xe646;',
  time_border: '&#xe647;',
  fill_before: '&#xe65c;',
  fill_next: '&#xe65d;',
  exist_thin: '&#xe65f;',
  switch_arrow: '&#xe662;',
  switch_line: '&#xe661;',
  qr_code: '&#xe668;',
};

export type IconName = keyof typeof IconMap;

export function randomIcon(): IconName {
  const keys = Object.keys(IconMap);
  const n = Math.floor(Math.random() * keys.length);
  return <IconName>keys[n];
}

export function indexIcon(i: number): IconName {
  const keys = Object.keys(IconMap);
  let index = i;
  if (index >= keys.length) {
    index = keys.length % index;
  }
  return <IconName>keys[index];
}

function colorFor(i?: number): string {
  const colors = [
    '#c52b2b',
    '#2b6ec5',
    '#1c8a53',
    '#3273ee',
    '#7b4ac7',
    '#494d73',
    '#494d73',
    '#9f1553',
  ];
  if (i == undefined) {
    const n = Math.floor(colors.length);
    return colors[n];
  }
  let index = i;
  if (index >= colors.length) {
    index = colors.length % index;
  }
  return colors[index];
}

export function iconsFor(num: number, source?: string[]) {
  const names: string[] = [
    '设备',
    '工具',
    '运行',
    '首页',
    '消息',
    '设置',
    '安全',
    '推送',
    '文件',
    '应用',
    '收藏',
    '管理',
    '资料',
    '关于App',
    '意见反馈',
    '客服',
    '分享',
    '课堂',
    '更多',
    '监控',
    '通讯录',
    '扫描',
  ];
  const arr = source || names;
  // @ts-ignore
  const sets: _Icon[] = [];
  const count = arr.length;

  for (let i = 0; i < num; i++) {
    let index = i;
    if (i >= count) {
      index = i % count;
    }

    sets.push({name: arr[index], icon: indexIcon(i), color: colorFor(i), index: i});
  }
  return sets;
}
