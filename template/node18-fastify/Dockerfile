# 编译前端代码环境
FROM node:18-alpine

EXPOSE 8080

# 设置编译目录
WORKDIR /home/node

# 拷贝文件 保留相同层级结构
COPY ./ ./

# 设置镜像源 $$ 构建完整的镜像 拿到最终的js文件
RUN yarn config set registry https://registry.npmmirror.com && cd function && yarn && cd /home/node && yarn

CMD ["yarn", "start"]
