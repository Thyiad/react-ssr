FROM base-registry.zhonganinfo.com/env/node:10.14.1

ENV SASS_BINARY_SITE http://npm.zhonganinfo.com/node-mirrors/node-sass/

ENV NPM_CONFIG_REGISTRY http://npm.zhonganinfo.com

RUN npm install --registry http://npm.zhonganinfo.com

EXPOSE 8080

RUN npm run build

CMD ["node","dist/server/main.js"]