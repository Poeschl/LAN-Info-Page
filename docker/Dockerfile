FROM node:25-alpine
WORKDIR /app

COPY --chmod=110 docker/entrypoint.sh /entrypoint.sh
ADD .output ./

# Install only production dependencies for the server
# Original modules are excluded by .dockerignore
RUN npm --prefix /app/server install --omit=dev

ENV PORT=80
ENV HOST=0.0.0.0
EXPOSE 80

CMD []
ENTRYPOINT ["/entrypoint.sh"]
