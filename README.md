# Agent Platform UI

Agent Platform 的独立前端项目，使用 Vue 3、TypeScript 和 Vite 构建。

## 技术栈

- Vue 3 + Composition API
- TypeScript
- Vite
- Vue Router
- Pinia
- Element Plus
- Axios
- ESLint + Prettier

## 环境要求

- Node.js 20.19+ 或 22.12+
- pnpm 10.15.1

## 安装依赖

```sh
pnpm install
```

## 启动开发环境

```sh
pnpm dev
```

开发服务器默认运行在 `http://localhost:5173`，`/api` 请求会代理到后端 `http://localhost:8090`。

## 类型检查与生产构建

```sh
pnpm build
```

## 代码检查

```sh
pnpm lint
```

## 目录说明

```text
src/
├─ assets/       静态资源与全局样式
├─ layouts/      页面布局
├─ router/       路由配置
├─ types/        自动生成的 TypeScript 类型声明
├─ utils/        Axios 客户端与通用工具
└─ views/        路由页面
```

## REST 请求

业务接口统一通过 `src/utils/rest.ts` 发起请求：

```ts
import { rest } from '@/utils/rest'

interface ModelConfig {
  id: string
  name: string
}

const models = await rest.get<ModelConfig[]>('/v1/models')
const model = await rest.post<ModelConfig, ModelConfig>('/v1/models', formData)
await rest.delete<void>(`/v1/models/${modelId}`)
```
