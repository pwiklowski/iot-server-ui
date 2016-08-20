FROM nginx
COPY nginx-config /etc/nginx/conf.d/default.conf

COPY index.html /webui/
COPY dist /webui/dist/
COPY static /webui/static/
COPY templates /webui/templates

EXPOSE 9000