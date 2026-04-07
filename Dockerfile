FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["RosraApp.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Install Playwright Chromium in the build stage
RUN dotnet tool install --global Microsoft.Playwright.CLI || true
RUN cd /app/publish && pwsh -File playwright.ps1 install chromium --with-deps 2>/dev/null || \
    dotnet /app/publish/playwright.ps1 install chromium 2>/dev/null || true

FROM base AS final
WORKDIR /app

# Install Chromium dependencies for Playwright headless PDF generation
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 \
    libxcomposite1 libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 libxshmfence1 fonts-liberation fonts-noto-color-emoji \
    wget ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Install Playwright browsers at runtime
RUN if [ -f playwright.ps1 ]; then \
    apt-get update && apt-get install -y --no-install-recommends powershell && \
    pwsh playwright.ps1 install chromium && \
    apt-get remove -y powershell && apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*; \
    fi || true

# Set Playwright to look for browsers in default location
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Railway sets PORT env var
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "RosraApp.dll"]
