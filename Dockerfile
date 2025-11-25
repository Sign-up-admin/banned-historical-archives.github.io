# Use Node.js 20 LTS
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json .npmrc ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Copy PDF.js dist to public folder (needed for build)
RUN cp -r ./node_modules/pdfjs-dist ./public/

# Set environment variables
ENV NODE_ENV=production
ENV LOCAL_SEARCH_ENGINE=1
ENV LOCAL_INDEXES=1

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]