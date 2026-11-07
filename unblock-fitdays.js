/*************************************
Fitdays · AFU-WL-TZ 系列解锁

功能：
1. getConfigs: 去掉 bluetooth_block_list 里的 AFU-WL-TZ 条目，让秤能被搜到
2. device/bind: 把 name 从 AFU-WL-TZ-A1 换成服务器认识的 FG2313UWB-D

[rewrite_local]
^https:\/\/online-us\.fitdays\.cn\/api\/device\/getConfigs url script-response-body https://raw.githubusercontent.com/Riptide3/qx/main/unblock-fitdays.js
^https:\/\/online\.fitdays\.cn\/api\/device\/getConfigs url script-response-body https://raw.githubusercontent.com/Riptide3/qx/main/unblock-fitdays.js
^https:\/\/online-us\.fitdays\.cn\/api\/device\/bind url script-request-body https://raw.githubusercontent.com/Riptide3/qx/main/unblock-fitdays.js
^https:\/\/online\.fitdays\.cn\/api\/device\/bind url script-request-body https://raw.githubusercontent.com/Riptide3/qx/main/unblock-fitdays.js

[mitm]
hostname = online-us.fitdays.cn, online.fitdays.cn
*************************************/

var url = $request ? $request.url : '';

// ======= 处理 getConfigs 响应 =======
if (typeof $response !== 'undefined' && url.indexOf('getConfigs') !== -1) {
  try {
    var bd = JSON.parse($response.body);
    if (bd.data && bd.data.bluetooth_block_list) {
      bd.data.bluetooth_block_list = bd.data.bluetooth_block_list.filter(function(item) {
        return !item.startsWith('AFU-WL-TZ');
      });
    }
    $done({ body: JSON.stringify(bd) });
  } catch (e) {
    $done({});
  }
  return;
}

// 处理 device/bind 请求 —— 把 name 从 AFU-WL-TZ-* 换成 model
if ($request && url.indexOf('device/bind') !== -1) {
  try {
    var req = JSON.parse($request.body);
    if (req.name && req.name.indexOf('AFU-WL-TZ') === 0) {
      req.name = req.model || 'FG2421LB';
    }
    $done({ body: JSON.stringify(req) });
  } catch (e) {
    $done({});
  }
  return;
}

// 其他请求原样放过
if ($request) {
  $done({});
} else {
  $done({});
}
