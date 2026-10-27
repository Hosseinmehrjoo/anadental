# original vs clone · 克隆评估报告

## 结论
- 原站 URL: https://arameshdental.com/
- 克隆 URL: http://127.0.0.1:8124/
- 自动推断复杂度: L6
- 复刻模式建议: 展示层视觉复刻
- 自动报告边界: 结构、数量、框架、console 可自动比；传入 visual-diff 后可纳入像素差异分。内容残留和法务仍需审计。

## 技术信号
| 项目 | 原站 | 克隆站 |
|---|---|---|
| title | کاشت تخصصی ایمپلنت دندان در تهران | مرکز ایمپلنت آرامش | کاشت تخصصی ایمپلنت دندان در تهران | مرکز ایمپلنت آرامش |
| lang | fa-IR | fa-IR |
| frameworks | none | none |
| scrollHeight | 10469 | 10469 |
| h1 | مرکز تخصصی ایمپلنت دندان در تهران | مرکز تخصصی ایمپلنت دندان در تهران |

## 数量对比
| 指标 | 原站 | 克隆站 | 自动评分 |
|---|---:|---:|---:|
| sections | 27 | 27 | 5/5 |
| links | 71 | 71 | 5/5 |
| images | 41 | 41 | 5/5 |
| video | 1 | 1 | 5/5 |
| canvas | 0 | 0 | 5/5 |
| forms | 3 | 3 | 5/5 |
| buttons | 13 | 13 | 5/5 |
| inputs | 23 | 23 | 5/5 |
| interactive | 114 | 114 | 5/5 |
| scripts | 12 | 11 | 5/5 |

## 复刻评分
- 源证据: 3/5
- 结构保真: 5/5
- 视觉保真: 3/5
- 动效/交互: 5/5
- 响应式: 4/5
- 功能完整: 5/5
- 内容替换: 需人工看文案残留
- 法务/部署风险: 需人工核查 license / 素材

## Console
- 原站 console errors: 0
- 克隆 console errors: 0
- 原站 page errors: 0
- 克隆 page errors: 0

## 路由覆盖
- 未提供 route-crawl 结果。多页面站需要传 --original-routes / --clone-routes。


## 交互覆盖
- 未提供 interaction-probe 结果。交互站需要传 --original-interactions / --clone-interactions。


## 截图证据
- 原站侦察: RECON/original-recon.json
- 克隆侦察: RECON/clone-recon.json
- 像素差异: RECON/visual-diff-1440.json
- 像素差异率: 0.09051034270491716
- 原站截图: screenshots/original-1440.png, screenshots/original-768.png, screenshots/original-390.png
- 克隆截图: screenshots/clone-1440.png, screenshots/clone-768.png, screenshots/clone-390.png

## 已知缺口
- 未传入 visual-diff 时，视觉保真需要打开截图人工确认。
- 法务、素材授权、品牌替换完整度需要人工核查。
