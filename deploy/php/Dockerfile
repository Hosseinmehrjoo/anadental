FROM php:8.3.36-fpm-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libwebp-dev \
        libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) pdo_mysql gd zip opcache \
    && rm -rf /var/lib/apt/lists/*

COPY deploy/php/php.ini /usr/local/etc/php/conf.d/ana-dental.ini
COPY deploy/php/entrypoint.sh /usr/local/bin/ana-entrypoint.sh
RUN chmod +x /usr/local/bin/ana-entrypoint.sh

WORKDIR /var/www/html

ENTRYPOINT ["/usr/local/bin/ana-entrypoint.sh"]
CMD ["php-fpm"]
