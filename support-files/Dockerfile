FROM node:20.11.1-alpine AS deps
WORKDIR /app
COPY package*.json .
RUN npm install

FROM node:20.11.1-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
ADD . .
RUN npm run build

FROM node:20.11.1-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV KEYCLOAK_CLIENT_ID="your-client-id"
ENV KEYCLOAK_CLIENT_SECRET="your-client-secret"
ENV KEYCLOAK_ISSUER="http://your-keycloak-issuer"
ENV NEXTAUTH_URL="http://your-nextauth-url"
ENV NEXTAUTH_SECRET="random secret"
ENV NEXT_PUBLIC_API_URL="https://your-production-api-url.com"

CMD ["npm", "run", "start"]