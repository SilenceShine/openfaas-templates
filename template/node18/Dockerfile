# 编译前端代码环境
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:18-alpine as builder

# 设置编译目录
WORKDIR /home/app

# 拷贝文件 保留相同层级结构
COPY ./ ./

# 设置镜像源
RUN yarn config set registry https://registry.npmmirror.com
# 构建完整的镜像 拿到最终的js文件
RUN yarn build

RUN ls

