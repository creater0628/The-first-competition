# 三角洲行动 · AI 游戏资源与武器决策平台

> 传智杯 AI Web 大赛参赛作品
> 基于 Express + SQLite + 通义千问（qwen3.8-max-0902）构建的全链路 Web 应用

## 一、项目简介

本项目以《三角洲行动》为业务场景，实现了一个「前端页面 → Express 后端 → SQLite 数据库 + 通义千问大模型」完整闭环的 Web 应用，包含三大功能模块：

| 模块 | 说明 | 访问地址 |
|---|---|---|
| AI 资源生成器 | 游戏角色/场景/道具的资源描述生成入口 | `/game/templates/index.html` |
| 三角洲武器数据库 | 69 把武器的可视化查询墙，支持分类筛选、关键词搜索、9 种维度排序、详情弹窗 | `/game/templates/delta.html` |
| AI 指挥官助手 | 接入通义千问的对话式游戏顾问，绑定「天际港最高指挥官」人设 | `/game/templates/ai.html` |

## 二、技术栈

**后端**
- Node.js v24.22.1 / Express 4.22.3
- knex 3.3.0 + better-sqlite3 13.0.3（数据持久层）
- 原生 `fetch` 调用通义千问 OpenAI 兼容接口（零第三方 SDK 依赖）

**前端**
- 原生 HTML / CSS / JavaScript，无框架、无构建步骤
- 独立样式文件（`delta.css` / `ai.css`）与原有 `style.css` 解耦

**大模型**
- 阿里云百炼 · 通义千问 `qwen3.8-max-0902`
- OpenAI 兼容模式，业务空间专属域名接入

## 三、快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置密钥（必需）

在项目根目录新建 `.env` 文件：

```ini
# 阿里云百炼 API Key（控制台 -> API-KEY 管理 创建，形如 sk-xxxx）
DASHSCOPE_API_KEY=sk-你的密钥

# 模型名称（可选，默认 qwen-turbo）
# 注意：免费额度按模型独立发放，请到控制台「免费额度」页确认哪个模型有余额
QWEN_MODEL=qwen3.8-max-0902

# 接口地址（可选，默认使用业务空间专属域名）
# QWEN_BASE_URL=https://你的业务空间域名/compatible-mode/v1

PORT=3000
```

> ⚠️ `.env` 已被 `.gitignore` 排除，**切勿提交到代码仓库**。
> 申请入口：https://bailian.console.aliyun.com （华北2·北京地域）

### 3. 初始化数据库

启动一次服务即可自动建表（SQLite 数据库文件会自动生成于 `data/competition.db`）：

```bash
npm run dev
```

### 4. 灌入武器数据

```bash
npm run seed
```

### 5. 访问

启动服务后打开：

- 首页：http://localhost:3000/game/templates/index.html
- 武器库：http://localhost:3000/game/templates/delta.html
- AI 助手：http://localhost:3000/game/templates/ai.html

**可用脚本**

| 命令 | 说明 |
|---|---|
| `npm run dev` | 开发模式启动（入口 `app.js`，报错信息更直接） |
| `npm start` | 标准启动（入口 `bin/www`） |
| `npm run seed` | 灌入武器数据 |

两者均自动加载 `.env`（通过 `--env-file-if-exists`，缺失时仅提示不崩溃）。

### 6. 局域网访问（手机 / 其他电脑）

> ⚠️ **重要**：`localhost` 和 `127.0.0.1` 是**回环地址**，只在本机内部生效。
> 其他设备用这两个地址**永远访问不到**你的服务，必须改用本机的局域网 IP。

**第 1 步：确认服务绑定 `0.0.0.0`**

`app.js` 中应为：

```javascript
app.listen(3000, '0.0.0.0', () => {
    console.log('服务器运行在http://0.0.0.0:3000');
});
```

启动后验证绑定是否成功：

```bash
netstat -ano | findstr :3000
```

显示 `0.0.0.0:3000` 为正确；若显示 `127.0.0.1:3000` 则其他设备无法访问。

**第 2 步：查询本机局域网 IP**

```bash
ipconfig
```

找到当前联网适配器（无线网通常是 `WLAN`）下的「IPv4 地址」，形如 `10.63.223.19` 或 `192.168.1.5`。

**第 3 步：放通防火墙（最容易被忽略）**

Windows 防火墙默认**拦截** 3000 端口的入站连接。即使前两步都做对了，其他设备仍然打不开——这是最常见的失败原因。

以**管理员身份**打开命令行，执行：

```bash
netsh advfirewall firewall add rule name="Node 3000" dir=in action=allow protocol=TCP localport=3000
```

或走图形界面：控制面板 → Windows Defender 防火墙 → 高级设置 → 入站规则 → 新建规则 → 端口 → TCP 3000 → 允许连接。

**第 4 步：其他设备访问**

在同一局域网的设备（手机连同一个 Wi-Fi）浏览器输入：

```
http://<本机IP>:3000/game/templates/index.html
```

例如 `http://10.63.223.19:3000/game/templates/index.html`

**注意事项**

| 事项 | 说明 |
|---|---|
| 必须同一局域网 | 访问方与服务端需连接同一路由器 / 同一校园网 AP；跨网段（如一个连校园网、一个用手机流量）无法直连，需内网穿透工具 |
| IP 会变化 | 重连 Wi-Fi 或更换网络后 IP 可能改变，访问失败时先重新执行 `ipconfig` |
| 安全提醒 | 绑定 `0.0.0.0` 后局域网内任何设备都能访问，演示结束请及时 `Ctrl+C` 停止服务 |
| 仅需本机调试 | 可改回 `app.listen(3000, '127.0.0.1', ...)`，此时其他设备无法访问，更安全 |

