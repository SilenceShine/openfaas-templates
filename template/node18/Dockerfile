# 编译前端代码环境
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:18-alpine as builder

# 设置编译目录
WORKDIR /home

# 拷贝文件 保留相同层级结构
COPY ./ ./

# 设置镜像源 $$ 构建完整的镜像 拿到最终的js文件
RUN yarn config set registry https://registry.npmmirror.com && yarn build

# openfaas 看门狗
FROM --platform=${TARGETPLATFORM:-linux/amd64} ghcr.io/openfaas/of-watchdog:0.9.12 as watchdog

# 真实运行容器
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:18-alpine as ship

# copy看门狗文件
COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
COPY --from=builder /home/main.mjs /home/main.mjs

# 设置权限
RUN chmod +x /usr/bin/fwatchdog && chmod 777 /tmp

# 安装依赖和设置用户
RUN apk --no-cache add curl ca-certificates && addgroup -S app && adduser -S -g app app

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

# 设置用户为app
USER app

# Set correct permissions to use non root user
WORKDIR /home/

ENV cgi_headers="true"
ENV fprocess="node main.mjs"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"

ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"

ENV prefix_logs="false"

# oci不支持 只有docker支持
HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]
