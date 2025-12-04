---
title: Dev
---



launch :`nom run dev`

If say not using correct Next.js version:
`nvm install 20`
- switch to the correct version: `nvm use 20`


## folder:
public: static resources
.next : where next.js compiled output
node_modules: all dependencies
src/app: app router's core area
- layout.tsx:  shared layout across whole site
- page.tsx: main page
package.json: define dependencies, like the name of the project, npm script



One microservice:
For sticker
~~avatar service? (avatar action, skin, color etc)~~


run wrangler / cloudflare worker
wrangler login
wrangler dev --remote










Durable :
db: stickers
 - Cloudflare D1 / Postgres
- Sticker CRUD
- Room metadata
    实现 REST API：
- `GET /rooms/:id/messages`
- `POST /rooms/:id/stickers`
- `DELETE /stickers/:id`

Have to use websocket because: 
real time communication and low-latency broadcast

这是非常典型的后端功能。

**Feature 3: 多人同步系统**

- Task: 创建 WebSocket 后端
- Task: 实现 join/leave 协议
- Task: 实现 move 广播
- Task: 断线移除
- Asset: 后端脚本
    

**Feature 4: 贴纸系统**

- Task: Raycast 检测墙面
- Task: 新建 sticker mesh
- Task: 发/收 addSticker 消息
- Asset: sticker PNG
    
**Feature 5: 房间系统（可选）**
- Task: URL-based room
- Task: Room list API
# 🟦 **Sprint 2 — 实时同步（WebSocket）**（第 2 周）

**目标：实现多人同步，多个 tab 打开可以看到多个小人移动。**

### 🎯 产出（可 Demo）

- 打开两个浏览器 → 两个小人
    
- 任意一个移动，另一个能实时看到
    
- 关闭 tab → 小人消失
    

### 📌 任务拆分

#### Backend（Cloudflare Workers / Node.js）

- 创建 WebSocket 后端
    

- 生成 playerId
    

- 房间状态存储（in-memory / Durable Object）
    

- 消息协议设计（JSON）
    
    - `join`
        
    - `leave`
        
    - `move`
        
    - `initState`
        

- 每次 `move` 广播给其他用户
    

- 断线检测并广播 `removePlayer`
    

#### Frontend

- WebSocket 连接
    

- 页面加载后发送 `join`
    

- 每帧发送 `move`
    

- 收到他人 `move` → 更新小人位置
    

- 动态创建/删除 avatars
    

---

# 🟦 **Sprint 3 — Sticker / 符号系统（协作功能）**（第 3 周）

**目标：可以对场景中的“墙”做交互，添加贴纸并同步给所有用户。**

### 🎯 产出（可 Demo）

- 点击墙壁 → 添加一个贴纸
    
- 所有人看到相同贴纸
    
- 新加入的人也看到贴纸（状态持久化）
    
- 贴纸数据保存在服务器状态里
    

### 📌 任务拆分

#### Backend

- 后端增加 sticker 数组存储
    

- `addSticker` 消息协议
    

- 广播 sticker updates
    

- 新加入用户时发送 sticker 列表
    

#### Frontend

- Raycaster 点击墙
    

- 添加 plane mesh 作 sticker
    

- 支持 basic texture（png/jpg）
    

- 点击上传贴纸
    

- 同步贴纸（从后端收到 update 时渲染）
    

---

# 🟦 **Sprint 4 — 项目完善 & 分布式扩展（可选）**（第 4 周）

**目标：让项目看起来像一个真正完整的系统。**

### 🎯 产出（可 Demo + 可展示 + 可写进简历）**

- 房间列表页面
    
- 每个 URL = 不同房间
    
- 小人动画（走路）
    
- AI 自动贴纸（可选）
    
- 可部署（Vercel + Cloudflare Workers）
    

### 📌 任务拆分

#### Backend 扩展（可选）

- 多房间（URL-based roomId）
    

- 持久化 store（KV / Durable Object Storage）
    

- Room Sharding（分布式系统核心）
    

- 第三方 AI API（例如 根据文字生成 sticker）
    

#### Frontend 扩展

- Avatar 动画（Mixamo）
    

- 左侧 UI（贴纸菜单）
    

- 用户列表显示
    

房间选择页面（Next.js 路由）