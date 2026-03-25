ARG DOCKER_REGISTRY=registry.astralinux.ru
FROM ${DOCKER_REGISTRY}/nginx/astra-ubi18-nginx122-dp:0.0.2
ENV COMPONENT_PATH=/app/nginx/html/nsm-operator-ui
ADD build ${COMPONENT_PATH}
USER root
RUN /bin/bash -c 'cp -p ${COMPONENT_PATH}/remoteEntry.js timecheck.file; \
                touch -r timecheck.file /app/nginx/html/*/*.js; \
                for file in /app/nginx/html/*/*.js; do gzip -9 -c "$file" > "$file.gz"; done; \
                for file in /app/nginx/html/*/*/*.js; do gzip -9 -c "$file" > "$file.gz"; done; \
                for file in ${COMPONENT_PATH}/static/css/*.css; do gzip -9 -c "$file" > "$file.gz"; done; \
                for file in /app/nginx/html/*/*.html; do gzip -9 -c "$file" > "$file.gz"; done; \
                for file in /app/nginx/html/*/*.json; do gzip -9 -c "$file" > "$file.gz"; done; \
                touch -r timecheck.file /app/nginx/html/*/*.gz; \
                touch -r timecheck.file /app/nginx/html/*/*.gz; \
                touch -r timecheck.file ${COMPONENT_PATH}/js/*.gz; \
                rm timecheck.file'
# www-data
USER 33
CMD ["nginx", "-g", "daemon off;"]