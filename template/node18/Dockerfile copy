# 创建临时容器
FROM --platform=${TARGETPLATFORM:-linux/amd64} ghcr.io/openfaas/of-watchdog:0.9.12 as watchdog
# 真实运行容器
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:18-alpine as ship

# 定义变量
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# 从watchdog拷贝文件到ship
COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
# 设置权限
RUN chmod +x /usr/bin/fwatchdog

# 安装依赖和设置用户
RUN apk --no-cache add curl ca-certificates \
    && addgroup -S app && adduser -S -g app app

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

RUN chmod 777 /tmp

# 设置用户为app
USER app

# 创建函数目录
RUN mkdir -p /home/app/function

# 设置工作目录
WORKDIR /home/app

# 拷贝文件
COPY --chown=app:app package.json ./

# This ordering means the npm installation is cached for the outer function handler.
RUN npm i

# Copy outer function handler
COPY --chown=app:app index.js ./

# COPY function node packages and install, adding this as a separate
# entry allows caching of npm install

WORKDIR /home/app/function
COPY --chown=app:app function/*.json ./

RUN npm i

# COPY function files and folders
COPY --chown=app:app function/ ./

# Run any tests that may be available
RUN npm test

# Set correct permissions to use non root user
WORKDIR /home/app/

ENV cgi_headers="true"
ENV fprocess="node index.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"

ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"

ENV prefix_logs="false"

HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]