## 四、API 接口

### 武器数据 `/api/delta`

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/delta/weapons` | 武器列表，支持 `?category=突击步枪`、`?sort=handling&order=desc`、`?limit=20` |
| GET | `/api/delta/weapons/:id` | 单把武器详情 |
| GET | `/api/delta/categories` | 分类及各类数量 |
| GET | `/api/delta/stats` | 概览统计（总数、分类数、操控性 TOP3） |

### AI 对话 `/api/ai`

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/ai/chat` | 请求体 `{"message":"..."}`，返回 `{"reply":"...","model":"...","retried":0}` |

### 简历模块 `/resumes`

标准 RESTful CRUD：`GET /`、`GET /:id`、`GET /search?name=`、`POST /`、`PUT /:id`、`DELETE /:id`

## 五、项目结构

```
02_onlineResumes/
├── app.js                    # Express 入口：中间件、静态托管、路由挂载
├── .env                      # 密钥配置（不提交）
├── package.json              # 依赖与启动脚本
├── bin/www                   # 标准启动脚本
├── routes/
│   ├── ai.js                 # 通义千问对话接口（含限流重试、错误翻译）
│   ├── delta.js              # 三角洲武器数据接口
│   ├── resumes.js            # 简历 CRUD
│   ├── users.js / index.js   # 脚手架原有路由
│   └── useMysql/index.js     # 数据持久层封装（knex + SQLite）
├── scripts/
│   └── seed_weapons.js       # 武器数据灌库脚本
├── data/
│   ├── weapons_data.json     # 69 把武器数据源（补数据改这里）
│   └── competition.db        # SQLite 数据库文件（自动生成，不提交）
├── public/
│   └── game/                 # 前端页面（由 Express 静态托管）
│       ├── templates/        # index / delta / ai / play 四个页面
│       └── static/css/       # style / delta / ai 三个样式文件
└── game_web/                 # 同伴原始前端存档（合并保留，当前未使用）
```

## 六、数据库设计

**weapons 表（18 字段）**

| 字段 | 类型 | 说明 |
|---|---|---|
| `weapon_id` | integer | 主键，自增 |
| `name` | varchar | 武器名称 |
| `category` | varchar | 分类（9 类） |
| `slug` | varchar | 英文标识 |
| `price` | integer | 游戏内价格 |
| `base_damage` | **varchar** | 基础伤害（霰弹枪为 `"14x8"` 形式，故用字符串） |
| `optimal_range` | integer | 最佳射程 |
| `recoil_control` | integer | 后坐力控制 |
| `handling` | integer | 操控性 |
| `stability` | integer | 稳定性 |
| `hip_fire_accuracy` | integer | 腰际射击精度 |
| `armor_damage` | **varchar** | 护甲伤害（同 base_damage） |
| `fire_rate` | **varchar** | 射速（AN94 为 `"600-1800"` 区间值） |
| `magazine_capacity` | integer | 弹匣容量 |
| `firing_mode` | varchar | 射击模式 |
| `bullet_velocity` | integer | 子弹初速（m/s） |
| `gunshot_sound_range` | integer | 枪声传播范围（m） |
| `reload_time` | float | 换弹时间（秒） |
| `created_at` | timestamp | 入库时间 |

另有 `resumes` / `education` / `professional` 三张表（脚手架原有）。

## 七、常见问题

**Q：启动报 `EADDRINUSE: address already in use :::3000`**
A：3000 端口被占用。找到并终止旧进程：
```bash
netstat -ano | findstr :3000     # 查 PID
taskkill /PID <PID> /F           # 终止
```

**Q：AI 接口返回 403 `AccessDenied.Unpurchased`**
A：该模型账号未开通/无免费额度。到控制台「免费额度」页查看哪些模型有余额，修改 `.env` 的 `QWEN_MODEL` 后重启。

**Q：AI 接口返回 429 / 503**
A：触发限流。后端已内置自动退避重试（3s/8s/15s 共 3 次），若仍失败请稍后再试。免费额度账号为动态限流，额度档位较低属正常现象。

**Q：页面打开正常但点按钮没反应 / 接口 404**
A：必须通过 `http://localhost:3000` 访问，**不能直接双击 HTML 文件**（`file://` 协议下相对路径请求会失效）。

**Q：想重置数据**
A：删除 `data/competition.db` → `npm run dev` 重建空表 → `npm run seed` 重新灌数据。

## 八、安全说明

- API Key 仅通过 `.env` 环境变量注入，代码中无任何硬编码密钥
- `.env`、`data/*.db`、`node_modules/`、`*.bak` 均已由 `.gitignore` 排除
- AI 回复统一使用 `textContent` 渲染（非 `innerHTML`），防止提示注入型 XSS
- 排序字段采用白名单校验，防止任意字段拼入查询

## 九、团队协作

本仓库由两人协作完成：

- **前端**：AI 资源生成器页面、游戏试玩页面（`front` 分支，9 个提交）
- **后端与集成**：数据持久层、武器数据接口、通义千问接入、武器墙与 AI 助手页面、前后端联通

提交历史完整保留双方记录。

## 十、许可

本项目为传智杯 AI Web 大赛参赛作品，仅供学习交流。
游戏《三角洲行动》相关内容版权归原厂商所有；武器数值来源于游戏内公开面板信息。
